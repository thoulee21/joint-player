import React from 'react';
import { StyleSheet } from 'react-native';
import { Divider, Text, useTheme } from 'react-native-paper';
//@ts-expect-error
import SwipeableFlatList from 'react-native-swipeable-list';
import TrackPlayer from 'react-native-track-player';
import { QuickActions, SongItem, TracksHeader } from '.';
import { useAppDispatch, useAppSelector } from '../hook';
import { favs, setQueueAsync } from '../redux/slices';
import { TrackType } from '../services';

export const FavsList = () => {
    const appTheme = useTheme();
    const dispatch = useAppDispatch();
    const favorites = useAppSelector(favs);

    const playAll = async () => {
        await dispatch(setQueueAsync(favorites));
        await TrackPlayer.play();
    };

    const NoFavs = () => {
        return (
            <Text
                style={styles.noFavs}
                variant="titleLarge"
            >
                No favorites yet
            </Text>
        );
    };

    return (
        <SwipeableFlatList
            style={[styles.favs, {
                backgroundColor: appTheme.colors.surface,
                borderTopLeftRadius: appTheme.roundness * 5,
                borderTopRightRadius: appTheme.roundness * 5,
            }]}
            data={favorites}
            renderItem={({ item, index }: {
                item: TrackType, index: number
            }) => (
                <SongItem track={item} index={index} />
            )}
            keyExtractor={(item: TrackType) => item.id.toString()}
            ListHeaderComponent={
                <TracksHeader
                    onPress={playAll}
                    length={favorites.length}
                />
            }
            ListEmptyComponent={<NoFavs />}
            maxSwipeDistance={110}
            renderQuickActions={({ index, item }: {
                index: number, item: TrackType
            }) => (
                <QuickActions index={index} item={item} />
            )}
            ItemSeparatorComponent={<Divider />}
        />
    );
};

const styles = StyleSheet.create({
    favs: {
        flex: 1,
    },
    noFavs: {
        textAlign: 'center',
        marginTop: '50%',
    },
});
