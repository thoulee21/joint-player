import * as Sentry from '@sentry/react-native';
import React, { useEffect } from 'react';
import {
  configureReanimatedLogger,
  ReanimatedLogLevel,
} from 'react-native-reanimated';
import TrackPlayer from 'react-native-track-player';
import { AppContainer } from './components/AppContainer';
import { RootStack } from './components/RootStack';
import { useAppDispatch } from './hook/reduxHooks';
import { initBlurRadius, initFavs, initUser } from './redux/slices';
import { PlaybackService } from './services/PlaybackService';

configureReanimatedLogger({
  level: ReanimatedLogLevel.error,
  strict: false, // Reanimated runs in strict mode by default
});

Sentry.init({
  dsn: 'https://8f255799dc215a920003a9291d1d1e14@o4507198225383424.ingest.de.sentry.io/4507198229184592',
  environment: __DEV__ ? 'development' : 'production',
  tracesSampleRate: 1.0,
  attachScreenshot: true,
  attachViewHierarchy: true,
  _experiments: {
    profilesSampleRate: 1.0,
    replaysSessionSampleRate: 1.0,
    replaysOnErrorSampleRate: 1.0,
  },
  integrations: [
    Sentry.mobileReplayIntegration({
      maskAllImages: false,
      maskAllText: false,
      maskAllVectors: false,
    }),
    Sentry.reactNativeTracingIntegration(),
  ],
});

function App() {
  const dispatch = useAppDispatch();

  useEffect(() => {
    Promise.all([
      dispatch(initBlurRadius()),
      dispatch(initFavs()),
      dispatch(initUser()),
    ]);
    // no dispatch in deps
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <AppContainer>
      <RootStack />
    </AppContainer>
  );
}

export default Sentry.wrap(App);

TrackPlayer.registerPlaybackService(() => PlaybackService);
