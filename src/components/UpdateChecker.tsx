import * as Updates from 'expo-updates';
import React, {
  useCallback,
  useState,
} from 'react';
import {
  Alert,
  DeviceEventEmitter,
  ToastAndroid,
} from 'react-native';
import HapticFeedback, {
  HapticFeedbackTypes,
} from 'react-native-haptic-feedback';
import {
  ActivityIndicator,
  Button,
  Dialog,
  List,
  Portal,
  Text,
  useTheme,
} from 'react-native-paper';
import RNRestart from 'react-native-restart';
import useSWR from 'swr';
import packageData from '../../package.json';
import { useAppSelector } from '../hook';
import { selectDevModeEnabled } from '../redux/slices';
import type { Main } from '../types/latestRelease';
import { rootLog } from '../utils/logger';

const USER_REPO = packageData.homepage
  .split('/')
  .slice(-2)
  .join('/');

export const UpdateChecker = () => {
  const appTheme = useTheme();
  const isDev = useAppSelector(selectDevModeEnabled);
  const [
    dialogVisible,
    setDialogVisible,
  ] = useState(false);

  const {
    currentlyRunning,
    isUpdatePending,
    isChecking,
    isDownloading,
    lastCheckForUpdateTimeSinceRestart: lastCheck,
    availableUpdate,
  } = Updates.useUpdates();

  const { data } = useSWR<Main>(
    `https://api.github.com/repos/${USER_REPO}/releases/latest`
  );

  const showUpdateDialog = useCallback(() => {
    setDialogVisible(true);
  }, []);

  const latestRelease = data?.tag_name;
  const isLatest = latestRelease === `v${packageData.version}`;

  const showCurrent = useCallback(() => {
    if (isDev) {
      HapticFeedback.trigger(
        HapticFeedbackTypes.effectClick
      );

      if (availableUpdate) {
        Alert.alert(
          'Available update info',
          JSON.stringify(
            availableUpdate, null, 2
          )
        );
      } else {
        Alert.alert(
          'Current update info',
          JSON.stringify(
            currentlyRunning, null, 2
          )
        );
      }
    }
  }, [availableUpdate, currentlyRunning, isDev]);

  const fetchUpdateAndRestart = async () => {
    try {
      await Updates.fetchUpdateAsync();
      RNRestart.Restart();
    } catch (err) {
      rootLog.error(err);
      ToastAndroid.show(
        `Error updating app: ${JSON.stringify(err)}`,
        ToastAndroid.LONG
      );
    }
  };

  const checkForUpdate = async () => {
    try {
      const updateCheckRes = await Updates.checkForUpdateAsync();

      if (updateCheckRes.isAvailable) {
        showUpdateDialog();
      } else {
        ToastAndroid.show(
          'No updates available',
          ToastAndroid.SHORT
        );
      }
    } catch (err) {
      rootLog.error(err);
      ToastAndroid.show(
        'Error checking for updates',
        ToastAndroid.SHORT
      );
    }
  };

  const handleUpdatePress = isLatest ? (
    isUpdatePending ? showUpdateDialog : checkForUpdate
  ) : () => {
    DeviceEventEmitter.emit('newReleaseAvailable');
    rootLog.debug('New release available:', latestRelease);
  };

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
    <>
      <List.Item
        title="Check for updates"
        description={description}
        onPress={handleUpdatePress}
        onLongPress={showCurrent}
        disabled={isProcessing}
        left={renderUpdateIcon}
        right={renderActivityIndicator}
      />

      <Portal>
        <Dialog
          visible={dialogVisible}
          onDismiss={() => setDialogVisible(false)}
        >
          <Dialog.Icon icon="information" size={40} />
          <Dialog.Title>Update available</Dialog.Title>
          <Dialog.Content>
            <Text>
              {availableUpdate?.createdAt
                && `New update created at ${availableUpdate?.createdAt.toLocaleString()} is available.\n`}
              Do you want to update now?
            </Text>
          </Dialog.Content>

          <Dialog.Actions>
            <Button
              textColor={appTheme.colors.outline}
              onPress={() => setDialogVisible(false)}
            >Cancel</Button>

            <Button
              onPress={
                isUpdatePending
                  ? () => RNRestart.Restart()
                  : fetchUpdateAndRestart
              }
            >Update</Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>
    </>
  );
};
