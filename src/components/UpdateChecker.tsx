import * as ExpoUpdates from 'expo-updates';
import React, { useCallback, useEffect, useState } from 'react';
import { ToastAndroid } from 'react-native';
import HapticFeedback, { HapticFeedbackTypes } from 'react-native-haptic-feedback';
import { Button } from 'react-native-paper';
import { ListLRProps } from '../types/paperListItem';

export const UpdateChecker = (props: ListLRProps) => {
    const [checking, setChecking] = useState(false);
    const {
        currentlyRunning,
        isUpdateAvailable,
        isUpdatePending
    } = ExpoUpdates.useUpdates();

    useEffect(() => {
        if (isUpdatePending) {
            // Update has successfully downloaded; apply it now
            ExpoUpdates.reloadAsync();
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
        setChecking(true);
        ToastAndroid.show('Checking for updates...', ToastAndroid.SHORT);

        await ExpoUpdates.checkForUpdateAsync();
        setChecking(false);
    }, []);

    return (
        <Button
            {...props}
            compact
            loading={checking}
            onLongPress={showRunType}
            onPress={isUpdateAvailable
                ? ExpoUpdates.reloadAsync
                : checkForUpdate}
        >
            {isUpdateAvailable
                ? 'Perform Update'
                : 'Check for Updates'}
        </Button>
    );
};
