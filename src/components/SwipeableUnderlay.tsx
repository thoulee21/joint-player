import React, { PropsWithChildren } from 'react';
import { StyleSheet } from 'react-native';
import { useAnimatedStyle } from 'react-native-reanimated';
import { useSwipeableItemParams } from 'react-native-swipeable-item';
import { TrackType } from '../services/GetTracksService';
import { QuickActionsWrapper } from './QuickActions';

export const SwipeableUnderlay = ({
    children, mode, backgroundColor,
}: PropsWithChildren<{
    mode: 'left' | 'right';
    backgroundColor: string;
}>) => {
    const {
        percentOpen,
        item,
    } = useSwipeableItemParams<TrackType>();

    // Fade in on open
    const animStyle = useAnimatedStyle(
        () => ({ opacity: percentOpen.value }),
        [percentOpen]
    );

    const underlayStyle = mode === 'right'
        ? styles.underlayRight
        : styles.underlayLeft;

    return (
        <QuickActionsWrapper
            item={item}
            style={[
                styles.row,
                underlayStyle,
                animStyle,
                { backgroundColor },
            ]}
        >
            {children}
        </QuickActionsWrapper>
    );
};

const styles = StyleSheet.create({
    row: {
        flexDirection: 'row',
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        padding: 15,
    },
    underlayRight: {
        flex: 1,
        justifyContent: 'flex-start',
    },
    underlayLeft: {
        flex: 1,
        justifyContent: 'flex-end',
    },
});
