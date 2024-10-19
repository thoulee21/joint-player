import React, { useCallback } from 'react';
import { Dimensions, StyleSheet } from 'react-native';
import { Divider, Text, useTheme } from 'react-native-paper';
//@ts-expect-error
import SwipeableFlatList from 'react-native-swipeable-list';
import { useAppSelector } from '../hook';
import { favs } from '../redux/slices';
import { TrackType } from '../services/GetTracksService';
import { LottieAnimation } from './LottieAnimation';
import {
    AddToQueueButton,
    DeleteFavButton,
    QuickActionsProps,
    QuickActionsWrapper
} from './QuickActions';
import { SongItem } from './SongItem';

interface ListItemProps {
    item: TrackType,
    index: number
}

const NoFavs = () => (
    <LottieAnimation
        animation="teapot"
        caption="Add some songs to your favorites"
        style={{
            height: Dimensions.get('window').height / 1.2,
            width: Dimensions.get('window').width,
        }}
    >
        <Text style={styles.noFavs} variant="titleLarge">
            No favorites yet
        </Text>
    </LottieAnimation>
);
export const FavsList = () => {
    const appTheme = useTheme();
    const favorites = useAppSelector(favs);

    const renderItem = useCallback((props: ListItemProps) => (
        <SongItem {...props} />
    ), []);

    const renderQuickActions = useCallback((props: QuickActionsProps) => (
        <QuickActionsWrapper {...props}>
            <DeleteFavButton />
            <AddToQueueButton />
        </QuickActionsWrapper>
    ), []);

    return (
        <SwipeableFlatList
            style={[styles.favs, {
                backgroundColor: appTheme.colors.surface,
            }]}
            data={favorites}
            renderItem={renderItem}
            keyExtractor={(item: TrackType) => item.id.toString()}
            ListEmptyComponent={<NoFavs />}
            maxSwipeDistance={110}
            renderQuickActions={renderQuickActions}
            ItemSeparatorComponent={<Divider />}
        />
    );
};

const styles = StyleSheet.create({
    favs: {
        flex: 1
    },
    noFavs: {
        textAlign: 'center',
    },
});
