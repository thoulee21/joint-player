import * as Updates from 'expo-updates';
import React, { useCallback } from 'react';
import { Alert, Linking, ToastAndroid } from 'react-native';
import HapticFeedback, { HapticFeedbackTypes } from 'react-native-haptic-feedback';
import { ActivityIndicator, List, useTheme } from 'react-native-paper';
import RNRestart from 'react-native-restart';
import useSWR from 'swr';
import packageData from '../../package.json';
import { useAppSelector } from '../hook';
import { selectDevModeEnabled } from '../redux/slices';
import type { Main } from '../types/latestRelease';

export const UpdateChecker = () => {
  const appTheme = useTheme();
  const isDev = useAppSelector(selectDevModeEnabled);

  const userRepo = packageData.homepage.split('/').slice(-2).join('/');
  const { data } = useSWR<Main>(`https://api.github.com/repos/${userRepo}/releases/latest`);
  const latestRelease = data?.tag_name;
  const isLatest = latestRelease === packageData.version;

  const {
    currentlyRunning,
    isUpdatePending,
    isChecking,
    isDownloading,
    lastCheckForUpdateTimeSinceRestart: lastCheck,
    availableUpdate,
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
      availableUpdate?.createdAt
        ? `New update available:\n${availableUpdate?.createdAt.toLocaleString()}`
        : 'New update available',
      'Do you want to update now?',
      [
        { text: 'Cancel' },
        {
          text: 'OK',
          onPress: isUpdatePending
            ? () => RNRestart.Restart()
            : fetchUpdateAndRestart,
        },
      ]
    );
  }, [availableUpdate?.createdAt, isUpdatePending]);

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

  const handleUpdatePress = isLatest ?
    isUpdatePending ? performUpdateAlert : checkForUpdate
    : () => Alert.alert(
      'New version available',
      `Your version: ${packageData.version}\nLatest version: ${latestRelease}`,
      [
        { text: 'Cancel' },
        {
          text: 'OK', onPress: () => {
            Linking.openURL(data?.assets_url || 'https://github.com');
          }
        }
      ]
    );

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
      title="Check for updates"
      description={description}
      onPress={handleUpdatePress}
      onLongPress={showCurrent}
      disabled={isProcessing}
      left={renderUpdateIcon}
      right={renderActivityIndicator}
    />
  );
};
