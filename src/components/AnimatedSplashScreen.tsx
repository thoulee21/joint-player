import Color from 'color';
import LottieView from 'lottie-react-native';
import React, { useEffect, useMemo, useRef, useState, type PropsWithChildren } from 'react';
import { Animated, Appearance, DeviceEventEmitter, StatusBar, StyleSheet } from 'react-native';

export const REMAINING_DURATION = 1000;

const AnimatedLottieView = Animated.createAnimatedComponent(LottieView);

export const AnimatedSplashScreen = ({ children }: PropsWithChildren) => {
    const [isLoadEnd, setIsLoadEnd] = useState(false);
    const [isAniDone, setIsAniDone] = useState(false);

    const loadingProgress = useRef(new Animated.Value(0));
    const opacity = useRef(new Animated.Value(1));

    const themeColor = useMemo(() => Color('#2a8fcf').lighten(
        Appearance.getColorScheme() === 'dark' ? 0.2 : 0.5
    ).hex(), []);

    useEffect(() => {
        DeviceEventEmitter.addListener('loadEnd', () => {
            setIsLoadEnd(true);
        })
    }, []);

    useEffect(() => {
        StatusBar.setBarStyle(
            Appearance.getColorScheme() === 'dark'
                ? 'light-content' : 'dark-content'
        );
    }, []);

    useEffect(() => {
        if (!isLoadEnd) {
            Animated.loop(
                Animated.timing(loadingProgress.current, {
                    toValue: 64 / 147, // stage 1 / total stage
                    duration: 1000,
                    useNativeDriver: true,
                })
            ).start();
        } else {
            Animated.timing(loadingProgress.current, {
                isInteraction: true,
                toValue: 1,
                duration: REMAINING_DURATION,
                useNativeDriver: true,
            }).start(() => {
                setTimeout(() => {
                    DeviceEventEmitter.emit('aniDone');
                }, 25);
                // 动画完成后开始淡出
                Animated.timing(opacity.current, {
                    toValue: 0,
                    duration: 300,
                    useNativeDriver: true,
                }).start(() => setIsAniDone(true));
            })
        }
    }, [loadingProgress, opacity, isLoadEnd]);

    return (
        <>
            {children}
            {!isAniDone && (
                <Animated.View style={[
                    { ...styles.rootView, zIndex: 2 },
                    { opacity: opacity.current }
                ]}>
                    <AnimatedLottieView
                        source={require("../assets/animations/welcome.json")}
                        progress={loadingProgress.current}
                        colorFilters={[
                            { keypath: 'welcome 1', color: themeColor },
                            { keypath: 'welcome 3', color: themeColor },
                            { keypath: 'ball', color: themeColor },
                            {
                                keypath: 'welcome 2',
                                color: Appearance.getColorScheme() === 'dark'
                                    ? 'white' : 'black'
                            },
                        ]}
                        style={styles.rootView}
                    />
                </Animated.View>
            )}
        </>
    );
}

const styles = StyleSheet.create({
    rootView: {
        ...StyleSheet.absoluteFillObject,
        zIndex: 1,
        flex: 1,
        backgroundColor: Appearance.getColorScheme() === 'dark'
            ? 'black' : 'white',
    }
});
