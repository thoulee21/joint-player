import * as Sentry from '@sentry/react-native';
import React, { useEffect } from 'react';
import { AppState, type AppStateStatus } from 'react-native';
import {
  configureReanimatedLogger,
  ReanimatedLogLevel,
} from 'react-native-reanimated';
import TrackPlayer from 'react-native-track-player';
import { SWRConfig, SWRConfiguration } from 'swr';
import { AppContainer } from './components/AppContainer';
import { RootStack } from './components/RootStack';
import { useAppDispatch } from './hook/reduxHooks';
import {
  initBlurRadius,
  initFavs,
  initPlaylists,
  initUser,
} from './redux/slices';
import { PlaybackService } from './services/PlaybackService';
import { asyncStorageProvider } from './utils/asyncStorageProvider';
import { fetcher } from './utils/retryFetcher';

const swrConfig: SWRConfiguration = {
  fetcher: fetcher,
  provider: asyncStorageProvider,
  isVisible: () => { return true; },
  initFocus(callback) {
    let appState = AppState.currentState;

    const onAppStateChange = (nextAppState: AppStateStatus) => {
      /* 如果正在从后台或非 active 模式恢复到 active 模式 */
      if (
        appState.match(
          /inactive|background/
        ) && nextAppState === 'active'
      ) { callback(); }
      appState = nextAppState;
    };

    // 订阅 app 状态更改事件
    const subscription = AppState.addEventListener(
      'change', onAppStateChange
    );

    return () => {
      subscription.remove();
    };
  }
};

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
      dispatch(initPlaylists()),
    ]);
  }, [dispatch]);

  return (
    <SWRConfig value={swrConfig}>
      <AppContainer>
        <RootStack />
      </AppContainer>
    </SWRConfig>
  );
}

export default Sentry.wrap(App);

TrackPlayer.registerPlaybackService(() => PlaybackService);
