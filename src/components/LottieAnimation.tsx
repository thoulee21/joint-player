import LottieView from 'lottie-react-native';
import React, { PropsWithChildren, forwardRef, useMemo, type ForwardedRef } from 'react';
import { StyleSheet, TouchableWithoutFeedback, View, ViewStyle } from 'react-native';
import { Text, useTheme } from 'react-native-paper';

export const ANIMATIONS = {
    welcome: require('../assets/animations/welcome.json'),
    rocket: require('../assets/animations/rocket.json'),
    breathe: require('../assets/animations/breathe.json'),
    teapot: require('../assets/animations/teapot.json'),
};

export type AniKeys = keyof typeof ANIMATIONS

export const LottieAnimation = forwardRef(({
    children,
    caption,
    animation,
    loop = true,
    style,
    colorFilters,
    progress,
    onPress,
}: PropsWithChildren<{
    caption?: string;
    animation: AniKeys;
    loop?: boolean;
    style?: ViewStyle;
    colorFilters?: { keypath: string; color: string }[];
    progress?: number;
    onPress?: () => void;
}>, ref: ForwardedRef<LottieView>) => {
    const appTheme = useTheme();

    const aniColorFilters = useMemo(() => ({
        breathe: [
            { keypath: 'Breathe out', color: appTheme.colors.onBackground },
            { keypath: 'Breathe in', color: appTheme.colors.onBackground },
        ],
        welcome: [
            { keypath: 'welcome 1', color: appTheme.colors.primary },
            { keypath: 'welcome 3', color: appTheme.colors.primary },
            { keypath: 'ball', color: appTheme.colors.primary },
            { keypath: 'welcome 2', color: appTheme.colors.background },
        ],
    }), [appTheme.colors]);

    return (
        <View style={[styles.view, style]}>
            <TouchableWithoutFeedback onPress={onPress}>
                <LottieView
                    ref={ref}
                    key={animation}
                    source={ANIMATIONS[animation]}
                    autoPlay
                    loop={loop}
                    progress={progress}
                    style={styles.animation}
                    resizeMode="contain"
                    enableMergePathsAndroidForKitKatAndAbove
                    enableSafeModeAndroid
                    colorFilters={colorFilters
                        || aniColorFilters[animation as keyof typeof aniColorFilters]}
                />
            </TouchableWithoutFeedback>
            {children}
            <Text
                variant="titleMedium"
                style={styles.caption}
            >
                {caption}
            </Text>
        </View>
    );
});

const styles = StyleSheet.create({
    view: {
        flex: 1,
        justifyContent: 'center',
    },
    animation: {
        width: '100%',
        height: '50%',
    },
    caption: {
        textAlign: 'center',
        textAlignVertical: 'center',
    },
});
