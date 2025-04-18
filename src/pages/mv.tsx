import { useNavigation, useRoute } from "@react-navigation/native";
import { OrientationLock, lockAsync } from "expo-screen-orientation";
import React, { useEffect } from "react";
import { StatusBar, StyleSheet } from "react-native";
import HapticFeedBack, {
  HapticFeedbackTypes,
} from "react-native-haptic-feedback";
import VideoPlayer from "react-native-media-console";
import { useTheme } from "react-native-paper";
import { useActiveTrack } from "react-native-track-player";
import useSWR from "swr";
import { Main as MvMain } from "../types/mv";

export const MvPlayer = () => {
  const navigator = useNavigation();
  const { res } = useRoute().params as { res: string };
  const appTheme = useTheme();

  const track = useActiveTrack();
  const { data } = useSWR<MvMain>(
    `http://music.163.com/api/mv/detail?id=${track?.mvid}`,
  );

  const highestRes = data?.data.brs
    ? Object.keys(data.data.brs).reverse()[0]
    : "240";
  const mvLink = data?.data.brs
    ? data.data.brs[res || highestRes]
    : "https://vjs.zencdn.net/v/oceans.mp4";

  const vibration = () => {
    HapticFeedBack.trigger(HapticFeedbackTypes.effectHeavyClick);
  };

  useEffect(() => {
    lockAsync(OrientationLock.LANDSCAPE);
    StatusBar.setHidden(true);
    StatusBar.setBarStyle("light-content");

    return () => {
      lockAsync(OrientationLock.PORTRAIT);
      StatusBar.setHidden(false);
      StatusBar.setBarStyle(appTheme.dark ? "light-content" : "dark-content");
    };
  }, [appTheme.dark]);

  return (
    <VideoPlayer
      containerStyle={styles.root}
      source={{ uri: mvLink }}
      isFullscreen
      disableFullscreen
      disableVolume
      showDuration
      navigator={navigator}
      showOnEnd
      title={data?.data.name || "MV"}
      controlTimeoutDelay={1500}
      preventsDisplaySleepDuringVideoPlayback
      seekColor={appTheme.colors.primary}
      onShowControls={() => StatusBar.setHidden(false)}
      onHideControls={() => StatusBar.setHidden(true)}
      onPlay={vibration}
      onPause={vibration}
    />
  );
};

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
});
