import React, {
    useCallback,
    type MutableRefObject,
    type PropsWithChildren,
} from 'react';
import { ScaleDecorator } from 'react-native-draggable-flatlist';
import SwipeableItem, {
    type OpenDirection,
    type SwipeableItemImperativeRef,
} from 'react-native-swipeable-item';
import { TrackType } from '../services/GetTracksService';
import { AddToQueueButton, DeleteFavButton } from './QuickActions';
import { SwipeableUnderlay } from './SwipeableUnderlay';

export const DraggableItem = ({
    item,
    itemRefs,
    children,
}: PropsWithChildren<{
    item: TrackType,
    itemRefs: MutableRefObject<Map<any, any>>;
}>) => {
    const renderUnderlayRight = useCallback(() => (
        <SwipeableUnderlay mode="right">
            <AddToQueueButton />
        </SwipeableUnderlay>
    ), []);

    const renderUnderlayLeft = useCallback(() => (
        <SwipeableUnderlay mode="left">
            <DeleteFavButton />
        </SwipeableUnderlay>
    ), []);

    const onChange = useCallback(({ openDirection }: {
        openDirection: OpenDirection
    }) => {
        if (openDirection) {
            // Close all other open items
            [...itemRefs.current.entries()].forEach(
                ([key, ref]) => {
                    if (key !== item.id && ref) {
                        ref.close();
                    }
                }
            );
        }
    }, [item.id, itemRefs]);

    const ref = useCallback((swipeRef:
        SwipeableItemImperativeRef | null
    ) => {
        if (swipeRef && !itemRefs.current.get(item.id)) {
            itemRefs.current.set(item.id, swipeRef);
        }
    }, [item.id, itemRefs]);

    return (
        <ScaleDecorator>
            <SwipeableItem
                key={item.id}
                item={item}
                ref={ref}
                onChange={onChange}
                overSwipe={50}
                renderUnderlayRight={renderUnderlayRight}
                renderUnderlayLeft={renderUnderlayLeft}
                snapPointsLeft={[100]}
                snapPointsRight={[100]}
            >
                {children}
            </SwipeableItem>
        </ScaleDecorator>
    );
};
