import React, { useCallback, useEffect } from 'react';
import { StyleSheet, ToastAndroid, View } from 'react-native';
import { IconButton } from 'react-native-paper';
import TrackPlayer, {
  useIsPlaying,
  usePlaybackState,
} from 'react-native-track-player';
import { RepeatModeSwitch, TrackMenu } from '.';

function BackwardButton() {
  return (
    <IconButton
      icon="skip-previous"
      size={50}
      onPress={async () => {
        await TrackPlayer.skipToPrevious();
      }}
    />
  );
}

function PlayButton() {
  const { playing, bufferingDuringPlay } = useIsPlaying();

  return (
    <IconButton
      icon={playing ? 'pause' : 'play'}
      size={90}
      loading={bufferingDuringPlay}
      selected
      animated
      onPress={playing ? TrackPlayer.pause : TrackPlayer.play}
    />
  );
}

function ForwardButton() {
  return (
    <IconButton
      icon="skip-next"
      size={50}
      onPress={async () => {
        await TrackPlayer.skipToNext();
      }}
    />
  );
}

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
