import React from 'react';
import HapticFeedback, { HapticFeedbackTypes } from 'react-native-haptic-feedback';
import { IconButton, Tooltip } from 'react-native-paper';
import { RepeatMode } from 'react-native-track-player';
import { useAppDispatch, useAppSelector } from '../hook';
import { selectRepeatMode, setRepeatMode } from '../redux/slices/repeatMode';

const REPEAT_MODES = [
  RepeatMode.Off,
  RepeatMode.Track,
  RepeatMode.Queue,
];

const REPEAT_EXPLATIONS = {
  [RepeatMode.Off]: 'Stops after the last track',
  [RepeatMode.Track]: 'Repeats the current track',
  [RepeatMode.Queue]: 'Repeats the entire queue',
};

export function RepeatModeSwitch() {
  const dispatch = useAppDispatch();
  const repeatMode = useAppSelector(selectRepeatMode);

  const toggleRepeatMode = () => {
    HapticFeedback.trigger(HapticFeedbackTypes.effectHeavyClick);

    const currentIndex = REPEAT_MODES.indexOf(repeatMode);
    const nextIndex = (currentIndex + 1) % REPEAT_MODES.length;
    const nextRepeatMode = REPEAT_MODES[nextIndex];

    dispatch(setRepeatMode(nextRepeatMode));
    setRepeatMode(nextRepeatMode);
  };

  return (
    <Tooltip
      title={REPEAT_EXPLATIONS[repeatMode]}
      leaveTouchDelay={2000}
    >
      <IconButton
        size={24}
        animated
        icon={
          repeatMode === RepeatMode.Track
            ? 'repeat-once'
            : repeatMode === RepeatMode.Queue
              ? 'repeat'
              : 'repeat-off'
        }
        onPress={toggleRepeatMode}
      />
    </Tooltip>
  );
}
