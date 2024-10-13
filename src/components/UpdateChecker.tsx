import * as Updates from 'expo-updates';
import React, { useCallback } from 'react';
import { Alert, ToastAndroid } from 'react-native';
import HapticFeedback, { HapticFeedbackTypes } from 'react-native-haptic-feedback';
import { ActivityIndicator, List, useTheme } from 'react-native-paper';
import RNRestart from 'react-native-restart';

const TITLE = 'Check for updates';

export const UpdateChecker = () => {
    const appTheme = useTheme();

    const {
        currentlyRunning,
        isUpdatePending,
        isChecking,
        isDownloading,
        lastCheckForUpdateTimeSinceRestart: lastCheck,
        availableUpdate,
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

    const fetchUpdateAndRestart = async () => {
        try {
            await Updates.fetchUpdateAsync();
            RNRestart.Restart();
        } catch (err) {
            ToastAndroid.show(
                `Error updating app: ${JSON.stringify(err)}`,
                ToastAndroid.LONG
            );
        }
    };

    const performUpdateAlert = useCallback(() => {
        Alert.alert(
            TITLE,
            //debug print
            JSON.stringify(availableUpdate, null, 2),
            [
                { text: 'Cancel' },
                {
                    text: 'OK',
                    onPress: isUpdatePending
                        ? () => RNRestart.Restart()
                        : fetchUpdateAndRestart
                }
            ]
        );
    }, [availableUpdate, isUpdatePending]);

    const checkForUpdate = async () => {
        try {
            const updateCheckRes = await Updates.checkForUpdateAsync();

            if (updateCheckRes.isAvailable) {
                performUpdateAlert();
            } else {
                ToastAndroid.show('No updates available', ToastAndroid.SHORT);
            }
        } catch (err) {
            Alert.alert(
                'Error checking for updates',
                JSON.stringify(err, null, 2)
            );
        }
    };

    const handleUpdatePress = isUpdatePending ? performUpdateAlert : checkForUpdate;
    const description = isDownloading
        ? 'Downloading update...'
        : isUpdatePending
            ? 'Update is pending...'
            : isChecking
                ? 'Checking for updates...'
                : `Last checked: ${lastCheck?.toLocaleString() || 'Never'}`;

    const renderUpdateIcon = useCallback((props: any) => {
        const updateIcon = isUpdatePending
            ? 'progress-download'
            : 'cloud-download-outline';

        return (
            <List.Icon
                {...props}
                icon={updateIcon}
                color={isUpdatePending
                    ? appTheme.colors.primary
                    : props.color}
            />
        );
    }, [appTheme.colors.primary, isUpdatePending]);

    const isProcessing = isChecking || isDownloading;
    const renderActivityIndicator = useCallback((props: any) => (
        isProcessing ? <ActivityIndicator {...props} /> : null
    ), [isProcessing]);

    return (
        <List.Item
            title={TITLE}
            description={description}
            onPress={handleUpdatePress}
            onLongPress={showRunType}
            disabled={isProcessing}
            left={renderUpdateIcon}
            right={renderActivityIndicator}
        />
    );
};
