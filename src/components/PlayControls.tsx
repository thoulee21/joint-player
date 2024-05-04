import { useNetInfoInstance } from '@react-native-community/netinfo';
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
  const { netInfo } = useNetInfoInstance();
  const playbackState = usePlaybackState();

  const isError = 'error' in playbackState;

  const handleError = useCallback(() => {
    if (isError) {
      if (netInfo.isConnected === true) {
        const errMsg = `${playbackState.error.message}: ${playbackState.error.code}`;
        ToastAndroid.show(errMsg, ToastAndroid.SHORT);

        TrackPlayer.skipToNext();
        TrackPlayer.play();
      } else {
        ToastAndroid.show('No internet connection', ToastAndroid.SHORT);
      }
    }
  }, [isError, netInfo.isConnected, playbackState]);

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
