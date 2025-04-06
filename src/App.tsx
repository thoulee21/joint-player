import NetInfo from "@react-native-community/netinfo";
import * as Sentry from "@sentry/react-native";
import React, { useEffect } from "react";
import RNFS from "react-native-fs";
import { Provider as ReduxProvider } from "react-redux";
import {
  configureReanimatedLogger,
  ReanimatedLogLevel,
} from "react-native-reanimated";
import TrackPlayer from "react-native-track-player";
import { PersistGate } from "redux-persist/integration/react";
import { mutate, SWRConfig, SWRConfiguration } from "swr";
import { AppContainer } from "./components/AppContainer";
import { RootStack } from "./components/RootStack";
import { persister, store } from "./redux/store";
import { PlaybackService } from "./services/PlaybackService";
import "./utils/i18next";
import { initFocus } from "./utils/initFocus";
import { logFilePath } from "./utils/logger";
import { mmkvStorageProvider } from "./utils/mmkvStorageProvider";
import { fetcher } from "./utils/retryFetcher";
import "./utils/sentry";
import { AnimatedSplashScreen } from "./components/AnimatedSplashScreen";

const SWR_CONFIG: SWRConfiguration = {
  fetcher: fetcher,
  provider: () => {
    const provider = mmkvStorageProvider();
    provider.onCacheDeleted((key: string) => {
      // 处理缓存删除事件，自动重新加载数据
      mutate(key);
    });
    return provider;
  },
  isVisible: () => {
    return true;
  },
  initFocus: initFocus,
  initReconnect(callback) {
    const unsubscribe = NetInfo.addEventListener((state) => {
      if (state.isConnected) {
        callback();
      }
    });

    return () => {
      unsubscribe();
    };
  },
};

configureReanimatedLogger({
  level: ReanimatedLogLevel.error,
  strict: false, // Reanimated runs in strict mode by default
});

function App() {
  useEffect(() => {
    const createLogFile = async () => {
      const fileExists = await RNFS.exists(logFilePath);

      if (!fileExists) {
        await RNFS.writeFile(logFilePath, "");
      }
    };

    createLogFile();
  }, []);

  return (
    <PersistGate loading={null} persistor={persister}>
      <SWRConfig value={SWR_CONFIG}>
        <AppContainer>
          <RootStack />
        </AppContainer>
      </SWRConfig>
    </PersistGate>
  );
}

const SentriedApp = Sentry.wrap(App);

export default function AppWrapper() {
  return (
    <AnimatedSplashScreen>
      <ReduxProvider store={store}>
        <SentriedApp />
      </ReduxProvider>
    </AnimatedSplashScreen>
  );
}

TrackPlayer.registerPlaybackService(() => PlaybackService);
