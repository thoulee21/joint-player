import * as SplashScreen from 'expo-splash-screen';
import React, { useEffect } from 'react';
import { AppContainer, RootStack } from './components';
import { useAppDispatch } from './hook';
import { initBlurRadius, initFavs, initUser } from './redux/slices';

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
    Promise.all([
      dispatch(initBlurRadius()),
      dispatch(initFavs()),
      dispatch(initUser())
    ]);

    // no dispatch
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <AppContainer>
      <RootStack />
    </AppContainer>
  );
}
