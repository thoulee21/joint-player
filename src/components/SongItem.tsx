import * as Sentry from '@sentry/react-native';
import React, { memo } from 'react';
import { ViewStyle } from 'react-native';
import { List, Text, useTheme } from 'react-native-paper';
import TrackPlayer from 'react-native-track-player';
import { useAppDispatch } from '../hook';
import { clearAddOneAsync } from '../redux/slices';
import { TrackType } from '../services';

export const SongItem = memo(({ item, index, style }: {
    item: TrackType,
    index: number,
    style?: ViewStyle
}) => {
    const dispatch = useAppDispatch();
    const appTheme = useTheme();

    const play = async () => {
        await dispatch(clearAddOneAsync(item));
        await TrackPlayer.play();
    };

    return (
        <Sentry.ErrorBoundary showDialog>
            <List.Item
                left={({ style: leftStyle }) => (
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
                )}
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
        </Sentry.ErrorBoundary>
    );
});

