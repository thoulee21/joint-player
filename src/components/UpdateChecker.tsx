import * as Updates from 'expo-updates';
import React, {
  useCallback,
  useState,
} from 'react';
import { useTranslation } from 'react-i18next';
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
  const { t } = useTranslation();

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
          t('about.update.alert.available.title'),
          JSON.stringify(
            availableUpdate, null, 2
          )
        );
      } else {
        Alert.alert(
          t('about.update.alert.current.title'),
          JSON.stringify(
            currentlyRunning, null, 2
          )
        );
      }
    }
  }, [availableUpdate, currentlyRunning, isDev, t]);

  const fetchUpdateAndRestart = async () => {
    try {
      await Updates.fetchUpdateAsync();
      RNRestart.Restart();
    } catch (err) {
      rootLog.error(err);
      ToastAndroid.show(
        t('about.update.toast.error') + JSON.stringify(err),
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
          t('about.update.toast.check.notAvaliable.msg'),
          ToastAndroid.SHORT
        );
      }
    } catch (err) {
      rootLog.error(err);
      ToastAndroid.show(
        t('about.update.toast.check.error.msg'),
        ToastAndroid.SHORT
      );
    }
  };

  const handleUpdatePress = isLatest ? (
    isUpdatePending ? showUpdateDialog : checkForUpdate
  ) : () => {
    DeviceEventEmitter.emit('newReleaseAvailable');
  };

  const description = isDownloading
    ? t('about.update.listItem.description.isDownloading')
    : isUpdatePending
      ? t('about.update.listItem.description.isUpdatePending')
      : isChecking
        ? t('about.update.listItem.description.isChecking')
        : t('about.update.listItem.description.lastCheck') + lastCheck?.toLocaleString() || t('about.update.listItem.description.never');

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
        title={t('about.update.listItem.title')}
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
          <Dialog.Title>{t('about.update.dialog.title')}</Dialog.Title>
          <Dialog.Content>
            <Text>
              {availableUpdate?.createdAt
                && t(
                  'about.update.dialog.caption',
                  { date: availableUpdate.createdAt.toISOString() }
                )}
              {t('about.update.dialog.ask')} </Text>
          </Dialog.Content>

          <Dialog.Actions>
            <Button
              textColor={appTheme.colors.outline}
              onPress={() => setDialogVisible(false)}
            >
              {t('about.update.dialog.actions.cancel')}
            </Button>

            <Button
              onPress={
                isUpdatePending
                  ? () => RNRestart.Restart()
                  : fetchUpdateAndRestart
              }
            >
              {t('about.update.dialog.actions.update')}
            </Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>
    </>
  );
};
