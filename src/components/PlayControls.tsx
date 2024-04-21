import React, { useCallback, useEffect } from 'react';
import { StyleSheet, ToastAndroid, View } from 'react-native';
import TrackPlayer, {
  usePlaybackState,
} from 'react-native-track-player';
import {
  BackwardButton,
  ForwardButton,
  PlayButton,
  RepeatModeSwitch,
  TrackMenu,
} from '.';

export function PlayControls() {
  const playbackState = usePlaybackState();
  const isError = 'error' in playbackState;

  const handleError = useCallback(() => {
    if (isError) {
      const errMsg = `${playbackState.error.message}: ${playbackState.error.code}`;
      ToastAndroid.show(errMsg, ToastAndroid.SHORT);

      TrackPlayer.skipToNext();
      TrackPlayer.play();
    }
  }, [isError, playbackState]);

  useEffect(() => {
    handleError();
  }, [handleError, isError]);

  return (
    <View style={styles.controlsContainer}>
      <View style={styles.playControls}>
        <RepeatModeSwitch />
        <BackwardButton />
        <PlayButton />
        <ForwardButton />
        <TrackMenu />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  playControls: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-evenly',
  },
  controlsContainer: {
    width: '100%',
  },
});
