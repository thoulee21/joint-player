import Slider from '@react-native-community/slider';
import React from 'react';
import { Dimensions, StyleSheet, View } from 'react-native';
import { Text, useTheme } from 'react-native-paper';
import TrackPlayer, { useProgress } from 'react-native-track-player';

export const Progress = () => {
  const appTheme = useTheme();
  const { position, duration } = useProgress();
  // This is a workaround since the slider component only takes absolute widths
  const progressBarWidth = Dimensions.get('window').width * 0.92;

  return (
    <View style={styles.container}>
      <Slider
        style={{ ...styles.slider, width: progressBarWidth }}
        value={position}
        minimumValue={0}
        maximumValue={duration}
        thumbTintColor={appTheme.colors.primary}
        minimumTrackTintColor={appTheme.colors.primary}
        maximumTrackTintColor={appTheme.colors.tertiary}
        onSlidingComplete={TrackPlayer.seekTo}
      />

      <View style={styles.captionContainer}>
        <Text style={styles.caption}>
          {formatSeconds(position)}
        </Text>
        <Text style={styles.caption}>
          {formatSeconds(Math.max(0, duration - position))}
        </Text>
      </View>
    </View>
  );
};

const formatSeconds = (time: number) =>
  new Date(time * 1000).toISOString().slice(14, 19);

const styles = StyleSheet.create({
  container: {
    height: 80,
    width: '90%',
    alignItems: 'center',
    alignSelf: 'center',
    justifyContent: 'center',
  },
  liveText: {
    fontSize: 18,
    alignSelf: 'center',
  },
  slider: {
    height: 40,
    marginTop: 25,
    flexDirection: 'row',
  },
  captionContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  caption: {
    fontVariant: ['tabular-nums'],
  },
});
