import LottieView from 'lottie-react-native';
import React from 'react';
import { StyleSheet, View, ViewStyle } from 'react-native';
import { Text } from 'react-native-paper';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const ANIMATIONS = {
    sushi: require('../assets/animations/sushi.json'),
    watermelon: require('../assets/animations/watermelon.json'),
    breathe: require('../assets/animations/breathe.lottie'),
    coral: require('../assets/animations/coral.lottie'),
};

export const LottieAnimation = ({
    caption,
    animation,
    loop = true,
    style
}: {
    caption?: string,
    animation: keyof typeof ANIMATIONS,
    loop?: boolean,
    style?: ViewStyle
}) => {
    const insets = useSafeAreaInsets();

    return (
        <View style={[styles.view, style]}>
            <LottieView
                key={animation}
                source={ANIMATIONS[animation]}
                autoPlay
                loop={loop}
                style={styles.animation}
                resizeMode="contain"
                enableMergePathsAndroidForKitKatAndAbove
                enableSafeModeAndroid
            />
            <Text
                variant="titleMedium"
                style={[styles.caption, {
                    marginLeft: insets.left,
                    marginRight: insets.right,
                    marginBottom: insets.bottom,
                }]}
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
        height: '50%'
    },
    caption: {
        textAlign: 'center',
        textAlignVertical: 'center',
    },
});
