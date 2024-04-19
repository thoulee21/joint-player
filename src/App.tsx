import { useMaterial3Theme } from '@pchmn/expo-material3-theme';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  NavigationContainer,
  DarkTheme as NavigationDarkTheme,
  DefaultTheme as NavigationDefaultTheme
} from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import * as SplashScreen from 'expo-splash-screen';
import React, { createContext, useEffect, useMemo, useState } from 'react';
import { StatusBar, StyleSheet, useColorScheme } from 'react-native';
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
  WebViewScreen
} from './pages';

export enum StorageKeys {
  Keyword = 'keyword',
  PlayAtStartup = 'playAtStartup',
  BlurRadius = 'blurRadius',
}

export const PreferencesContext = createContext<{
  updateTheme: (sourceColor: string) => void;
  isDarkMode: boolean;
  setIsDarkMode: (isDarkMode: boolean) => void;
  keyword: string;
  setKeyword: (keyword: string) => void;
  playAtStartup: boolean;
  setPlayAtStartup: (playAtStartup: boolean) => void;
  blurRadius: number;
  setBlurRadius: (blurRadius: number) => void;
} | null>(null);

const Stack = createNativeStackNavigator();

function App() {
  const [isDarkMode, setIsDarkMode] = useState(useColorScheme() === 'dark');
  const { theme: colorTheme, updateTheme } = useMaterial3Theme();

  const [keyword, setKeyword] = useState('');
  const [playAtStartup, setPlayAtStartup] = useState(false);
  const [blurRadius, setBlurRadius] = useState(50);

  useEffect(() => {
    SplashScreen.preventAutoHideAsync();
  }, []);

  useEffect(() => {
    async function restorePrefs() {
      const storedKeyword = await AsyncStorage.getItem(StorageKeys.Keyword);
      if (storedKeyword) {
        setKeyword(storedKeyword);
      }

      const storedPlayAtStartup = await AsyncStorage.getItem(StorageKeys.PlayAtStartup);
      if (storedPlayAtStartup) {
        setPlayAtStartup(storedPlayAtStartup === 'true');
      }

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
      keyword,
      setKeyword,
      playAtStartup,
      setPlayAtStartup,
      blurRadius,
      setBlurRadius,
    }),
    [isDarkMode, keyword, playAtStartup, blurRadius, updateTheme],
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
            <Stack.Navigator screenOptions={{ headerShown: false, }}>
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
