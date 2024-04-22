import { useMaterial3Theme } from '@pchmn/expo-material3-theme';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  NavigationContainer,
  DarkTheme as NavigationDarkTheme,
  DefaultTheme as NavigationDefaultTheme,
} from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import * as SplashScreen from 'expo-splash-screen';
import React, { createContext, useEffect, useMemo, useState } from 'react';
import { StatusBar, StyleSheet } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import {
  MD3DarkTheme,
  MD3LightTheme,
  PaperProvider,
  adaptNavigationTheme,
} from 'react-native-paper';
import {
  Comments,
  LyricsScreen,
  Player,
  Settings,
  WebViewScreen,
} from './pages';

export enum StorageKeys {
  // eslint-disable-next-line no-unused-vars
  Keyword = 'keyword',
  // eslint-disable-next-line no-unused-vars
  BlurRadius = 'blurRadius',
}

export const PreferencesContext = createContext<{
  updateTheme: (sourceColor: string) => void;
  isDarkMode: boolean;
  setIsDarkMode: (isDarkMode: boolean) => void;
  blurRadius: number;
  setBlurRadius: (blurRadius: number) => void;
  experimentalBlur: boolean;
  setExperimentalBlur: (experimentalBlur: boolean) => void;
} | null>(null);

const Stack = createNativeStackNavigator();

function App() {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const { theme: colorTheme, updateTheme } = useMaterial3Theme();

  const [blurRadius, setBlurRadius] = useState(50);
  const [experimentalBlur, setExperimentalBlur] = useState(__DEV__);

  useEffect(() => {
    SplashScreen.preventAutoHideAsync();
  }, []);

  useEffect(() => {
    async function restorePrefs() {
      const storedBlurRadius = await AsyncStorage.getItem(StorageKeys.BlurRadius);
      if (storedBlurRadius) {
        setBlurRadius(parseInt(storedBlurRadius, 10));
      }
    }

    restorePrefs();
  }, []);

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

  const preferences = useMemo(
    () => ({
      updateTheme,
      isDarkMode,
      setIsDarkMode,
      blurRadius,
      setBlurRadius,
      experimentalBlur,
      setExperimentalBlur,
    }),
    [updateTheme, isDarkMode, blurRadius, experimentalBlur],
  );

  const { LightTheme: NaviLightTheme, DarkTheme: NaviDarkTheme } =
    adaptNavigationTheme({
      reactNavigationLight: NavigationDefaultTheme,
      reactNavigationDark: NavigationDarkTheme,
      materialLight: MyLightTheme,
      materialDark: MyDarkTheme,
    });

  const combinedTheme = isDarkMode ? NaviDarkTheme : NaviLightTheme;

  return (
    <GestureHandlerRootView style={styles.rootView}>
      <PaperProvider theme={isDarkMode ? MyDarkTheme : MyLightTheme}>
        <PreferencesContext.Provider value={preferences}>
          <NavigationContainer theme={combinedTheme}>
            <StatusBar
              translucent
              backgroundColor="transparent"
              barStyle={isDarkMode ? 'light-content' : 'dark-content'}
            />
            <Stack.Navigator screenOptions={{ headerShown: false }}>
              <Stack.Screen name="Player" component={Player} />
              <Stack.Screen name="Settings" component={Settings} />
              <Stack.Screen name="WebView" component={WebViewScreen} />
              <Stack.Screen name="Comments" component={Comments} />
              <Stack.Screen name="Lyrics" component={LyricsScreen} />
            </Stack.Navigator>
          </NavigationContainer>
        </PreferencesContext.Provider>
      </PaperProvider>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  rootView: {
    flex: 1,
  },
});

export default App;
