import React, { useCallback } from 'react';
import { StyleSheet } from 'react-native';
import { Divider, Text, useTheme } from 'react-native-paper';
//@ts-expect-error
import SwipeableFlatList from 'react-native-swipeable-list';
import { useAppSelector } from '../hook';
import { favs } from '../redux/slices';
import { TrackType } from '../services/GetTracksService';
import { SongItem } from './SongItem';
import { AddToQueueButton, DeleteFavButton, QuickActionsProps, QuickActionsWrapper } from './QuickActions';

interface ListItemProps {
    item: TrackType,
    index: number
}

export const FavsList = () => {
    const appTheme = useTheme();
    const favorites = useAppSelector(favs);

    const NoFavs = () => (
        <Text style={styles.noFavs} variant="titleLarge">
            No favorites yet
        </Text>
    );

    const renderItem = useCallback((props: ListItemProps) =>
        <SongItem {...props} />, []);
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
    favs: { flex: 1 },
    noFavs: {
        textAlign: 'center',
        marginTop: '50%',
    },
});
