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

    const performUpdateAlert = useCallback(() => {
        const alertButtons = [
            { text: 'Cancel' },
            { text: 'OK', onPress: updateRestart }
        ];

        Alert.alert(
            'Check for updates',
            'Update available. Restart to apply?',
            alertButtons
        );
    }, []);

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

    const onPress = isUpdatePending ? () => RNRestart.restart() : checkForUpdate;
    const description = isDownloading
        ? 'Downloading update...'
        : isUpdatePending
            ? 'Update is pending...'
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
            disabled={isChecking || isDownloading || isChecking}
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
