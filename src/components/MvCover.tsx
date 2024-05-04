import { useNavigation } from '@react-navigation/native';
import Color from 'color';
import { BlurView } from 'expo-blur';
import React, { ReactNode, useEffect } from 'react';
import {
    Dimensions,
    ImageBackground,
    StatusBar,
    StyleSheet,
    View
} from 'react-native';
import HapticFeedback, {
    HapticFeedbackTypes
} from 'react-native-haptic-feedback';
import { getColors } from 'react-native-image-colors';
import { AndroidImageColors } from 'react-native-image-colors/build/types';
import { Card, useTheme } from 'react-native-paper';
import { useActiveTrack } from 'react-native-track-player';
import useSWR from 'swr';
import { useDebounce } from '../hook';
import { Main as MvMain } from '../types/mv';
import { placeholderImg } from './TrackInfo';

export const MvCover = ({ children, onPress }:
    { children: ReactNode, onPress?: () => void }
) => {
    const navigation = useNavigation();
    const appTheme = useTheme();

    const track = useActiveTrack();
    const { data } = useSWR<MvMain>(
        `http://music.163.com/api/mv/detail?id=${track?.mvid}`
    );

    const StatusBarStyleHandler = useDebounce(async () => {
        const colors = await getColors(data?.data.cover || placeholderImg);
        const imgColor = Color((colors as AndroidImageColors).average);

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
            onPress={onPress}
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
                <View style={styles.cover}>
                    <BlurView
                        tint={appTheme.dark ? 'dark' : 'light'}
                        intensity={100}
                    >
                        {children}
                    </BlurView>
                </View>
            </ImageBackground>
        </Card>
    );
};

const styles = StyleSheet.create({
    cover: {
        height: Dimensions.get('window').height / 3.5,
        justifyContent: 'flex-end',
    },
    square: {
        borderRadius: 0,
    }
});
