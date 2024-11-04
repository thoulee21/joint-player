import { useNavigation } from '@react-navigation/native';
import React from 'react';
import { StyleSheet } from 'react-native';
import { Appbar } from 'react-native-paper';
import { BlurBackground } from '../components/BlurBackground';
import { LottieAnimation } from '../components/LottieAnimation';

export const TestScreen = () => {
    const navigation = useNavigation();

    return (
        <BlurBackground>
            <Appbar.Header style={styles.appbar}>
                <Appbar.BackAction onPress={navigation.goBack} />
                <Appbar.Content title="Experimental Test" />
            </Appbar.Header>

            <LottieAnimation
                animation="teapot"
                caption="This screen is for testing purposes."
            />
        </BlurBackground>
    );
};

const styles = StyleSheet.create({
    appbar: {
        backgroundColor: 'transparent',
    },
});
