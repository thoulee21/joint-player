import { useNavigation, useRoute } from '@react-navigation/native';
import React, { Suspense, useState } from 'react';
import {
    Dimensions,
    FlatList,
    RefreshControl,
    StatusBar,
    StyleSheet,
    View
} from 'react-native';
import HapticFeedback, { HapticFeedbackTypes } from 'react-native-haptic-feedback';
import { ActivityIndicator, Card, Chip, Text, useTheme } from 'react-native-paper';
import useSWRInfinite from 'swr/infinite';
import { BlurBackground } from '../components';
import { useDebounce } from '../hook';
import { Artist as ArtistType, HotAlbum, Main } from '../types/albumArtist';
import { toReadableDate } from '../utils';

const CHIPS = ['Albums'];

const Chips = () => {
    return (
        <View style={styles.chips}>
            {CHIPS.map((chip, index) => (
                <Chip
                    key={chip}
                    style={styles.chip}
                    selected={!index}
                    onPress={() => {
                        HapticFeedback.trigger(
                            HapticFeedbackTypes.effectHeavyClick
                        );
                        //TODO
                    }}
                >
                    {chip}
                </Chip>
            ))}
        </View>
    );
};

const Album = ({ item }: { item: HotAlbum }) => {
    const navigation = useNavigation();
    const appTheme = useTheme();

    return (
        <Card
            style={styles.album}
            onPress={() => {
                //@ts-ignore
                navigation.navigate('AlbumDetail', { album: item });
            }}
        >
            <Card.Cover
                style={styles.albumPic}
                source={{ uri: item.picUrl }}
            />
            <Card.Title
                title={item.name}
                subtitle={toReadableDate(item.publishTime)}
                subtitleStyle={{
                    color: appTheme.dark
                        ? appTheme.colors.onSurfaceDisabled
                        : appTheme.colors.backdrop
                }}
            />
        </Card>
    );
};

const AlbumHeader = ({ artist }: { artist: ArtistType }) => {
    const navigation = useNavigation();
    const appTheme = useTheme();

    return (
        <View style={styles.albumHeader}>
            <View style={styles.albumHeaderTitle}>
                <Text variant="headlineSmall">
                    {artist.name}
                </Text>
                <Text style={[styles.artistAlias, {
                    color: appTheme.dark
                        ? appTheme.colors.onSurfaceDisabled
                        : appTheme.colors.backdrop
                }]}>
                    {artist.alias.join(', ')}
                </Text>
            </View>
            <Card
                onLongPress={() => {
                    HapticFeedback.trigger(
                        HapticFeedbackTypes.effectDoubleClick
                    );
                    //@ts-ignore
                    navigation.push('WebView', {
                        url: artist.picUrl,
                        title: artist.name,
                    });
                }}
            >
                <Card.Cover
                    source={{ uri: artist.picUrl }}
                />
            </Card>
        </View>
    );
};

function Albums({ artistID }: { artistID: number }) {
    const appTheme = useTheme();
    const [refreshing, setRefreshing] = useState(false);

    const { data, error, isLoading, setSize, size, mutate } = useSWRInfinite<Main>(
        (index) => `http://music.163.com/api/artist/albums/${artistID}?offset=${index * 10}&limit=10&total=true`,
        { suspense: true }
    );

    const loadMore = useDebounce(() => setSize(size + 1));
    const onRefresh = async () => {
        setRefreshing(true);
        await mutate();
        setRefreshing(false);
    };

    if (isLoading) {
        return null;
    }

    if (error) {
        return (
            <Text style={{ color: appTheme.colors.error }}>
                Error: {error.message}
            </Text>
        );
    }

    return (
        <>
            <AlbumHeader artist={data?.[0].artist as ArtistType} />

            <Chips />
            <FlatList
                data={data?.flatMap((page) => page.hotAlbums)}
                numColumns={2}
                fadingEdgeLength={50}
                keyExtractor={(item) => item.id.toString()}
                renderItem={(props) => <Album {...props} />}
                onEndReached={loadMore}
                ListFooterComponent={() => {
                    if (!isLoading && !error && data && data[data.length - 1].more) {
                        return <ActivityIndicator style={styles.moreLoading} />;
                    }
                }}
                refreshing={refreshing}
                onRefresh={onRefresh}
                refreshControl={
                    <RefreshControl
                        refreshing={refreshing}
                        onRefresh={onRefresh}
                        progressViewOffset={StatusBar.currentHeight}
                        colors={[appTheme.colors.primary]}
                        progressBackgroundColor={appTheme.colors.surface}
                    />
                }
            />
        </>
    );
}

export function Artist() {
    const { artist } = (useRoute().params as { artist: ArtistType });

    return (
        <BlurBackground>
            <View style={styles.content}>
                <Suspense fallback={<ActivityIndicator size="large" />}>
                    <Albums artistID={artist.id} />
                </Suspense>
            </View>
        </BlurBackground>
    );
}

const styles = StyleSheet.create({
    content: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    header: {
        backgroundColor: 'transparent',
    },
    albumHeader: {
        marginHorizontal: '2%',
        marginBottom: '1%',
        marginTop: StatusBar.currentHeight,
        width: Dimensions.get('window').width - 20,
    },
    albumHeaderTitle: {
        flexDirection: 'row',
        alignItems: 'baseline',
        margin: '3%'
    },
    artistAlias: {
        marginLeft: '1%',
    },
    chips: {
        flexDirection: 'row',
        width: '100%'
    },
    chip: {
        marginLeft: '3%',
        marginVertical: '1%',
        width: 'auto'
    },
    albumPic: {
        width: Dimensions.get('window').width / 2 - 20,
        height: 200,
    },
    album: {
        margin: '2%'
    },
    moreLoading: {
        marginVertical: '2%'
    }
});
