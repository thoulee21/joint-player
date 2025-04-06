import React, { useState } from "react";
import HapticFeedback, {
  HapticFeedbackTypes,
} from "react-native-haptic-feedback";
import { FAB, Portal } from "react-native-paper";
import TrackPlayer, {
  useActiveTrack,
  useIsPlaying,
} from "react-native-track-player";

export const PlayControlsFAB = () => {
  const track = useActiveTrack();
  const { playing, bufferingDuringPlay } = useIsPlaying();
  const [open, setOpen] = useState(false);

  return (
    <Portal>
      <FAB.Group
        icon={bufferingDuringPlay ? "loading" : playing ? "pause" : "play"}
        open={open}
        visible={!!track}
        variant="secondary"
        toggleStackOnLongPress
        onPress={() => {
          HapticFeedback.trigger(HapticFeedbackTypes.effectHeavyClick);

          if (playing) {
            TrackPlayer.pause();
          } else {
            TrackPlayer.play();
          }
        }}
        actions={[
          {
            icon: "skip-previous",
            label: "Previous track",
            onPress: async () => {
              HapticFeedback.trigger(HapticFeedbackTypes.effectHeavyClick);
              await TrackPlayer.skipToPrevious();
            },
          },
          {
            icon: "skip-next",
            label: "Next track",
            onPress: async () => {
              HapticFeedback.trigger(HapticFeedbackTypes.effectHeavyClick);
              await TrackPlayer.skipToNext();
            },
          },
        ]}
        onStateChange={(state) => {
          HapticFeedback.trigger(HapticFeedbackTypes.effectHeavyClick);
          setOpen(state.open);
        }}
      />
    </Portal>
  );
};
