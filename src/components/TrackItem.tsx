import BottomSheet from '@gorhom/bottom-sheet';
import Color from 'color';
import React, { useCallback } from 'react';
import { TextStyle } from 'react-native';
import HapticFeedback, { HapticFeedbackTypes } from 'react-native-haptic-feedback';
import { IconButton, List, useTheme } from 'react-native-paper';
import { Style } from 'react-native-paper/lib/typescript/components/List/utils';
import TrackPlayer, { useActiveTrack } from 'react-native-track-player';
import { useAppDispatch } from '../hook';
import { removeFromQueueAsync } from '../redux/slices';
import { TrackType } from '../services/GetTracksService';
import type { ListLRProps } from '../types/paperListItem';

export interface ListRightProps {
    color: string;
    style?: Style;
}

export const TrackItem = ({ item, index, bottomSheetRef }: {
    item: TrackType;
    index: number;
    bottomSheetRef: React.RefObject<BottomSheet>
}) => {
    const dispatch = useAppDispatch();
    const appTheme = useTheme();
    const currentTrack = useActiveTrack();

    const active = currentTrack?.url === item.url;
    const titleStyle: TextStyle = {
        color: active
            ? appTheme.colors.primary
            : appTheme.colors.onBackground,
        fontWeight: active ? 'bold' : 'normal',
    };

    const chooseTrack = useCallback(async () => {
        await TrackPlayer.skip(index);
        await TrackPlayer.play();
        bottomSheetRef.current?.close();
    }, [bottomSheetRef, index]);

    const remove = useCallback(() => {
        HapticFeedback.trigger(
            HapticFeedbackTypes.effectDoubleClick
        );
        dispatch(removeFromQueueAsync(index));
        //no dispatch in dependency array
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [index]);

    const renderRightBtns = useCallback((props:
        ListRightProps
    ) => (
        <IconButton
            {...props}
            icon="close"
            iconColor={appTheme.dark
                ? appTheme.colors.onSurfaceDisabled
                : appTheme.colors.backdrop}
            onPress={remove}
        />
    ), [remove, appTheme]);

    const renderIcon = useCallback(
        ({ color, style }: ListLRProps) => (
            <List.Icon
                style={style}
                color={active ? appTheme.colors.primary : color}
                icon={active ? 'music-circle' : 'music-circle-outline'}
            />
        ), [active, appTheme.colors.primary]);

    const listStyle = {
        backgroundColor: active
            ? Color(appTheme.colors.secondaryContainer)
                .fade(appTheme.dark ? 0.4 : 0.6).string()
            : undefined,
    };

    return (
        <List.Item
            title={item.title}
            description={`${item.artist} - ${item.album}`}
            onPress={chooseTrack}
            descriptionNumberOfLines={1}
            titleStyle={titleStyle}
            style={listStyle}
            left={renderIcon}
            right={renderRightBtns}
        />
    );
};
