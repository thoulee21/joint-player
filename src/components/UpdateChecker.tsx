import * as Updates from 'expo-updates';
import React, { useCallback } from 'react';
import { Alert, ToastAndroid } from 'react-native';
import HapticFeedback, { HapticFeedbackTypes } from 'react-native-haptic-feedback';
import { Button } from 'react-native-paper';
import { ListLRProps } from '../types/paperListItem';
import { camelCaseToTitleCase } from '../utils/camelCaseToTitleCase';

export const UpdateChecker = (props: ListLRProps) => {
    const {
        currentlyRunning,
        isUpdatePending,
        isChecking,
    } = Updates.useUpdates();

    const showRunType = useCallback(() => {
        HapticFeedback.trigger(HapticFeedbackTypes.effectClick);

        ToastAndroid.show(
            currentlyRunning.isEmbeddedLaunch
                ? 'This app is running from built-in code'
                : 'This app is running an update',
            ToastAndroid.SHORT
        );
    }, [currentlyRunning.isEmbeddedLaunch]);

    const performUpdateAlert = useCallback((res: Updates.UpdateCheckResult) => {
        const msg =
            `Version ${res.manifest?.id} is available. ${res.reason} Would you like to update now?`;

        const btns = [
            { text: 'Cancel' },
            {
                text: 'OK',
                onPress: async () => {
                    await Updates.fetchUpdateAsync();
                    await Updates.reloadAsync();
                },
            }
        ];

        Alert.alert('Check for updates', msg, btns);
    }, []);

    const checkForUpdate = async () => {
        ToastAndroid.show('Checking for updates...', ToastAndroid.SHORT);
        try {
            const updateCheckRes = await Updates.checkForUpdateAsync();

            if (updateCheckRes.isAvailable) {
                performUpdateAlert(updateCheckRes);
            } else {
                Alert.alert(
                    'Check for updates',
                    updateCheckRes.reason
                        ? camelCaseToTitleCase(updateCheckRes.reason)
                        : 'No updates available'
                );
            }
        } catch (err) {
            Alert.alert(
                'Error checking for updates',
                JSON.stringify(err, null, 2)
            );
        }
    };

    return (
        <Button
            {...props}
            compact
            loading={isChecking}
            onLongPress={showRunType}
            onPress={checkForUpdate}
            icon={isUpdatePending
                ? 'progress-download'
                : 'cloud-download-outline'}
        >
            Check for Updates
        </Button>
    );
};
