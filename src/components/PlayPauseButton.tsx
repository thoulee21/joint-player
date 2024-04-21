import React from 'react';
import HapticFeedback, {
    HapticFeedbackTypes,
} from 'react-native-haptic-feedback';
import { IconButton } from 'react-native-paper';
import TrackPlayer, { useIsPlaying } from 'react-native-track-player';

export function PlayButton() {
    const { playing, bufferingDuringPlay } = useIsPlaying();

    return (
        <IconButton
            icon={playing ? 'pause' : 'play'}
            size={90}
            loading={bufferingDuringPlay}
            selected
            animated
            onPress={() => {
                HapticFeedback.trigger(HapticFeedbackTypes.effectClick);

                if (playing) {
                    TrackPlayer.pause();
                } else {
                    TrackPlayer.play();
                }
            }}
        />
    );
}
