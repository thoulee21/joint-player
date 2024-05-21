import React from 'react';
import HapticFeedback, { HapticFeedbackTypes } from 'react-native-haptic-feedback';
import { IconButton, List, useTheme } from 'react-native-paper';
import TrackPlayer, { useActiveTrack, useIsPlaying } from 'react-native-track-player';
import { useAppDispatch } from '../hook';
import { addToQueueAsync, clearAddOneAsync } from '../redux/slices';
import { TrackType } from '../services';
import { Song } from '../types/albumDetail';
import { songToTrack } from '../utils';

export function SongItem({ item, track }: { item?: Song, track?: TrackType }) {
    const dispatch = useAppDispatch();
    const appTheme = useTheme();

    const currentTrack = useActiveTrack();
    const { playing } = useIsPlaying();

    let trackData: TrackType;
    if (!track) {
        if (item) {
            trackData = songToTrack(item);
        } else {
            throw new Error('SongItem must have either a song or a track');
        }
    } else {
        trackData = track;
    }

    const active = (currentTrack?.id === trackData.id) && playing;

    const play = async () => {
        await dispatch(clearAddOneAsync(trackData));
        await TrackPlayer.play();
    };

    const addToQueue = async () => {
        HapticFeedback.trigger(
            HapticFeedbackTypes.effectHeavyClick
        );
        dispatch(addToQueueAsync(trackData));
    };

    return (
        <List.Item
            left={(props) => (
                <List.Icon {...props}
                    icon={active
                        ? 'pause-circle-outline'
                        : 'play-circle-outline'}
                    color={active
                        ? appTheme.colors.primary
                        : undefined}
                />
            )}
            title={trackData?.title}
            description={trackData?.artists.map(ar => ar.name).join(', ')}
            onPress={play}
            right={(props) => (
                <IconButton {...props}
                    icon="music-note-plus"
                    onPress={addToQueue}
                />
            )}
        />
    );
}
