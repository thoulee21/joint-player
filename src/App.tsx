import { useMaterial3Theme } from '@pchmn/expo-material3-theme';
import { createDrawerNavigator } from "@react-navigation/drawer";
import {
  NavigationContainer,
  DarkTheme as NavigationDarkTheme,
  DefaultTheme as NavigationDefaultTheme
} from "@react-navigation/native";
import React, { createContext, useMemo, useState } from 'react';
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
import { DrawerItems } from './components';
import { Player, Settings } from './pages';

export const PreferencesContext = createContext<{
  updateTheme: (sourceColor: string) => void;
  setKeyword: (keyword: string) => void;
  keyword: string;
} | null>(null);

const Drawer = createDrawerNavigator();

function App() {
  const isDarkMode = useColorScheme() === 'dark';
  const { theme: colorTheme, updateTheme } = useMaterial3Theme();
  const [keyword, setKeyword] = useState('');

  const MyLightTheme = useMemo(() => ({
    ...MD3LightTheme,
    colors: colorTheme.light,
  }), [colorTheme.light]);

  const MyDarkTheme = useMemo(() => ({
    ...MD3DarkTheme,
    colors: colorTheme.dark,
  }), [colorTheme.dark]);

  const preferences = useMemo(
    () => ({
      keyword,
      setKeyword,
      updateTheme,
    }),
    [keyword]
  );

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
        <PreferencesContext.Provider value={preferences}>
          <NavigationContainer theme={combinedTheme}>
            <StatusBar
              translucent
              backgroundColor="transparent"
              barStyle={isDarkMode ? 'light-content' : 'dark-content'}
            />
            <Drawer.Navigator
              drawerContent={(props) => <DrawerItems {...props} />}
              screenOptions={{ headerShown: false }}
            >
              <Drawer.Screen
                name="Home"
                component={Player}
              />
              <Drawer.Screen
                name="Settings"
                component={Settings}
              />
            </Drawer.Navigator>
          </NavigationContainer>
        </PreferencesContext.Provider>
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
