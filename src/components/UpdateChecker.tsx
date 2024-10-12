import * as Updates from 'expo-updates';
import React, { useCallback } from 'react';
import { Alert, ToastAndroid } from 'react-native';
import HapticFeedback, { HapticFeedbackTypes } from 'react-native-haptic-feedback';
import { Button } from 'react-native-paper';
import { ListLRProps } from '../types/paperListItem';

export const UpdateChecker = (props: ListLRProps) => {
    const {
        currentlyRunning,
        isUpdateAvailable,
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

    const checkForUpdate = useCallback(async () => {
        ToastAndroid.show('Checking for updates...', ToastAndroid.SHORT);
        try {
            const updateCheckRes = await Updates.checkForUpdateAsync();

            if (updateCheckRes.isAvailable) {
                Alert.alert(
                    updateCheckRes.isRollBackToEmbedded
                        ? 'Rollback to embedded version'
                        : 'Update available',
                    `Version ${updateCheckRes.manifest.id} is available. ${updateCheckRes.reason
                    } Would you like to update now?`,
                    [
                        {
                            text: 'Cancel',
                            style: 'cancel',
                        },
                        {
                            text: 'OK',
                            onPress: async () => {
                                await Updates.fetchUpdateAsync();
                                await Updates.reloadAsync();
                            },
                        },
                    ]
                );
            } else {
                Alert.alert('No updates available', `Reason: ${updateCheckRes.reason}`);
            }
        } catch (err) {
            Alert.alert('Error checking for updates', JSON.stringify(err, null, 2));
        }
    }, []);

    return (
        <Button
            {...props}
            compact
            loading={isChecking}
            onLongPress={showRunType}
            onPress={isUpdateAvailable
                ? Updates.reloadAsync
                : checkForUpdate}
            icon={isUpdatePending
                ? 'progress-download'
                : 'cloud-download-outline'}
        >
            {isUpdateAvailable
                ? 'Perform Update'
                : 'Check Update'}
        </Button>
    );
};
