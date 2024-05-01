import AsyncStorage from '@react-native-async-storage/async-storage';
import * as SplashScreen from 'expo-splash-screen';
import React, { createContext, useEffect } from 'react';
import { AppContainer, RootStack } from './components';
import { useAppDispatch } from './hook/reduxHooks';
import { setBlurRadius } from './redux/slices';

SplashScreen.preventAutoHideAsync();

export enum StorageKeys {
  // eslint-disable-next-line no-unused-vars
  Keyword = 'keyword',
  // eslint-disable-next-line no-unused-vars
  BlurRadius = 'blurRadius',
}

export const PreferencesContext = createContext<{
  updateTheme: (sourceColor: string) => void;
} | null>(null);

export default function App() {
  const dispatch = useAppDispatch();

  useEffect(() => {
    async function restorePrefs() {
      const storedBlurRadius = await AsyncStorage.getItem(StorageKeys.BlurRadius);
      if (storedBlurRadius) {
        dispatch(setBlurRadius(Number(storedBlurRadius)));
      }
    }

    restorePrefs();
    // no dispatch
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <AppContainer>
      <RootStack />
    </AppContainer>
  );
}
