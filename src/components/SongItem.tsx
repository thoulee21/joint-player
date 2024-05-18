import React, { useMemo } from 'react';
import HapticFeedback, { HapticFeedbackTypes } from 'react-native-haptic-feedback';
import { IconButton, List, useTheme } from 'react-native-paper';
import TrackPlayer, { useActiveTrack, useIsPlaying } from 'react-native-track-player';
import { useAppDispatch } from '../hook';
import { clearQueue, addToQueue as reduxAddQueue } from '../redux/slices';
import { Song } from '../types/albumDetail';
import { songToTrack } from '../utils';

export function SongItem({ item }: { item: Song }) {
    const dispatch = useAppDispatch();
    const appTheme = useTheme();
    const currentTrack = useActiveTrack();
    const { playing } = useIsPlaying();

    const trackData = useMemo(() => songToTrack(item), [item]);
    const active = (currentTrack?.id === trackData.id) && playing;

    const play = async () => {
        dispatch(clearQueue());
        dispatch(reduxAddQueue(trackData));

        await TrackPlayer.reset();
        await TrackPlayer.add(trackData);
        await TrackPlayer.play();
    };

    const addToQueue = async () => {
        HapticFeedback.trigger(
            HapticFeedbackTypes.effectHeavyClick
        );

        dispatch(reduxAddQueue(trackData));
        //去重后添加
        const existTracks = await TrackPlayer.getQueue();
        if (existTracks) {
            const exist = existTracks.findIndex(
                (track) => track.id === trackData.id
            );
            if (exist === -1) {
                await TrackPlayer.add(trackData);
            }
        }
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
            title={item.name}
            description={item.artists.map(ar => ar.name).join(', ')}
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
