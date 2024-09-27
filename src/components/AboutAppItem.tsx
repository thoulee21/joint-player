import React from 'react';
import { Alert, Linking } from 'react-native';
import HapticFeedback, { HapticFeedbackTypes } from 'react-native-haptic-feedback';
import { List } from 'react-native-paper';
import packageData from '../../package.json';

const message = `${packageData.author.email}\nCopyright©${new Date().getFullYear()} ${packageData.author.name}. All Rights Reserved.`;

const buttons = [
    {
        text: 'Homepage',
        onPress: () => {
            HapticFeedback.trigger(HapticFeedbackTypes.effectClick);
            Linking.openURL(packageData.homepage);
        }
    },
    {
        text: 'OK',
        onPress: () => {
            HapticFeedback.trigger(HapticFeedbackTypes.effectClick);
        },
    }
];

export const AboutAppItem = () => {
    const onPress = () => {
        HapticFeedback.trigger(HapticFeedbackTypes.effectClick);
        Alert.alert(packageData.displayName, message, buttons);
    };

    return (
        <List.Item
            title="About This App"
            onPress={onPress}
        />
    );
};
