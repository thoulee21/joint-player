import LottieView from 'lottie-react-native';
import React, { PropsWithChildren } from 'react';
import { StyleSheet, View, ViewStyle } from 'react-native';
import { Text, useTheme } from 'react-native-paper';

export const ANIMATIONS = {
    welcome: require('../assets/animations/welcome.json'),
    rocket: require('../assets/animations/rocket.json'),
    breathe: require('../assets/animations/breathe.json'),
    teapot: require('../assets/animations/teapot.json'),
};

export const LottieAnimation = ({
    children,
    caption,
    animation,
    loop = true,
    style,
    colorFilters,
    progress,
}: PropsWithChildren<{
    caption?: string;
    animation: keyof typeof ANIMATIONS;
    loop?: boolean;
    style?: ViewStyle;
    colorFilters?: Array<{ keypath: string; color: string }>;
    progress?: number;
}>) => {
    const appTheme = useTheme();

    const aniColorFilters = {
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
    };

    return (
        <View style={[styles.view, style]}>
            <LottieView
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
            {children}
            <Text
                variant="titleMedium"
                style={styles.caption}
            >
                {caption}
            </Text>
        </View>
    );
};

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
