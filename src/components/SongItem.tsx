import React, { memo, useCallback } from 'react';
import { ViewStyle } from 'react-native';
import HapticFeedback, { HapticFeedbackTypes } from 'react-native-haptic-feedback';
import { List, Text, useTheme } from 'react-native-paper';
import { Style } from 'react-native-paper/lib/typescript/components/List/utils';
import TrackPlayer from 'react-native-track-player';
import { useAppDispatch } from '../hook';
import { clearAddOneAsync } from '../redux/slices';
import { TrackType } from '../services/GetTracksService';
import type { ListLRProps } from '../types/paperListItem';

const IndexOfSong = memo(({ style: leftStyle, index }: {
    style?: Style, index: number
}) => {
    const appTheme = useTheme();
    return (
        <Text
            variant="titleLarge"
            style={[leftStyle, {
                color: appTheme.dark
                    ? appTheme.colors.onSurfaceDisabled
                    : appTheme.colors.backdrop
            }]}
        >
            {index + 1}
        </Text>
    );
});

export const SongItem = memo(({ item, index, style }: {
    item: TrackType,
    index: number,
    style?: ViewStyle
}) => {
    const dispatch = useAppDispatch();
    const appTheme = useTheme();

    const play = async () => {
        HapticFeedback.trigger(
            HapticFeedbackTypes.effectHeavyClick
        );
        await dispatch(clearAddOneAsync(item));
        await TrackPlayer.play();
    };

    const renderIndex = useCallback((props: ListLRProps) => (
        <IndexOfSong {...props} index={index} />
    ), [index]);

    return (
        <List.Item
            left={renderIndex}
            title={item.title}
            description={
                item.artists.map(ar => ar.name).join(', ')
                    .concat(' - ', item.album)
            }
            descriptionNumberOfLines={1}
            onPress={play}
            rippleColor="transparent"
            style={[style, {
                backgroundColor: appTheme.colors.surface,
            }]}
        />
    );
});

