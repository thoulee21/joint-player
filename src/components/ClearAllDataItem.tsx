import React, { useCallback } from 'react';
import { Alert } from 'react-native';
import HapticFeedback, {
    HapticFeedbackTypes
} from 'react-native-haptic-feedback';
import { List, useTheme } from 'react-native-paper';
import RNRestart from 'react-native-restart';
import { Storage } from '../utils';

export const ClearAllDataItem = () => {
    const appTheme = useTheme();

    const DeleteForeverIcon = useCallback((props: any) => (
        <List.Icon {...props}
            icon="delete-forever-outline"
            color={appTheme.colors.error}
        />
    ), [appTheme.colors.error]);

    const clearAndRestart = useCallback(async () => {
        await Storage.clear();
        RNRestart.Restart();
    }, []);

    const clearAllData = useCallback(async () => {
        HapticFeedback.trigger(HapticFeedbackTypes.notificationWarning);
        Alert.alert(
            'Clear All Data',
            'Are you sure you want to clear all data?',
            [
                { text: 'Cancel', style: 'cancel' },
                {
                    text: 'OK',
                    style: 'destructive',
                    onPress: clearAndRestart,
                },
            ],
        );
    }, [clearAndRestart]);

    return (
        <List.Item
            title="Clear All Data"
            description="Clear all data and restart the app"
            left={DeleteForeverIcon}
            onPress={clearAllData}
        />
    );
};
