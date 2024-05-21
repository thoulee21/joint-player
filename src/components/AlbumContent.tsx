import React, { useMemo, useState } from 'react';
import { Dimensions, FlatList, RefreshControl, StatusBar, StyleSheet, View } from 'react-native';
import { ActivityIndicator, Button, List, Text, useTheme } from 'react-native-paper';
import TrackPlayer from 'react-native-track-player';
import useSWRInfinite from 'swr/infinite';
import { AlbumDescription, HeaderCard, SongItem } from '.';
import { useAppDispatch, useDebounce } from '../hook';
import { setQueueAsync } from '../redux/slices';
import { TrackType } from '../services';
import { HotAlbum } from '../types/albumArtist';
import { Main } from '../types/albumDetail';
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
                style={styles.tracks}
                renderItem={props => <SongItem {...props} />}
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
            />
        </View>
    );
}

const styles = StyleSheet.create({
    content: {
        flex: 1,
        marginTop: StatusBar.currentHeight,
    },
    header: {
        backgroundColor: 'transparent'
    },
    songsHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginHorizontal: '2%'
    },
    moreLoading: {
        marginVertical: '2%'
    },
    tracks: {
        height: Dimensions.get('window').height * 0.7
    }
});
