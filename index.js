import React from 'react';
import { AppRegistry } from 'react-native';
import { Provider as ReduxProvider } from 'react-redux';
import { name as appName } from './package.json';
import App from './src/App';
import { AnimatedSplashScreen } from './src/components/AnimatedSplashScreen';
import { store } from './src/redux/store';

AppRegistry.registerComponent(appName, () => () => (
    <AnimatedSplashScreen>
        <ReduxProvider store={store}>
            <App />
        </ReduxProvider>
    </AnimatedSplashScreen>
));
