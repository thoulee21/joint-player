import React, { useCallback, useMemo, useState } from 'react';
import { Dimensions, RefreshControl, StyleSheet } from 'react-native';
import { ActivityIndicator, Divider, Text, useTheme } from 'react-native-paper';
//@ts-expect-error
import SwipeableFlatList from 'react-native-swipeable-list';
import useSWRInfinite from 'swr/infinite';
import { useDebounce } from '../hook';
import { HotAlbum } from '../types/albumArtist';
import { Main, Song } from '../types/albumDetail';
import { songToTrack } from '../utils';
import { LottieAnimation } from './LottieAnimation';
import { AddToQueueButton, QuickActionsWrapper } from './QuickActions';
import { SongItem } from './SongItem';

export function AlbumContent({ album }: { album: HotAlbum }) {
    const appTheme = useTheme();
    const [refreshing, setRefreshing] = useState(false);

    const { data, error, setSize, mutate } = useSWRInfinite<Main>((index) =>
        `http://music.163.com/api/album/${album.id}?ext=true&offset=${index * 10}&total=true&limit=10`,
    );

    const hasMore = useMemo(() =>
        data && data[0].album.size !== data.flatMap((d) => d.album.songs).length,
        [data]
    );

    const onRefresh = useCallback(async () => {
        setRefreshing(true);
        await mutate();
        setRefreshing(false);
    }, [mutate]);

    const loadMore = useDebounce(() => {
        if (hasMore) {
            setSize(prev => prev + 1);
        }
    });

    const renderItem = useCallback(({ index, item }: {
        index: number, item: Song
    }) => (
        <SongItem index={index} item={songToTrack(item)} />
    ), []);

    const renderQuickActions = useCallback(({ index, item }: {
        index: number, item: Song
    }) => (
        <QuickActionsWrapper
            index={index}
            item={songToTrack(item)}
        >
            <AddToQueueButton />
        </QuickActionsWrapper>
    ), []);

    if (error) {
        return (
            <LottieAnimation
                animation="breathe"
                caption="Try to refresh later"
            >
                <Text style={[
                    styles.error,
                    { color: appTheme.colors.error },
                ]}>
                    Error: {error.message}
                </Text>
            </LottieAnimation>
        );
    }

    return (
        <SwipeableFlatList
            data={data?.flatMap((d) => d.album.songs)}
            keyExtractor={(item: Song) => item.id.toString()}
            initialNumToRender={10}
            style={[styles.tracks, {
                backgroundColor: appTheme.colors.surface,
            }]}
            renderItem={renderItem}
            onEndReached={loadMore}
            ListFooterComponent={
                !error && hasMore ? (
                    <ActivityIndicator style={styles.moreLoading} />
                ) : null
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
            maxSwipeDistance={50}
            renderQuickActions={renderQuickActions}
            ItemSeparatorComponent={<Divider />}
            ListEmptyComponent={
                <ActivityIndicator size="large" style={styles.loading} />
            }
        />
    );
}

const styles = StyleSheet.create({
    loading: {
        marginTop: '40%',
    },
    moreLoading: {
        marginVertical: '2%',
    },
    tracks: {
        height: Dimensions.get('window').height * 0.7,
    },
    error: {
        textAlign: 'center',
    },
});
