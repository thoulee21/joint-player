import 'react-native-gesture-handler';
import React from 'react';
import { AppRegistry } from 'react-native';
import TrackPlayer from 'react-native-track-player';
import { Provider } from 'react-redux';
import { name as appName } from './app.json';
import App from './src/App';
import { store } from './src/redux/store';
import { PlaybackService } from './src/services';

AppRegistry.registerComponent(appName, () => () => (
    <Provider store={store}>
        <App />
    </Provider>
));


TrackPlayer.registerPlaybackService(() => PlaybackService);
