import React, { PropsWithChildren } from 'react';
import { StyleSheet } from 'react-native';
import { useTheme } from 'react-native-paper';
import { useAnimatedStyle } from 'react-native-reanimated';
import { useSwipeableItemParams } from 'react-native-swipeable-item';
import { TrackType } from '../services/GetTracksService';
import { QuickActionsWrapper } from './QuickActions';

export const SwipeableUnderlay = ({ children, mode }:
    PropsWithChildren<{ mode: 'left' | 'right' }>
) => {
    const appTheme = useTheme();
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

    const style = [styles.row, {
        backgroundColor: mode === 'right'
            ? appTheme.colors.tertiaryContainer
            : appTheme.colors.errorContainer,
    }];

    return (
        <QuickActionsWrapper
            item={item}
            style={[style, underlayStyle, animStyle]}
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
