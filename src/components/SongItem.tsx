import React, { useCallback, useMemo } from 'react';
import { ViewStyle } from 'react-native';
import HapticFeedback, { HapticFeedbackTypes } from 'react-native-haptic-feedback';
import { List, Text, useTheme } from 'react-native-paper';
import { Style } from 'react-native-paper/lib/typescript/components/List/utils';
import TrackPlayer from 'react-native-track-player';
import { useAppDispatch } from '../hook';
import { clearAddOneAsync } from '../redux/slices';
import { TrackType } from '../services/GetTracksService';
import type { ListLRProps } from '../types/paperListItem';

const IndexOfSong = ({ style: leftStyle, index }: {
    style?: Style, index: number
}) => {
    const appTheme = useTheme();
    return (
        <Text
            variant="titleLarge"
            style={[leftStyle, {
                color: appTheme.dark
                    ? appTheme.colors.onSurfaceDisabled
                    : appTheme.colors.backdrop,
            }]}
        >
            {index + 1}
        </Text>
    );
};

export const SongItem = ({ item, index, style, inAlbum }: {
    item: TrackType,
    index: number,
    style?: ViewStyle,
    inAlbum?: boolean
}) => {
    const dispatch = useAppDispatch();
    const appTheme = useTheme();

    const play = useCallback(async () => {
        HapticFeedback.trigger(
            HapticFeedbackTypes.effectHeavyClick
        );
        await dispatch(clearAddOneAsync(item));
        await TrackPlayer.play();
        //no dispatch
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [item]);

    const renderIndex = useCallback((props: ListLRProps) => (
        <IndexOfSong {...props} index={index} />
    ), [index]);

    const description = useMemo(() => {
        const artists = item.artists
            .map(ar => ar.name)
            .join(', ');

        if (!inAlbum) {
            return artists
                .concat(' - ', item.album);
        } else {
            return artists;
        }
    }, [inAlbum, item.album, item.artists]);

    return (
        <List.Item
            left={renderIndex}
            title={item.title}
            description={description}
            descriptionNumberOfLines={1}
            onPress={play}
            rippleColor="transparent"
            style={[style, {
                backgroundColor: appTheme.colors.surface,
            }]}
        />
    );
};

