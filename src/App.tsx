import AsyncStorage from '@react-native-async-storage/async-storage';
import * as SplashScreen from 'expo-splash-screen';
import React, { useEffect } from 'react';
import { AppContainer, RootStack } from './components';
import { useAppDispatch } from './hook';
import { setBlurRadius, setFavs, setUser } from './redux/slices';

SplashScreen.preventAutoHideAsync();

export enum StorageKeys {
  // eslint-disable-next-line no-unused-vars
  Keyword = 'keyword',
  // eslint-disable-next-line no-unused-vars
  BlurRadius = 'blurRadius',
  // eslint-disable-next-line no-unused-vars
  Favs = 'favs',
  // eslint-disable-next-line no-unused-vars
  User = 'user',
}

export default function App() {
  const dispatch = useAppDispatch();

  useEffect(() => {
    async function restorePrefs() {
      const storedBlurRadius = await AsyncStorage.getItem(StorageKeys.BlurRadius);
      if (storedBlurRadius) {
        dispatch(setBlurRadius(Number(storedBlurRadius)));
      }

      const storedFavs = await AsyncStorage.getItem(StorageKeys.Favs);
      if (storedFavs) {
        dispatch(setFavs(JSON.parse(storedFavs)));
      }

      const storedUser = await AsyncStorage.getItem(StorageKeys.User);
      if (storedUser) {
        dispatch(setUser(JSON.parse(storedUser)));
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
