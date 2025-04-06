import React, { PropsWithChildren } from "react";
import {
  ImageBackground,
  StyleSheet,
  ViewStyle,
  type StyleProp,
} from "react-native";
import { useActiveTrack } from "react-native-track-player";
import { useAppSelector } from "../hook";
import { blurRadius } from "../redux/slices";
import { placeholderImg } from "./TrackInfo";

export const BlurBackground = ({
  children,
  style,
  onLoadEnd,
}: PropsWithChildren<{
  style?: StyleProp<ViewStyle>;
  onLoadEnd?: () => void;
}>) => {
  const blurRadiusValue = useAppSelector(blurRadius);
  const track = useActiveTrack();

  return (
    <ImageBackground
      style={[styles.root, style]}
      source={{ uri: track?.artwork || placeholderImg }}
      blurRadius={blurRadiusValue}
      onLoadEnd={onLoadEnd}
    >
      {children}
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  root: {
    flex: 1,
    display: "flex",
  },
});
