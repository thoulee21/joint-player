import type { PropsWithChildren } from 'react';
import React from 'react';
import { StyleSheet, type StyleProp, type ViewStyle } from 'react-native';
import { useActiveTrack } from 'react-native-track-player';
import { ImageBlur } from './ImageBlur/components';
import { placeholderImg } from './TrackInfo';

export const ImageBlurBackground = ({
  children, src, style
}: PropsWithChildren<{
  src?: string, style?: StyleProp<ViewStyle>
}>) => {
  const track = useActiveTrack();
  return (
    <ImageBlur
      style={[styles.root, style]}
      src={src || track?.artwork || placeholderImg}
      blurChildren={children}
      resizeMode="cover"
    />
  );
};

const styles = StyleSheet.create({
  root: {
    flex: 1,
    display: 'flex',
  },
});
