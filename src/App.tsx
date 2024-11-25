import NetInfo from '@react-native-community/netinfo';
import * as Sentry from '@sentry/react-native';
import React, { useEffect } from 'react';
import RNFS from 'react-native-fs';
import {
  configureReanimatedLogger,
  ReanimatedLogLevel,
} from 'react-native-reanimated';
import TrackPlayer from 'react-native-track-player';
import { PersistGate } from 'redux-persist/integration/react';
import { mutate, SWRConfig, SWRConfiguration } from 'swr';
import { AppContainer } from './components/AppContainer';
import { RootStack } from './components/RootStack';
import { persister } from './redux/store';
import { PlaybackService } from './services/PlaybackService';
import { initFocus } from './utils/initFocus';
import { logFilePath } from './utils/logger';
import { mmkvStorageProvider } from './utils/mmkvStorageProvider';
import { fetcher } from './utils/retryFetcher';

const swrConfig: SWRConfiguration = {
  fetcher: fetcher,
  provider: () => {
    const provider = mmkvStorageProvider();
    provider.onCacheDeleted((key: string) => {
      // 处理缓存删除事件，自动重新加载数据
      mutate(key);
    });
    return provider;
  },
  isVisible: () => { return true; },
  initFocus: initFocus,
  initReconnect(callback) {
    const unsubscribe = NetInfo.addEventListener(
      state => {
        if (state.isConnected) { callback(); }
      }
    );

    return () => {
      unsubscribe();
    };
  },
};

configureReanimatedLogger({
  level: ReanimatedLogLevel.error,
  strict: false, // Reanimated runs in strict mode by default
});

Sentry.init({
  dsn: 'https://8f255799dc215a920003a9291d1d1e14@o4507198225383424.ingest.de.sentry.io/4507198229184592',
  environment: __DEV__ ? 'development' : 'production',
  // Set tracesSampleRate to 1.0 to capture 100% of transactions for tracing.
  // We recommend adjusting this value in production.
  tracesSampleRate: 1.0,
  // profilesSampleRate is relative to tracesSampleRate.
  // Here, we'll capture profiles for 100% of transactions.
  profilesSampleRate: 1.0,
  attachScreenshot: true,
  attachViewHierarchy: true,
  _experiments: {
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
  enabled: !__DEV__,
});

function App() {
  useEffect(() => {
    const createLogFile = async () => {
      const fileExists = await RNFS.exists(logFilePath);

      if (!fileExists) {
        await RNFS.writeFile(logFilePath, '');
      }
    };

    createLogFile();
  }, []);

  return (
    <PersistGate loading={null} persistor={persister}>
      <SWRConfig value={swrConfig}>
        <AppContainer>
          <RootStack />
        </AppContainer>
      </SWRConfig>
    </PersistGate>
  );
}

export default Sentry.wrap(App);

TrackPlayer.registerPlaybackService(() => PlaybackService);
