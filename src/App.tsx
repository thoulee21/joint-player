import { useMaterial3Theme } from '@pchmn/expo-material3-theme';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  NavigationContainer,
  DarkTheme as NavigationDarkTheme,
  DefaultTheme as NavigationDefaultTheme,
} from '@react-navigation/native';
import {
  StackCardInterpolationProps,
  StackNavigationOptions,
  TransitionPresets,
  createStackNavigator
} from '@react-navigation/stack';
import * as SplashScreen from 'expo-splash-screen';
import React, { createContext, useEffect, useMemo } from 'react';
import { StatusBar, StyleSheet } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import {
  MD3DarkTheme,
  MD3LightTheme,
  PaperProvider,
  adaptNavigationTheme,
} from 'react-native-paper';
import { SWRConfig, SWRConfiguration } from 'swr';
import { useAppDispatch, useAppSelector } from './hook/reduxHooks';
import {
  Comments,
  LyricsScreen,
  MvPlayer,
  Player,
  Settings,
  WebViewScreen,
} from './pages';
import { selectDarkModeEnabled, setBlurRadius } from './redux/slices';
import { requestInit } from './services';

export enum StorageKeys {
  // eslint-disable-next-line no-unused-vars
  Keyword = 'keyword',
  // eslint-disable-next-line no-unused-vars
  BlurRadius = 'blurRadius',
}

export const PreferencesContext = createContext<{
  updateTheme: (sourceColor: string) => void;
} | null>(null);

const Stack = createStackNavigator();

// 弹性动画
const flexAnimation = ({ current, layouts }:
  StackCardInterpolationProps
) => ({
  cardStyle: {
    transform: [
      {
        translateX: current.progress.interpolate({
          inputRange: [0, 1],
          outputRange: [layouts.screen.width, 0],
        }),
      },
    ],
  },
});

const screenOptions: StackNavigationOptions = {
  headerShown: false,
  ...TransitionPresets.SlideFromRightIOS,
  cardStyleInterpolator: flexAnimation,
};

const swrConfig: SWRConfiguration = {
  fetcher: (resource, init) =>
    fetch(resource, { ...requestInit, ...init })
      .then((res) => res.json()),
};

function App() {
  const isDarkMode = useAppSelector(selectDarkModeEnabled);
  const { theme: colorTheme, updateTheme } = useMaterial3Theme();
  const dispatch = useAppDispatch();

  useEffect(() => {
    SplashScreen.preventAutoHideAsync();
  }, []);

  useEffect(() => {
    async function restorePrefs() {
      const storedBlurRadius = await AsyncStorage.getItem(StorageKeys.BlurRadius);
      if (storedBlurRadius) {
        dispatch(setBlurRadius(Number(storedBlurRadius)));
      }
    }

    restorePrefs();
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
    }),
    // no updateTheme
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [],
  );

  const { LightTheme: NaviLightTheme, DarkTheme: NaviDarkTheme } = useMemo(
    () => adaptNavigationTheme({
      reactNavigationLight: NavigationDefaultTheme,
      reactNavigationDark: NavigationDarkTheme,
      materialLight: MyLightTheme,
      materialDark: MyDarkTheme,
    }), [MyDarkTheme, MyLightTheme]);

  return (
    <GestureHandlerRootView style={styles.rootView}>
      <SWRConfig value={swrConfig}>
        <PaperProvider theme={isDarkMode ? MyDarkTheme : MyLightTheme}>
          <PreferencesContext.Provider value={preferences}>
            <NavigationContainer theme={isDarkMode ? NaviDarkTheme : NaviLightTheme}>
              <StatusBar
                translucent
                backgroundColor="transparent"
                barStyle={isDarkMode ? 'light-content' : 'dark-content'}
              />
              <Stack.Navigator screenOptions={screenOptions}>
                <Stack.Screen name="Player" component={Player} />
                <Stack.Screen name="Settings" component={Settings} />
                <Stack.Screen name="WebView" component={WebViewScreen} />
                <Stack.Screen name="Comments" component={Comments} />
                <Stack.Screen name="Lyrics" component={LyricsScreen} />
                <Stack.Screen name="MvPlayer" component={MvPlayer} />
              </Stack.Navigator>
            </NavigationContainer>
          </PreferencesContext.Provider>
        </PaperProvider>
      </SWRConfig>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  rootView: {
    flex: 1,
  },
});

export default App;
