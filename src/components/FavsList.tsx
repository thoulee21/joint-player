import React from 'react';
import { Dimensions, FlatList, StyleSheet } from 'react-native';
import { Text } from 'react-native-paper';
import TrackPlayer from 'react-native-track-player';
import { FavsHeader, SongItem } from '.';
import { useAppDispatch, useAppSelector } from '../hook';
import { favs, setQueue } from '../redux/slices';

export const FavsList = () => {
    const dispatch = useAppDispatch();
    const favorites = useAppSelector(favs);

    const playAll = async () => {
        dispatch(setQueue(favorites));
        await TrackPlayer.reset();
        await TrackPlayer.add(favorites);
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
        <FlatList
            data={favorites}
            style={styles.favs}
            renderItem={({ item }) => (
                <SongItem track={item} />
            )}
            keyExtractor={(item) => item.id.toString()}
            ListHeaderComponent={
                <FavsHeader
                    onPress={playAll}
                    length={favorites.length}
                />
            }
            ListEmptyComponent={<NoFavs />} />
    );
};

const styles = StyleSheet.create({
    favs: {
        marginTop: Dimensions.get('window').height * 0.07,
    },
    noFavs: {
        textAlign: 'center',
        marginTop: '50%',
    },
});
