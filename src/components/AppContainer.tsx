import { useMaterial3Theme } from '@pchmn/expo-material3-theme';
import {
    NavigationContainer,
    DarkTheme as NavigationDarkTheme,
    DefaultTheme as NavigationDefaultTheme,
} from '@react-navigation/native';
import Color from 'color';
import React, { PropsWithChildren, useEffect, useMemo, useState } from 'react';
import { DeviceEventEmitter, StatusBar, StyleSheet, ToastAndroid } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import ImageColors from 'react-native-image-colors';
import { AndroidImageColors } from 'react-native-image-colors/build/types';
import {
    MD3DarkTheme,
    MD3LightTheme,
    PaperProvider,
    adaptNavigationTheme
} from 'react-native-paper';
import { useActiveTrack } from 'react-native-track-player';
import { SWRConfig, SWRConfiguration } from 'swr';
import { useAppDispatch, useAppSelector } from '../hook/reduxHooks';
import { useSetupPlayer } from '../hook/useSetupPlayer';
import { selectDarkModeEnabled, setDarkMode } from '../redux/slices/darkMode';
import { requestInit } from '../utils/requestInit';

const swrConfig: SWRConfiguration = {
    fetcher: (resource, init) =>
        fetch(resource, { ...requestInit, ...init })
            .then((res) => res.json()),
};

export function AppContainer({ children }: PropsWithChildren) {
    const dispatch = useAppDispatch();
    const track = useActiveTrack();

    const [isAniDone, setIsAniDone] = useState(false);
    const isPlayerReady = useSetupPlayer();
    const isDarkMode = useAppSelector(selectDarkModeEnabled);
    const { theme: colorTheme, updateTheme } = useMaterial3Theme();

    useEffect(() => {
        DeviceEventEmitter.addListener('aniDone', () => {
            setIsAniDone(true);
        })
    }, []);

    const MyLightTheme = useMemo(() => ({
        ...MD3LightTheme,
        colors: colorTheme.light,
    }), [colorTheme.light]);

    const MyDarkTheme = useMemo(() => ({
        ...MD3DarkTheme,
        colors: colorTheme.dark,
    }), [colorTheme.dark]);

    const { LightTheme: NaviLightTheme, DarkTheme: NaviDarkTheme } = useMemo(
        () => adaptNavigationTheme({
            reactNavigationLight: NavigationDefaultTheme,
            reactNavigationDark: NavigationDarkTheme,
            materialLight: MyLightTheme,
            materialDark: MyDarkTheme,
        }), [MyDarkTheme, MyLightTheme]);

    useEffect(() => {
        const setTheme = async () => {
            if (track?.artwork) {
                const colors = await ImageColors.getColors(track.artwork);
                // TODO: multiple platform support
                const androidColors = (colors as AndroidImageColors);

                const vibrant = Color(androidColors.vibrant);
                const average = Color(androidColors.average);

                dispatch(setDarkMode(average.isDark()));
                updateTheme(vibrant.hex().toString());
            }
        };

        setTheme().finally(() => {
            if (track?.artwork) {
                DeviceEventEmitter.emit('loadEnd');
            }
        });
    }, [track?.artwork]);

    useEffect(() => {
        if (isPlayerReady && __DEV__) {
            ToastAndroid.show('Player ready', ToastAndroid.SHORT);
        }
    }, [isPlayerReady]);

    useEffect(() => {
        if (isAniDone) {
            StatusBar.setBarStyle(
                isDarkMode ? 'light-content' : 'dark-content'
            );
        }
    }, [isDarkMode, isAniDone]);

    return (
        <GestureHandlerRootView style={styles.rootView}>
            <SWRConfig value={swrConfig}>
                <PaperProvider theme={isDarkMode ? MyDarkTheme : MyLightTheme}>
                    <NavigationContainer theme={isDarkMode ? NaviDarkTheme : NaviLightTheme}>
                        <StatusBar translucent />
                        {children}
                    </NavigationContainer>
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
