import { useNavigation } from '@react-navigation/native';
import Color from 'color';
import { BlurView } from 'expo-blur';
import React, { PropsWithChildren, memo, useCallback, useEffect, useState } from 'react';
import { Alert, Dimensions, ImageBackground, StatusBar, StyleSheet } from 'react-native';
import HapticFeedback, { HapticFeedbackTypes } from 'react-native-haptic-feedback';
import { getColors } from 'react-native-image-colors';
import { AndroidImageColors } from 'react-native-image-colors/build/types';
import { Card, useTheme } from 'react-native-paper';
import { useActiveTrack } from 'react-native-track-player';
import useSWR from 'swr';
import { useAppSelector, useDebounce } from '../hook';
import { blurRadius, selectDevModeEnabled } from '../redux/slices';
import { Main as MvMain } from '../types/mv';
import { placeholderImg } from './TrackInfo';

export const MvCover = memo(({ children }: PropsWithChildren) => {
    const navigation = useNavigation();
    const appTheme = useTheme();

    const devModeEnabled = useAppSelector(selectDevModeEnabled);
    const blurRadiusValue = useAppSelector(blurRadius);
    const [isMvCoverDark, setIsMvCoverDark] = useState(appTheme.dark);

    const track = useActiveTrack();
    const { data } = useSWR<MvMain>(
        `http://music.163.com/api/mv/detail?id=${track?.mvid}`
    );

    const printMvData = useCallback(() => {
        if (devModeEnabled && data) {
            if (__DEV__) {
                console.info(JSON.stringify(data.data, null, 2));
            } else {
                Alert.alert(
                    'MV Info',
                    JSON.stringify(data.data, null, 2),
                    [{ text: 'OK' }],
                    { cancelable: true }
                );
            }
        }
    }, [data, devModeEnabled]);

    const StatusBarStyleHandler = useDebounce(async () => {
        const colors = await getColors(data?.data.cover || placeholderImg);
        const imgColor = Color((colors as AndroidImageColors).average);

        setIsMvCoverDark(imgColor.isDark());
        StatusBar.setBarStyle(
            imgColor.isDark() ? 'light-content' : 'dark-content'
        );
    });

    useEffect(() => {
        StatusBarStyleHandler();

        return () => {
            StatusBar.setBarStyle(
                appTheme.dark ? 'light-content' : 'dark-content'
            );
        };
    }, [StatusBarStyleHandler, appTheme, data, track]);

    return (
        <Card
            style={styles.square}
            onPress={printMvData}
            onLongPress={() => {
                HapticFeedback.trigger(
                    HapticFeedbackTypes.effectTick
                );
                // @ts-ignore
                navigation.navigate('WebView', {
                    title: data?.data.name,
                    url: data?.data.cover
                });
            }}
        >
            <ImageBackground
                source={{ uri: data?.data.cover || placeholderImg }}
            >
                <BlurView
                    style={styles.cover}
                    tint={isMvCoverDark ? 'dark' : 'light'}
                    intensity={blurRadiusValue / 2}
                >
                    <BlurView
                        tint={appTheme.dark ? 'dark' : 'light'}
                        intensity={blurRadiusValue}
                    >
                        {children}
                    </BlurView>
                </BlurView>
            </ImageBackground>
        </Card>
    );
});

const styles = StyleSheet.create({
    cover: {
        height: Dimensions.get('window').height / 3,
        justifyContent: 'flex-end',
    },
    square: {
        borderRadius: 0,
    }
});
