import * as Sentry from '@sentry/react-native';
import React from 'react';
import { AppRegistry } from 'react-native';
import 'react-native-gesture-handler';
import TrackPlayer from 'react-native-track-player';
import { Provider } from 'react-redux';
import { name as appName } from './package.json';
import App from './src/App';
import { store } from './src/redux/store';
import { PlaybackService } from './src/services';

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
        Sentry.mobileReplayIntegration(),
        Sentry.reactNativeTracingIntegration(),
    ],
});

AppRegistry.registerComponent(appName, () =>
    Sentry.wrap(() => (
        <Provider store={store}>
            <App />
        </Provider>
    ))
);


TrackPlayer.registerPlaybackService(() => PlaybackService);
