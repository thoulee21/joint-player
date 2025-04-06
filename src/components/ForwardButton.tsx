import React from "react";
import HapticFeedback, {
  HapticFeedbackTypes,
} from "react-native-haptic-feedback";
import { IconButton } from "react-native-paper";
import TrackPlayer, { useActiveTrack } from "react-native-track-player";

export function ForwardButton() {
  const track = useActiveTrack();
  return (
    <IconButton
      icon="skip-next"
      size={50}
      disabled={!track}
      onPress={async () => {
        HapticFeedback.trigger(HapticFeedbackTypes.effectHeavyClick);
        await TrackPlayer.skipToNext();
      }}
    />
  );
}
