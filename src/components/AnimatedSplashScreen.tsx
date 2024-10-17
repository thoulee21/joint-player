import LottieView from 'lottie-react-native';
import React, { useEffect, useRef, useState } from 'react';
import { Animated, Easing, StyleSheet } from 'react-native';

export const REMAINING_DURATION = 500;

const AnimatedLottieView = Animated.createAnimatedComponent(LottieView);

export const AnimatedSplashScreen = ({ isLoadEnd }: { isLoadEnd: boolean }) => {
    const [visible, setVisible] = useState(true);

    const loadingProgress = useRef(new Animated.Value(0));
    const opacity = useRef(new Animated.Value(1));

    useEffect(() => {
        if (!isLoadEnd) {
            Animated.loop(
                Animated.timing(loadingProgress.current, {
                    toValue: 64 / 147, // stage 1 / total stage
                    duration: 1017,
                    easing: Easing.linear,
                    useNativeDriver: true,
                })
            ).start();
        } else {
            Animated.timing(loadingProgress.current, {
                isInteraction: true,
                toValue: 1,
                duration: REMAINING_DURATION,
                easing: Easing.sin,
                useNativeDriver: true,
            }).start(() => {
                // 动画完成后开始淡出
                Animated.timing(opacity.current, {
                    toValue: 0,
                    duration: 350,
                    easing: Easing.ease,
                    useNativeDriver: true,
                }).start(() => setVisible(false));
            });
        }
    }, [isLoadEnd, loadingProgress, opacity]);

    if (!visible) return null;

    return (
        <Animated.View
            style={[
                { ...styles.rootView, zIndex: 2 },
                { opacity: opacity.current }
            ]}
        >
            <AnimatedLottieView
                source={require("../assets/animations/welcome.json")}
                progress={loadingProgress.current}
                colorFilters={[
                    { keypath: 'welcome 1', color: '#2a8fcf' },
                    { keypath: 'welcome 3', color: '#2a8fcf' },
                    { keypath: 'ball', color: '#2a8fcf' },
                ]}
                style={styles.rootView}
            />
        </Animated.View>
    );
}

const styles = StyleSheet.create({
    rootView: {
        ...StyleSheet.absoluteFillObject,
        zIndex: 1,
        flex: 1,
        backgroundColor: 'black',
    }
});
