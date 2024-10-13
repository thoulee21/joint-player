import * as Updates from 'expo-updates';
import React, { useCallback } from 'react';
import { Alert, ToastAndroid } from 'react-native';
import HapticFeedback, { HapticFeedbackTypes } from 'react-native-haptic-feedback';
import { ActivityIndicator, List, useTheme } from 'react-native-paper';
import RNRestart from 'react-native-restart';
import { useAppSelector } from '../hook';
import { selectDevModeEnabled } from '../redux/slices';

const TITLE = 'Check for updates';

export const UpdateChecker = () => {
    const appTheme = useTheme();
    const isDev = useAppSelector(selectDevModeEnabled);

    const {
        currentlyRunning,
        isUpdatePending,
        isChecking,
        isDownloading,
        lastCheckForUpdateTimeSinceRestart: lastCheck,
        availableUpdate
    } = Updates.useUpdates();

    const showCurrent = useCallback(() => {
        if (isDev) {
            HapticFeedback.trigger(HapticFeedbackTypes.effectClick);
            if (availableUpdate) {
                Alert.alert(
                    'Available update info',
                    JSON.stringify(availableUpdate, null, 2)
                );
            } else {
                Alert.alert(
                    'Current update info',
                    JSON.stringify(currentlyRunning, null, 2)
                );
            }
        }
    }, [availableUpdate, currentlyRunning, isDev]);

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
            'An update is available. Do you want to proceed?',
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
    }, [isUpdatePending]);

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
            onLongPress={showCurrent}
            disabled={isProcessing}
            left={renderUpdateIcon}
            right={renderActivityIndicator}
        />
    );
};
