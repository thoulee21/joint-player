import LottieView from 'lottie-react-native';
import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Text } from 'react-native-paper';

const source = require('../assets/animations/loading.json');

export const LoadingAnimation = () => {
    return (
        <View style={styles.loadingView}>
            <LottieView
                key={source}
                source={source}
                autoPlay
                loop
                style={styles.loadingAnimation}
                resizeMode="contain"
                enableMergePathsAndroidForKitKatAndAbove
                enableSafeModeAndroid
            />
            <Text
                variant="titleMedium"
                style={styles.loadingText}
            >
                Loading...
            </Text>
        </View>
    );
};

const styles = StyleSheet.create({
    loadingView: {
        display: 'flex',
        justifyContent: 'center',
        width: '100%',
        height: '90%'
    },
    loadingAnimation: {
        width: '100%',
        height: '50%'
    },
    loadingText: {
        textAlign: 'center',
        textAlignVertical: 'center',
        marginTop: '-20%'
    },
});
