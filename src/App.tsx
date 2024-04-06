import { useMaterial3Theme } from '@pchmn/expo-material3-theme';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { createDrawerNavigator } from "@react-navigation/drawer";
import {
  InitialState,
  NavigationContainer,
  DarkTheme as NavigationDarkTheme,
  DefaultTheme as NavigationDefaultTheme
} from "@react-navigation/native";
import Color from 'color';
import React, { useEffect, useState } from 'react';
import {
  StatusBar,
  StyleSheet,
  useColorScheme
} from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import {
  MD3DarkTheme,
  MD3LightTheme,
  PaperProvider,
  adaptNavigationTheme
} from 'react-native-paper';
import { useActiveTrack } from 'react-native-track-player';
import { DrawerItems } from './components';
import { useImageColors } from './hook';
import { Player, Settings } from './pages';

export const PERSISTENCE_KEY = 'NAVIGATION_STATE';

const Drawer = createDrawerNavigator();

function App() {
  const isDarkMode = useColorScheme() === 'dark';
  const { theme: colorTheme, updateTheme } = useMaterial3Theme();

  const [initialState, setInitialState] = useState<InitialState | undefined>();
  const [isReady, setIsReady] = useState(false);

  const track = useActiveTrack();
  const imageUri = track?.artwork;

  const MyLightTheme = {
    ...MD3LightTheme,
    colors: colorTheme.light,
  };

  const MyDarkTheme = {
    ...MD3DarkTheme,
    colors: colorTheme.dark,
  };

  useEffect(() => {
    if (!imageUri) {
      return;
    }
    const colors = useImageColors(imageUri);

    colors.then((colors) => {
      const color = Color(colors[0])
      updateTheme(color.hex());
    });
  }, [imageUri]);

  useEffect(() => {
    const restoreState = async () => {
      try {
        const savedStateString = await AsyncStorage.getItem(PERSISTENCE_KEY);
        const state = JSON.parse(savedStateString || '');

        setInitialState(state);
      } finally {
        setIsReady(true);
      }
    };

    if (!isReady) {
      restoreState();
    }
  }, [isReady]);

  const {
    LightTheme: NaviLightTheme,
    DarkTheme: NaviDarkTheme
  } = adaptNavigationTheme({
    reactNavigationLight: NavigationDefaultTheme,
    reactNavigationDark: NavigationDarkTheme,
    materialLight: MyLightTheme,
    materialDark: MyDarkTheme,
  });

  const combinedTheme = isDarkMode ? NaviDarkTheme : NaviLightTheme;

  return (
    <GestureHandlerRootView style={styles.rootView}>
      <PaperProvider theme={isDarkMode ? MyDarkTheme : MyLightTheme}>
        <NavigationContainer
          theme={combinedTheme}
          initialState={initialState}
          onStateChange={(state) =>
            AsyncStorage.setItem(PERSISTENCE_KEY, JSON.stringify(state))
          }
        >
          <StatusBar
            barStyle={!isDarkMode ? 'light-content' : 'dark-content'}
          />
          <Drawer.Navigator
            drawerContent={(props) => <DrawerItems {...props} />}
            initialRouteName="Home"
          >
            <Drawer.Screen
              name="Home"
              options={{ headerShown: false }}
              component={Player}
            />
            <Drawer.Screen
              name="Settings"
              options={{ headerShown: false }}
              component={Settings}
            />
          </Drawer.Navigator>
        </NavigationContainer>
      </PaperProvider>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  rootView: {
    flex: 1,
  },
});

export default App;
