import React, { useState } from 'react';
import { IconButton } from 'react-native-paper';
import TrackPlayer, { RepeatMode } from 'react-native-track-player';
import { DefaultRepeatMode } from '../services';

/**
 * A component that displays a switch for changing the repeat mode.
 */
export function RepeatModeSwitch() {
  const [repeatMode, setRepeatMode] = useState(DefaultRepeatMode);

  /**
   * An array of available repeat modes.
   */
  const repeatModes = [RepeatMode.Track, RepeatMode.Queue];

  /**
   * Toggles the repeat mode to the next available mode.
   */
  const toggleRepeatMode = () => {
    const currentIndex = repeatModes.indexOf(repeatMode);
    const nextIndex = (currentIndex + 1) % repeatModes.length;
    const nextRepeatMode = repeatModes[nextIndex];

    TrackPlayer.setRepeatMode(nextRepeatMode);
    setRepeatMode(nextRepeatMode);
  };

  return (
    <IconButton
      size={24}
      animated
      icon={repeatMode === RepeatMode.Track ? 'repeat-once' : 'repeat'}
      onPress={toggleRepeatMode}
    />
  );
}
