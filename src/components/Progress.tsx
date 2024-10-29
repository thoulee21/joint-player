import Slider from '@react-native-community/slider';
import React from 'react';
import { Dimensions, StyleSheet, View } from 'react-native';
import { Text, useTheme } from 'react-native-paper';
import TrackPlayer, { useProgress } from 'react-native-track-player';
import { formatSeconds } from '../utils';

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
        minimumTrackTintColor={appTheme.colors.secondary}
        maximumTrackTintColor={appTheme.colors.tertiary}
        onSlidingComplete={TrackPlayer.seekTo}
      />

      <View style={styles.captionContainer}>
        <Text>
          {formatSeconds(position)}
        </Text>
        <Text>
          {formatSeconds(duration)}
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    height: 80,
    width: '90%',
    alignItems: 'center',
    alignSelf: 'center',
    justifyContent: 'center',
  },
  slider: {
    height: 40,
    marginTop: 30,
    flexDirection: 'row',
  },
  captionContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
});
