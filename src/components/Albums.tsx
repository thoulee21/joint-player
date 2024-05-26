import React, { useState } from 'react';
import { FlatList, RefreshControl, StatusBar, StyleSheet, View } from 'react-native';
import HapticFeedback, { HapticFeedbackTypes } from 'react-native-haptic-feedback';
import { ActivityIndicator, Chip, Text, useTheme } from 'react-native-paper';
import useSWRInfinite from 'swr/infinite';
import { Album, AlbumHeader } from '.';
import { useDebounce } from '../hook';
import { Artist, Main } from '../types/albumArtist';

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

export function Albums({ artistID }: { artistID: number }) {
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

    if (isLoading) { return null; }
    if (error) {
        return (
            <Text style={{ color: appTheme.colors.error }}>
                Error: {error.message}
            </Text>
        );
    }
    return (
        <>
            <AlbumHeader artist={data?.[0].artist as Artist} />
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

const styles = StyleSheet.create({
    header: {
        backgroundColor: 'transparent',
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
    moreLoading: {
        marginVertical: '2%'
    }
});
