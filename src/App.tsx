import * as SplashScreen from 'expo-splash-screen';
import { useUpdates } from 'expo-updates';
import React, { useEffect } from 'react';
import { ToastAndroid } from 'react-native';
import { AppContainer } from './components/AppContainer';
import { RootStack } from './components/RootStack';
import { useAppDispatch } from './hook/reduxHooks';
import { initBlurRadius, initFavs, initUser } from './redux/slices';

SplashScreen.preventAutoHideAsync();

export default function App() {
  const dispatch = useAppDispatch();
  const { isUpdateAvailable } = useUpdates();

  useEffect(() => {
    Promise.all([
      dispatch(initBlurRadius()),
      dispatch(initFavs()),
      dispatch(initUser())
    ]);

    // no dispatch
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (isUpdateAvailable) {
      ToastAndroid.show(
        'New updates is available',
        ToastAndroid.SHORT
      );
    }
    // show toast at startup
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <AppContainer>
      <RootStack />
    </AppContainer>
  );
}
