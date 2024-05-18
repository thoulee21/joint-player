import { useNavigation, useRoute } from '@react-navigation/native';
import React, { Suspense, useMemo, useState } from 'react';
import {
    FlatList,
    Platform,
    RefreshControl,
    ScrollView,
    StatusBar,
    StyleSheet,
    ToastAndroid,
    TouchableWithoutFeedback,
    View
} from 'react-native';
import HapticFeedback, {
    HapticFeedbackTypes
} from 'react-native-haptic-feedback';
import {
    ActivityIndicator,
    Avatar,
    Button,
    Card,
    IconButton,
    List,
    Text,
    useTheme
} from 'react-native-paper';
import TrackPlayer from 'react-native-track-player';
import useSWRInfinite from 'swr/infinite';
import { BlurBackground } from '../components';
import { useAppDispatch, useDebounce } from '../hook';
import { clearQueue, addToQueue as reduxAddQueue, setQueue } from '../redux/slices';
import { TrackType } from '../services';
import { HotAlbum } from '../types/albumArtist';
import { Main, Song } from '../types/albumDetail';
import { songToTrack } from '../utils';

function SongItem({ item }: { item: Song }) {
    const dispatch = useAppDispatch();
    const trackData = useMemo(() => songToTrack(item), [item]);

    const play = async () => {
        dispatch(clearQueue());
        dispatch(reduxAddQueue(trackData));
        await TrackPlayer.reset();
        await TrackPlayer.add(trackData);
        await TrackPlayer.play();
    };

    const addToQueue = async () => {
        dispatch(reduxAddQueue(trackData));
        await TrackPlayer.add(trackData);
        ToastAndroid.show('Added to queue', ToastAndroid.SHORT);
    };

    return (
        <List.Item
            left={(props) => (
                <IconButton {...props}
                    icon="play-circle-outline"
                    onPress={play}
                />
            )}
            title={item.name}
            description={item.artists.map(ar => ar.name).join(', ')}
            onPress={play}
            right={(props) => (
                <IconButton {...props}
                    icon="music-note-plus"
                    onPress={addToQueue}
                />
            )}
        />
    );
}

const HeaderCard = ({ album }: { album: HotAlbum }) => {
    const navigation = useNavigation();
    const appTheme = useTheme();

    const goComments = () => {
        //@ts-ignore
        navigation.push('Comments', {
            commentThreadId: album.commentThreadId
        });
    };

    return (
        <View style={styles.card}>
            <Card.Title
                left={(props) => (
                    <TouchableWithoutFeedback
                        onPress={() => {
                            HapticFeedback.trigger('effectHeavyClick');
                            navigation.goBack();
                        }}
                    >
                        <Avatar.Image {...props}
                            source={{ uri: album.picUrl }}
                        />
                    </TouchableWithoutFeedback>
                )}
                title={album.name}
                subtitle={album.artists.map((ar) => ar.name).join(', ')}
                subtitleStyle={{ color: appTheme.colors.primary }}
                right={(props) => (
                    <IconButton {...props}
                        icon="comment-text-outline"
                        onPress={goComments}
                    />
                )}
            />
        </View>
    );
};

const AlbumDescription = ({ description }: { description?: string }) => {
    const [showFullDesc, setShowFullDesc] = useState(false);
    const height = Platform.OS === 'android' && showFullDesc ? 380 : 0;

    if (description) {
        return (
            <ScrollView
                fadingEdgeLength={100}
                showsVerticalScrollIndicator={showFullDesc}
            >
                <Text
                    style={styles.description}
                    numberOfLines={showFullDesc ? undefined : 5}
                    onPress={() => {
                        HapticFeedback.trigger(
                            HapticFeedbackTypes.effectHeavyClick
                        );
                        setShowFullDesc(!showFullDesc);
                    }}
                >
                    {description}
                </Text>
                <View style={{ height }} />
            </ScrollView >
        );
    }
};

function AlbumContent({ album }: { album: HotAlbum }) {
    const dispatch = useAppDispatch();
    const appTheme = useTheme();
    const { data, error, isLoading, setSize, size, mutate } = useSWRInfinite<Main>(
        (index) => `http://music.163.com/api/album/${album.id}?ext=true&offset=${index * 10}&total=true&limit=10`,
        { suspense: true }
    );

    const [refreshing, setRefreshing] = useState(false);
    const hasMore = useMemo(() =>
        data && data[0].album.size !== data.flatMap((d) => d.album.songs).length,
        [data]
    );

    const onRefresh = async () => {
        setRefreshing(true);
        await mutate();
        setRefreshing(false);
    };

    const loadMore = useDebounce(() => {
        if (hasMore) {
            setSize(size + 1);
        }
    });

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

    const playAll = async () => {
        const tracksData = data?.flatMap(d => d.album.songs)
            .map(songToTrack) as TrackType[];
        dispatch(setQueue(tracksData));
        await TrackPlayer.reset();
        await TrackPlayer.add(tracksData);
        await TrackPlayer.play();
    };

    return (
        <View style={styles.content}>
            <HeaderCard album={album} />
            <AlbumDescription
                description={data && data[0].album.description}
            />

            <View style={styles.songsHeader}>
                <Button
                    icon="play-circle-outline"
                    onPress={playAll}
                >
                    Play All
                </Button>
                <List.Subheader>
                    {data?.flatMap(d => d.album.songs).length} song(s)
                </List.Subheader>
            </View>
            <FlatList
                data={data?.flatMap((d) => d.album.songs)}
                fadingEdgeLength={100}
                keyExtractor={(item) => item.id.toString()}
                renderItem={props => <SongItem {...props} />}
                onEndReached={loadMore}
                ListFooterComponent={() =>
                    <>
                        {!isLoading && !error && hasMore ? (
                            <ActivityIndicator style={styles.moreLoading} />
                        ) : null}
                        <View style={styles.androidView} />
                    </>

                }
                refreshing={refreshing}
                onRefresh={onRefresh}
                refreshControl={
                    <RefreshControl
                        refreshing={refreshing}
                        onRefresh={onRefresh}
                        colors={[appTheme.colors.primary]}
                        progressBackgroundColor={appTheme.colors.surface}
                    />
                }
            />
        </View>
    );
}
export function AlbumDetail() {
    const { album } = (useRoute().params as { album: HotAlbum });

    return (
        <BlurBackground>
            <View style={styles.container}>
                <Suspense fallback={
                    <ActivityIndicator size="large" style={styles.loading} />
                }>
                    <AlbumContent album={album} />
                </Suspense>
            </View>
        </BlurBackground>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignContent: 'center',
    },
    loading: {
        marginTop: '40%'
    },
    content: {
        marginTop: StatusBar.currentHeight
    },
    header: {
        backgroundColor: 'transparent'
    },
    card: {
        marginHorizontal: '2%'
    },
    description: {
        marginHorizontal: '6%',
    },
    songsHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginHorizontal: '2%'
    },
    moreLoading: {
        marginVertical: '2%'
    },
    androidView: {
        height: Platform.OS === 'android' ? 220 : 0
    }
});
