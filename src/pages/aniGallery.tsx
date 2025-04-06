import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import type LottieView from "lottie-react-native";
import React, { useCallback, useMemo, useRef, useState } from "react";
import { StyleSheet } from "react-native";
import HapticFeedback, {
  HapticFeedbackTypes,
} from "react-native-haptic-feedback";
import {
  ANIMATIONS,
  LottieAnimation,
  type AniKeys,
} from "../components/LottieAnimation";
import { upperFirst } from "../utils";

const BottomTab = createMaterialTopTabNavigator();

const AniPage = ({ name }: { name: AniKeys }) => {
  const aniRef = useRef<LottieView>(null);
  const [isPlaying, setIsPlaying] = useState(true);

  const togglePlay = useCallback(() => {
    HapticFeedback.trigger(HapticFeedbackTypes.effectClick);

    if (isPlaying) {
      aniRef.current?.pause();
    } else {
      aniRef.current?.resume();
    }

    setIsPlaying((prev) => !prev);
  }, [isPlaying]);

  return (
    <LottieAnimation
      ref={aniRef}
      animation={name}
      caption={upperFirst(name)}
      onPress={togglePlay}
    />
  );
};

export const AniGallery = () => {
  const renderAniPage = useCallback((name: AniKeys) => {
    return () => <AniPage name={name} />;
  }, []);

  const AniPages = useMemo(
    () =>
      Object.keys(ANIMATIONS).map((key, index) => (
        <BottomTab.Screen
          key={index}
          name={key}
          component={renderAniPage(key as AniKeys)}
          options={{ tabBarShowLabel: false }}
        />
      )),
    [renderAniPage],
  );

  return (
    <>
      <BottomTab.Navigator
        backBehavior="none"
        tabBarPosition="bottom"
        screenOptions={{
          tabBarShowLabel: false,
          tabBarShowIcon: false,
          tabBarStyle: styles.tabBarIndicator,
          tabBarIndicatorStyle: styles.tabBarIndicator,
        }}
      >
        {AniPages}
      </BottomTab.Navigator>
    </>
  );
};

const styles = StyleSheet.create({
  tabBarIndicator: {
    height: 4,
    borderRadius: 10,
  },
});
