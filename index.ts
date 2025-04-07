import { registerRootComponent } from "expo";
import * as SplashScreen from "expo-splash-screen";
import "react-native-gesture-handler";
import "react-native-get-random-values";

import App from "./src/App";

SplashScreen.setOptions({ duration: 0 });

// registerRootComponent calls AppRegistry.registerComponent('main', () => App);
// It also ensures that whether you load the app in Expo Go or in a native build,
// the environment is set up appropriately
registerRootComponent(App);
