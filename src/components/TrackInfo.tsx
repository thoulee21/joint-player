import { useNavigation } from '@react-navigation/native';
import React from 'react';
import { Image, StyleSheet, TouchableWithoutFeedback, View } from 'react-native';
import HapticFeedback, { HapticFeedbackTypes } from 'react-native-haptic-feedback';
import { Surface, Text, useTheme } from 'react-native-paper';
import { useActiveTrack } from 'react-native-track-player';

export const placeholderImg = 'https://picsum.photos/800';

export const TrackInfo = () => {
  const navigation = useNavigation();
  const appTheme = useTheme();
  const track = useActiveTrack();

  const imageUri = track?.artwork || placeholderImg;

  return (
    <View style={styles.container}>
      <Surface
        elevation={5}
        style={[
          styles.imgSurface,
          { borderRadius: appTheme.roundness * 5 },
        ]}
      >
        <TouchableWithoutFeedback
          style={[
            styles.artwork,
            { borderRadius: appTheme.roundness * 5 },
          ]}
          onPress={() => {
            if (track?.id) {
              HapticFeedback.trigger('effectHeavyClick');
              // @ts-ignore
              navigation.push('Lyrics');
            }
          }}
          onLongPress={() => {
            HapticFeedback.trigger(HapticFeedbackTypes.effectTick);
            if (track?.artwork !== placeholderImg) {
              // @ts-ignore
              navigation.push('WebView', {
                title: track?.title || 'Artwork',
                url: imageUri,
              });
            }
          }}
        >
          <Image
            style={[
              styles.artwork,
              {
                borderRadius: appTheme.roundness * 5,
                backgroundColor: appTheme.colors.surface,
              },
            ]}
            source={{ uri: imageUri }}
          />
        </TouchableWithoutFeedback>
      </Surface>

      <Text selectable style={styles.titleText}>
        {track?.title}
      </Text>
      <Text
        selectable
        style={[styles.artistText, { color: appTheme.colors.primary }]}>
        {track?.artist}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
  },
  artwork: {
    width: '90%',
    aspectRatio: 1,
  },
  imgSurface: {
    marginTop: '2%',
    elevation: 5,
    overflow: 'hidden',
  },
  titleText: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 30,
    textAlign: 'center',
  },
  artistText: {
    fontSize: 16,
    fontWeight: '200',
    textAlign: 'center',
  },
});
