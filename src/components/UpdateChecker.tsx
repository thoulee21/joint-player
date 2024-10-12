import * as Updates from 'expo-updates';
import React, { useCallback } from 'react';
import { Alert, ToastAndroid } from 'react-native';
import HapticFeedback, {
    HapticFeedbackTypes
} from 'react-native-haptic-feedback';
import { List, useTheme } from 'react-native-paper';
import RNRestart from 'react-native-restart';

export const UpdateChecker = () => {
    const appTheme = useTheme();

    const {
        currentlyRunning,
        isUpdatePending,
        isChecking,
        isDownloading,
        lastCheckForUpdateTimeSinceRestart: lastCheck,
        isUpdateAvailable,
        availableUpdate,
        checkError,
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

    const updateRestart = async () => {
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

    const performUpdateAlert = useCallback((update: Updates.UpdateInfo) => {
        const { manifest, type, createdAt } = update;
        const msg =
            `A new update is available: ${type} v${manifest?.id} (${createdAt})`;

        const btns = [
            { text: 'Cancel' },
            { text: 'OK', onPress: updateRestart }
        ];

        Alert.alert('Check for updates', msg, btns);
    }, []);

    const checkForUpdate = async () => {
        if (checkError) {
            Alert.alert('Error checking for updates', checkError.message);
            return;
        }

        if (isUpdateAvailable) {
            performUpdateAlert(availableUpdate!);
        } else {
            ToastAndroid.show('No updates available', ToastAndroid.SHORT);
        }
    };

    const onPress = isUpdatePending ? RNRestart.Restart : checkForUpdate;
    const description = isDownloading
        ? 'Downloading update...'
        : isUpdatePending
            ? 'Update is pending, restart to apply'
            : isChecking
                ? 'Checking for updates...'
                : `Last checked: ${lastCheck?.toLocaleString()}`;
    const title = isUpdatePending ? 'Restart to apply update' : 'Check for updates';

    const updateIcon = isUpdatePending ? 'progress-download' : 'cloud-download-outline';
    const iconColor = isUpdatePending ? appTheme.colors.primary : undefined;

    return (
        <List.Item
            title={title}
            description={description}
            onPress={onPress}
            onLongPress={showRunType}
            disabled={isChecking || isDownloading}
            left={props => (
                <List.Icon
                    {...props}
                    icon={updateIcon}
                    color={iconColor}
                />
            )}
        />
    );
};
