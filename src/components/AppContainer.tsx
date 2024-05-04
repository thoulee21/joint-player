import { useMaterial3Theme } from '@pchmn/expo-material3-theme';
import {
    NavigationContainer,
    DarkTheme as NavigationDarkTheme,
    DefaultTheme as NavigationDefaultTheme,
} from '@react-navigation/native';
import React, { PropsWithChildren, useMemo } from 'react';
import { StatusBar, StyleSheet } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import {
    MD3DarkTheme,
    MD3LightTheme,
    PaperProvider,
    adaptNavigationTheme
} from 'react-native-paper';
import { SWRConfig, SWRConfiguration } from 'swr';
import { PreferencesContext } from '../App';
import { useAppSelector } from '../hook';
import { selectDarkModeEnabled } from '../redux/slices';
import { requestInit } from '../services';

const swrConfig: SWRConfiguration = {
    fetcher: (resource, init) =>
        fetch(resource, { ...requestInit, ...init })
            .then((res) => res.json()),
};

export function AppContainer({ children }: PropsWithChildren) {
    const isDarkMode = useAppSelector(selectDarkModeEnabled);
    const { theme: colorTheme, updateTheme } = useMaterial3Theme();

    const preferences = useMemo(() => ({
        updateTheme,
        //no updateTheme
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }), []);

    const MyLightTheme = useMemo(
        () => ({
            ...MD3LightTheme,
            colors: colorTheme.light,
        }),
        [colorTheme.light],
    );

    const MyDarkTheme = useMemo(
        () => ({
            ...MD3DarkTheme,
            colors: colorTheme.dark,
        }),
        [colorTheme.dark],
    );

    const { LightTheme: NaviLightTheme, DarkTheme: NaviDarkTheme } = useMemo(
        () => adaptNavigationTheme({
            reactNavigationLight: NavigationDefaultTheme,
            reactNavigationDark: NavigationDarkTheme,
            materialLight: MyLightTheme,
            materialDark: MyDarkTheme,
        }), [MyDarkTheme, MyLightTheme]);

    return (
        <GestureHandlerRootView style={styles.rootView}>
            <SWRConfig value={swrConfig}>
                <PaperProvider theme={isDarkMode ? MyDarkTheme : MyLightTheme}>
                    <PreferencesContext.Provider value={preferences}>
                        <NavigationContainer theme={isDarkMode ? NaviDarkTheme : NaviLightTheme}>
                            <StatusBar
                                translucent
                                backgroundColor="transparent"
                                barStyle={isDarkMode ? 'light-content' : 'dark-content'}
                            />
                            {children}
                        </NavigationContainer>
                    </PreferencesContext.Provider>
                </PaperProvider>
            </SWRConfig>
        </GestureHandlerRootView>
    );
}

const styles = StyleSheet.create({
    rootView: {
        flex: 1
    }
});
