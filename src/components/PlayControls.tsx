import { useNetInfoInstance } from "@react-native-community/netinfo";
import React, { useCallback, useEffect } from "react";
import { StyleSheet, ToastAndroid, View } from "react-native";
import TrackPlayer, { usePlaybackState } from "react-native-track-player";
import { BackwardButton } from "./BackwardButton";
import { DownloadMenu } from "./DownloadMenu";
import { ForwardButton } from "./ForwardButton";
import { MvMenu } from "./MvMenu";
import { PlayButton } from "./PlayPauseButton";
import { RepeatModeSwitch } from "./RepeatModeSwitch";
import { TrackMenu } from "./TrackMenu";

export function PlayControls() {
  const { netInfo } = useNetInfoInstance();
  const playbackState = usePlaybackState();

  const isError = "error" in playbackState;

  const handleError = useCallback(() => {
    if (isError) {
      const errMsg = `${playbackState.error.message}: ${playbackState.error.code}`;
      if (netInfo.isConnected === true) {
        ToastAndroid.show(errMsg, ToastAndroid.SHORT);

        TrackPlayer.pause();
      } else {
        ToastAndroid.show("No internet connection", ToastAndroid.SHORT);
      }
    }
  }, [isError, netInfo.isConnected, playbackState]);

  useEffect(() => {
    handleError();
  }, [handleError, isError]);

  return (
    <View style={styles.playControls}>
      <RepeatModeSwitch />
      <BackwardButton />
      <PlayButton />
      <ForwardButton />
      <TrackMenu>
        <MvMenu />
        <DownloadMenu />
      </TrackMenu>
    </View>
  );
}

const styles = StyleSheet.create({
  playControls: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-evenly",
    width: "100%",
    marginTop: 20,
  },
});
