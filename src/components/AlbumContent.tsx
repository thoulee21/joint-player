import React, { useMemo, useState } from 'react';
import { Dimensions, RefreshControl, StatusBar, StyleSheet, View } from 'react-native';
import { ActivityIndicator, Divider, Text, useTheme } from 'react-native-paper';
//@ts-expect-error
import SwipeableFlatList from 'react-native-swipeable-list';
import TrackPlayer from 'react-native-track-player';
import useSWRInfinite from 'swr/infinite';
import {
    AddToQueueButton,
    AlbumDescription,
    HeaderCard,
    QuickActionsWrapper,
    SongItem,
    TracksHeader
} from '.';
import { useAppDispatch, useDebounce } from '../hook';
import { setQueueAsync } from '../redux/slices';
import { TrackType } from '../services';
import { HotAlbum } from '../types/albumArtist';
import { Main, Song } from '../types/albumDetail';
import { songToTrack } from '../utils';

export function AlbumContent({ album }: { album: HotAlbum }) {
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
        await dispatch(setQueueAsync(tracksData));
        await TrackPlayer.play();
    };

    return (
        <View style={styles.content}>
            <HeaderCard album={album} />
            <AlbumDescription
                description={data && data[0].album.description}
            />

            <TracksHeader
                onPress={playAll}
                length={data?.flatMap((d) => d.album.songs).length || 0}
            />
            <SwipeableFlatList
                data={data?.flatMap((d) => d.album.songs)}
                keyExtractor={(item: Song) => item.id.toString()}
                style={[styles.tracks, {
                    backgroundColor: appTheme.colors.surface,
                }]}
                renderItem={({ index, item }: {
                    index: number, item: Song
                }) => (
                    <SongItem index={index} item={songToTrack(item)} />
                )}
                onEndReached={loadMore}
                ListFooterComponent={
                    !isLoading && !error && hasMore ? (
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
                renderQuickActions={({ index, item }: {
                    index: number, item: Song
                }) => (
                    <QuickActionsWrapper
                        index={index}
                        item={songToTrack(item)}
                    >
                        <AddToQueueButton />
                    </QuickActionsWrapper>
                )}
                ItemSeparatorComponent={<Divider />}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    content: {
        flex: 1,
        marginTop: StatusBar.currentHeight,
    },
    moreLoading: {
        marginVertical: '2%'
    },
    tracks: {
        height: Dimensions.get('window').height * 0.7
    }
});
