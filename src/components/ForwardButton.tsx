import React from 'react';
import HapticFeedback, {
    HapticFeedbackTypes,
} from 'react-native-haptic-feedback';
import { IconButton } from 'react-native-paper';
import TrackPlayer from 'react-native-track-player';

export function ForwardButton() {
    return (
        <IconButton
            icon="skip-next"
            size={50}
            onPress={async () => {
                HapticFeedback.trigger(HapticFeedbackTypes.effectHeavyClick);
                await TrackPlayer.skipToNext();
            }}
        />
    );
}
