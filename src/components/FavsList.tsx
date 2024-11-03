import React, { useCallback, useRef } from 'react';
import { Dimensions, StyleSheet } from 'react-native';
import DraggableFlatList, {
    type RenderItemParams,
} from 'react-native-draggable-flatlist';
import HapticFeedback, {
    HapticFeedbackTypes,
} from 'react-native-haptic-feedback';
import { Divider, Text, useTheme } from 'react-native-paper';
import { useAppDispatch, useAppSelector } from '../hook';
import { favs, setFavs } from '../redux/slices';
import { TrackType } from '../services/GetTracksService';
import { DraggableItem } from './DraggableSongItem';
import { LottieAnimation } from './LottieAnimation';
import { AddToQueueButton, DeleteFavButton } from './QuickActions';
import { SongItem } from './SongItem';
import { SwipeableUnderlay } from './SwipeableUnderlay';

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
    const dispatch = useAppDispatch();
    const appTheme = useTheme();

    const favorites = useAppSelector(favs);
    const itemRefs = useRef(new Map());

    const renderUnderlayRight = useCallback(() => (
        <SwipeableUnderlay
            mode="right"
            backgroundColor={appTheme.colors.tertiaryContainer}
        >
            <AddToQueueButton />
        </SwipeableUnderlay>
    ), [appTheme.colors.tertiaryContainer]);

    const renderUnderlayLeft = useCallback(() => (
        <SwipeableUnderlay
            mode="left"
            backgroundColor={appTheme.colors.errorContainer}
        >
            <DeleteFavButton />
        </SwipeableUnderlay>
    ), [appTheme.colors.errorContainer]);

    const renderItem = useCallback(({
        getIndex, drag, item, isActive,
    }: RenderItemParams<TrackType>
    ) => {
        const index = getIndex() || 0;

        const onLongPress = () => {
            HapticFeedback.trigger(
                HapticFeedbackTypes.effectTick
            );
            drag();
        };

        return (
            <DraggableItem
                item={item}
                itemRefs={itemRefs}
                renderUnderlayLeft={renderUnderlayLeft}
                renderUnderlayRight={renderUnderlayRight}
            >
                <SongItem
                    item={item}
                    index={index}
                    onLongPress={onLongPress}
                    showAlbum
                    isActive={isActive}
                />
            </DraggableItem>
        );
    }, [renderUnderlayLeft, renderUnderlayRight]);

    const keyExtractor = useCallback(
        (item: TrackType) => item.id.toString(), []
    );

    const updateFavs = useCallback((
        { data: draggedData }: { data: TrackType[] }
    ) => {
        dispatch(setFavs(draggedData));
        //no need to add dispatch to dependencies
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <DraggableFlatList
            data={favorites}
            renderItem={renderItem}
            keyExtractor={keyExtractor}
            containerStyle={[styles.favs, {
                backgroundColor: appTheme.colors.surface,
            }]}
            ListEmptyComponent={<NoFavs />}
            ItemSeparatorComponent={Divider}
            onDragEnd={updateFavs}
            activationDistance={20}
        />
    );
};

const styles = StyleSheet.create({
    favs: {
        flex: 1,
    },
    noFavs: {
        textAlign: 'center',
    },
});
