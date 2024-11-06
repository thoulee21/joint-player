import React, { PropsWithChildren, useCallback } from 'react';
import { LayoutAnimation, StyleSheet, ToastAndroid } from 'react-native';
import HapticFeedback, { HapticFeedbackTypes } from 'react-native-haptic-feedback';
import { IconButton, useTheme } from 'react-native-paper';
import Animated, { type AnimatedStyle } from 'react-native-reanimated';
import { useSwipeableItemParams } from 'react-native-swipeable-item';
import { useAppDispatch } from '../hook';
import { removeFav } from '../redux/slices/favs';
import { addToQueueAsync } from '../redux/slices/queue';
import { TrackType } from '../services/GetTracksService';

export const DeleteFavButton = () => {
    const dispatch = useAppDispatch();
    const appTheme = useTheme();
    const { item } = useSwipeableItemParams<TrackType>();

    const remove = useCallback(() => {
        HapticFeedback.trigger(
            HapticFeedbackTypes.effectTick
        );
        LayoutAnimation.configureNext(
            {
                duration: 250,
                create: {
                    type: LayoutAnimation.Types.easeIn,
                    property: LayoutAnimation.Properties.opacity,
                },
                update: {
                    type: LayoutAnimation.Types.easeIn,
                    property: LayoutAnimation.Properties.opacity,
                },
                delete: {
                    type: LayoutAnimation.Types.easeOut,
                    property: LayoutAnimation.Properties.opacity,
                },
            }
        );

        dispatch(removeFav(item));
        //no dispatch needed here
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [item]);

    return (
        <IconButton
            icon="delete-outline"
            style={styles.button}
            size={34}
            iconColor={appTheme.colors.onErrorContainer}
            onPress={remove}
        />
    );
};

export const AddToQueueButton = () => {
    const dispatch = useAppDispatch();
    const { item } = useSwipeableItemParams<TrackType>();

    const addToQueue = useCallback(async () => {
        HapticFeedback.trigger(
            HapticFeedbackTypes.effectHeavyClick
        );

        const { payload } = await dispatch(
            addToQueueAsync(item)
        );

        if (payload) {
            ToastAndroid.showWithGravity(
                'Added to queue',
                ToastAndroid.SHORT,
                ToastAndroid.TOP
            );
        }
        //no dispatch needed here
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [item]);

    return (
        <IconButton
            icon="playlist-plus"
            style={styles.button}
            size={34}
            onPress={addToQueue}
        />
    );
};

export const QuickActionsWrapper = ({
    children, style,
}: PropsWithChildren & {
    style?: AnimatedStyle<any>
}) => {
    return (
        <Animated.View
            style={[styles.container, style]}
        >
            {children}
        </Animated.View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'flex-end',
    },
    button: {
        alignItems: 'center',
        justifyContent: 'center',
        alignSelf: 'center',
    },
});
