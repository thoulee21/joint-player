import BottomSheet from '@gorhom/bottom-sheet';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { createDrawerNavigator } from "@react-navigation/drawer";
import {
  InitialState,
  NavigationContainer,
  DarkTheme as NavigationDarkTheme,
  DefaultTheme as NavigationDefaultTheme
} from "@react-navigation/native";
import React, { useEffect, useRef, useState } from 'react';
import {
  StatusBar,
  StyleSheet,
  useColorScheme
} from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import {
  Appbar,
  MD3DarkTheme,
  MD3LightTheme,
  PaperProvider,
  Portal,
  adaptNavigationTheme
} from 'react-native-paper';
import { useActiveTrack } from 'react-native-track-player';
import { version as appVersion } from "../package.json";
import {
  DrawerItems,
  LoadingPage,
  PlayControls,
  Progress,
  ScreenWrapper,
  Spacer,
  TrackInfo,
  TrackListSheet
} from './components';
import { useSetupPlayer } from './hook';
import { Settings } from './pages';

export const PERSISTENCE_KEY = 'NAVIGATION_STATE';

const Drawer = createDrawerNavigator();

function App() {
  const isDarkMode = useColorScheme() === 'dark';

  const [initialState, setInitialState] = useState<InitialState | undefined>();
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    const restoreState = async () => {
      try {
        const savedStateString = await AsyncStorage.getItem(PERSISTENCE_KEY);
        const state = JSON.parse(savedStateString || '');

        setInitialState(state);
      } catch (e) {
        // ignore error
      } finally {
        setIsReady(true);
      }
    };

    if (!isReady) {
      restoreState();
    }
  }, [isReady]);

  const { LightTheme, DarkTheme } = adaptNavigationTheme({
    reactNavigationLight: NavigationDefaultTheme,
    reactNavigationDark: NavigationDarkTheme,
  });

  const CombinedDefaultTheme = {
    ...MD3LightTheme,
    ...LightTheme,
    colors: {
      ...MD3LightTheme.colors,
      ...LightTheme.colors,
    },
  };

  const CombinedDarkTheme = {
    ...MD3DarkTheme,
    ...DarkTheme,
    colors: {
      ...MD3DarkTheme.colors,
      ...DarkTheme.colors,
    },
  };

  const combinedTheme = isDarkMode ? CombinedDarkTheme : CombinedDefaultTheme;

  return (
    <GestureHandlerRootView style={styles.rootView}>
      <PaperProvider>
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
              component={Inner}
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

function Inner({ navigation }: { navigation: any }): React.JSX.Element {
  const track = useActiveTrack();
  const isPlayerReady = useSetupPlayer();
  const bottomSheetRef = useRef<BottomSheet>(null);

  if (!isPlayerReady) {
    return <LoadingPage />;
  }

  return (
    <>
      <Appbar.Header elevated>
        <Appbar.Action
          icon="menu"
          onPress={() => {
            navigation.openDrawer();
          }}
        />
        <Appbar.Content title={`Joint Player v${appVersion}`} />
        <Appbar.Action
          icon="menu-open"
          onPress={() => {
            bottomSheetRef.current?.expand();
          }}
        />
      </Appbar.Header>

      <ScreenWrapper contentContainerStyle={styles.screenContainer}>
        <Spacer />
        <TrackInfo track={track} />
        <Progress live={track?.isLiveStream} />
        <Spacer />
        <PlayControls />
        <Spacer mode="expand" />
      </ScreenWrapper>

      <Portal>
        <TrackListSheet bottomSheetRef={bottomSheetRef} />
      </Portal>
    </>
  );
}

const styles = StyleSheet.create({
  rootView: {
    flex: 1,
  },
  screenContainer: {
    display: 'flex',
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default App;
