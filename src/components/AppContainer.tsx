import { useMaterial3Theme } from "@pchmn/expo-material3-theme";
import {
  DefaultTheme,
  NavigationContainer,
  DarkTheme as NavigationDarkTheme,
  DefaultTheme as NavigationDefaultTheme,
} from "@react-navigation/native";
import Color from "color";
import { StatusBar } from "expo-status-bar";
import React, { PropsWithChildren, useEffect, useMemo } from "react";
import { DeviceEventEmitter, StyleSheet } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import ImageColors from "react-native-image-colors";
import { AndroidImageColors } from "react-native-image-colors/build/types";
import {
  MD3DarkTheme,
  MD3LightTheme,
  PaperProvider,
  adaptNavigationTheme,
} from "react-native-paper";
import { useActiveTrack } from "react-native-track-player";
import { useAppDispatch, useAppSelector } from "../hook/reduxHooks";
import { useSetupPlayer } from "../hook/useSetupPlayer";
import { selectRippleEffect } from "../redux/slices";
import { selectDarkModeEnabled, setDarkMode } from "../redux/slices/darkMode";
import { rootLog } from "../utils/logger";

export function AppContainer({ children }: PropsWithChildren) {
  useSetupPlayer();
  const dispatch = useAppDispatch();
  const track = useActiveTrack();

  const isDarkMode = useAppSelector(selectDarkModeEnabled);
  const rippleEffectEnabled = useAppSelector(selectRippleEffect);

  const { theme: colorTheme, updateTheme } = useMaterial3Theme();

  const MyLightTheme = useMemo(
    () => ({
      ...MD3LightTheme,
      colors: colorTheme.light,
    }),
    [colorTheme.light],
  );

  const MyDarkTheme = useMemo(
    () => ({
      ...MD3DarkTheme,
      colors: colorTheme.dark,
    }),
    [colorTheme.dark],
  );

  const { LightTheme: NaviLightTheme, DarkTheme: NaviDarkTheme } = useMemo(
    () =>
      adaptNavigationTheme({
        reactNavigationLight: NavigationDefaultTheme,
        reactNavigationDark: NavigationDarkTheme,
        materialLight: MyLightTheme,
        materialDark: MyDarkTheme,
      }),
    [MyDarkTheme, MyLightTheme],
  );

  useEffect(() => {
    const setTheme = async () => {
      if (track?.artwork) {
        const colors = await ImageColors.getColors(track.artwork);
        // TODO: multiple platform support
        const androidColors = colors as AndroidImageColors;

        const vibrant = Color(androidColors.vibrant);
        const average = Color(androidColors.average);
        rootLog.info("vibrant color", vibrant.hex().toString());
        rootLog.info("average color", average.hex().toString());

        dispatch(setDarkMode(average.isDark()));
        updateTheme(vibrant.hex().toString());
      }
    };

    setTheme().finally(() => {
      if (track?.artwork) {
        DeviceEventEmitter.emit("loadEnd");
      }
    });
    // no dispatch, no updateTheme
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [track?.artwork]);

  return (
    <GestureHandlerRootView style={styles.rootView}>
      <PaperProvider
        theme={isDarkMode ? MyDarkTheme : MyLightTheme}
        settings={{ rippleEffectEnabled }}
      >
        <NavigationContainer
          theme={{
            ...(isDarkMode ? NaviDarkTheme : NaviLightTheme),
            fonts: DefaultTheme.fonts,
          }}
        >
          <StatusBar translucent style={isDarkMode ? "light" : "dark"} />
          {children}
        </NavigationContainer>
      </PaperProvider>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  rootView: {
    flex: 1,
  },
});
