import React from 'react';
import { Image, StyleSheet, View } from 'react-native';
import { Surface, Text, useTheme } from 'react-native-paper';
import type { Track } from 'react-native-track-player';

export const placeholderImg = 'https://via.placeholder.com/150';

export const TrackInfo: React.FC<{
  track?: Track;
}> = ({ track }) => {
  const appTheme = useTheme();
  const imageUri = track?.artwork;

  return (
    <View style={styles.container}>
      <Surface
        elevation={5}
        style={[
          styles.imgSurface,
          { borderRadius: appTheme.roundness * 5 }
        ]}
      >
        <Image
          style={[
            styles.artwork,
            {
              borderRadius: appTheme.roundness * 5,
              backgroundColor: appTheme.colors.surface,
            },
          ]}
          source={{ uri: imageUri || placeholderImg }}
        />
      </Surface>
      <Text style={styles.titleText} selectable>
        {track?.title}
      </Text>
      <Text
        selectable
        style={[
          styles.artistText,
          { color: appTheme.colors.primary }
        ]}
      >
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
