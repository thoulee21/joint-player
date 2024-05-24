import * as Sentry from '@sentry/react-native';
import React, { memo, useMemo } from 'react';
import { ViewStyle } from 'react-native';
import { List, Text, useTheme } from 'react-native-paper';
import TrackPlayer from 'react-native-track-player';
import { useAppDispatch } from '../hook';
import { clearAddOneAsync } from '../redux/slices';
import { TrackType } from '../services';
import { Song } from '../types/albumDetail';
import { songToTrack } from '../utils';

export const SongItem = memo(({ item, index, track, style }: {
    item?: Song,
    index: number,
    track?: TrackType,
    style?: ViewStyle
}) => {
    const dispatch = useAppDispatch();
    const appTheme = useTheme();

    const trackData = useMemo(() => {
        if (!track) {
            if (item) {
                return songToTrack(item);
            } else {
                throw new Error(
                    'SongItem must have either a song or a track'
                );
            }
        } else { return track; }
    }, [item, track]);

    const play = async () => {
        await dispatch(clearAddOneAsync(trackData));
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
                title={trackData?.title}
                description={
                    trackData?.artists.map(ar => ar.name).join(', ')
                        .concat(' - ', trackData.album)
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

