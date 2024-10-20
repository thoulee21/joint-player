import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { useNavigation } from '@react-navigation/native';
import type LottieView from 'lottie-react-native';
import React, { useCallback, useMemo, useRef, useState } from 'react';
import { StyleSheet, TouchableWithoutFeedback } from 'react-native';
import HapticFeedback, { HapticFeedbackTypes } from 'react-native-haptic-feedback';
import { Appbar } from 'react-native-paper';
import { BlurBackground } from '../components/BlurBackground';
import { ANIMATIONS, LottieAnimation, type AniKeys } from '../components/LottieAnimation';

const BottomTab = createMaterialTopTabNavigator();

const AniPage = ({ name }: { name: AniKeys }) => {
    const aniRef = useRef<LottieView>(null);
    const [isPlaying, setIsPlaying] = useState(true);

    const togglePlayPause = useCallback(() => {
        HapticFeedback.trigger(HapticFeedbackTypes.effectClick);

        if (isPlaying) { aniRef.current?.pause(); }
        else { aniRef.current?.resume(); }

        setIsPlaying(prev => !prev);
    }, [isPlaying]);

    return (
        <TouchableWithoutFeedback
            onPress={togglePlayPause}
            style={styles.root}
        >
            <LottieAnimation
                ref={aniRef}
                animation={name}
                caption={name.toLocaleUpperCase()}
            />
        </TouchableWithoutFeedback>
    );
};

export const AniGallery = () => {
    const navigation = useNavigation();

    const renderAniPage = useCallback((name: AniKeys) => {
        return () => <AniPage name={name} />;
    }, []);

    const AniPages = useMemo(() =>
        Object.keys(ANIMATIONS).map((key, index) => (
            <BottomTab.Screen
                key={index}
                name={key}
                component={renderAniPage(key as AniKeys)}
                options={{ tabBarShowLabel: false }}
            />
        )), [ANIMATIONS]);

    return (
        <BlurBackground>
            <Appbar.Header style={styles.transparent}>
                <Appbar.BackAction onPress={navigation.goBack} />
                <Appbar.Content title="Animation Gallery" />
            </Appbar.Header>

            <BottomTab.Navigator
                backBehavior="none"
                tabBarPosition="bottom"
                sceneContainerStyle={styles.transparent}
                screenOptions={{
                    tabBarStyle: styles.tabBarIndicator,
                    tabBarIndicatorStyle: styles.tabBarIndicator,
                }}
            >
                {AniPages}
            </BottomTab.Navigator>
        </BlurBackground>
    );
};

const styles = StyleSheet.create({
    root: {
        flex: 1,
    },
    transparent: {
        backgroundColor: 'transparent',
    },
    tabBarIndicator: {
        height: 3,
        borderRadius: 10,
    },
});
