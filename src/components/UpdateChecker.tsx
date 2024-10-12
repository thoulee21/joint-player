import * as ExpoUpdates from 'expo-updates';
import React, { useCallback, useEffect } from 'react';
import { Alert, ToastAndroid } from 'react-native';
import HapticFeedback, {
    HapticFeedbackTypes
} from 'react-native-haptic-feedback';
import { Button } from 'react-native-paper';
import { ListLRProps } from '../types/paperListItem';

export const UpdateChecker = (props: ListLRProps) => {
    const {
        currentlyRunning,
        isUpdateAvailable,
        isUpdatePending,
        isChecking,
    } = ExpoUpdates.useUpdates();

    useEffect(() => {
        if (isUpdatePending) {
            ToastAndroid.show('Update is pending...', ToastAndroid.SHORT);
        }
    }, [isUpdatePending]);

    const showRunType = useCallback(() => {
        HapticFeedback.trigger(HapticFeedbackTypes.effectClick);
        ToastAndroid.show(
            currentlyRunning.isEmbeddedLaunch
                ? 'This app is running from built-in code'
                : 'This app is running an update',
            ToastAndroid.SHORT
        );
    }, [currentlyRunning.isEmbeddedLaunch]);

    const checkForUpdate = useCallback(async () => {
        ToastAndroid.show('Checking for updates...', ToastAndroid.SHORT);

        const updateCheckRes = await ExpoUpdates.checkForUpdateAsync();
        Alert.alert(
            'Update check result',
            JSON.stringify(updateCheckRes, null, 2)
        );

        if (updateCheckRes.isAvailable) {
            Alert.alert(
                updateCheckRes.isRollBackToEmbedded
                    ? 'Rollback to embedded version'
                    : 'Update available',
                `Version ${updateCheckRes.manifest.id} is available. ${updateCheckRes.reason} Would you like to update now?`,
                [
                    {
                        text: 'Cancel',
                        style: 'cancel',
                    },
                    {
                        text: 'OK',
                        onPress: () => ExpoUpdates.reloadAsync(),
                    },
                ]
            );
        } else {
            Alert.alert('No updates available');
        }
    }, []);

    return (
        <Button
            {...props}
            compact
            loading={isChecking}
            onLongPress={showRunType}
            onPress={isUpdateAvailable
                ? ExpoUpdates.reloadAsync
                : checkForUpdate}
        >
            {isUpdateAvailable
                ? 'Perform Update'
                : 'Check for Update'}
        </Button>
    );
};
