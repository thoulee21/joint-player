import { useNavigation } from '@react-navigation/native';
import React from 'react';
import { ScrollView } from 'react-native';
import { Appbar } from 'react-native-paper';
import { BlurBackground } from '../components/BlurBackground';
import { LottieAnimation } from '../components/LottieAnimation';

export const Test = () => {
    const navigation = useNavigation();

    return (
        <BlurBackground>
            <Appbar.Header>
                <Appbar.BackAction onPress={navigation.goBack} />
                <Appbar.Content title="Test" />
            </Appbar.Header>

            <ScrollView>
                <LottieAnimation
                    animation="teapot"
                    caption="This screen is for testing purposes."
                />
            </ScrollView>
        </BlurBackground>
    );
};
