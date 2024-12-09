import React, { useCallback, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { PermissionsAndroid, ToastAndroid } from 'react-native';
import RNFS from 'react-native-fs';
import { List } from 'react-native-paper';
import { v4 as uuid } from 'uuid';
import { name as appName } from '../../package.json';
import type { ListLRProps } from '../types/paperListItem';
import { storage } from '../utils/reduxPersistMMKV';

export const ExportDataItem = () => {
  const { t } = useTranslation();
  const [exporting, setExporting] = useState(false);

  const ExportIcon = useCallback((props: ListLRProps) => (
    <List.Icon {...props} icon="database-export-outline" />
  ), []);

  const requestStoragePermission = useCallback(async () => {
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
        {
          title: t('settings.data.export.permission.title'),
          message: t('settings.data.export.permission.message'),
          buttonNeutral: t('settings.data.export.permission.buttons.neutral'),
          buttonNegative: t('about.update.dialog.actions.cancel'),
          buttonPositive: t('drawer.account.logout.dialog.ok'),
        },
      );
      return granted === PermissionsAndroid.RESULTS.GRANTED;
    } catch {
      return false;
    }
  }, [t]);

  const exportData = useCallback(async () => {
    const hasPermission = PermissionsAndroid.check(
      PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE
    );
    if (!hasPermission) {
      const granted = await requestStoragePermission();
      if (!granted) {
        ToastAndroid.show(
          t('settings.data.export.permission.toast.denied'),
          ToastAndroid.LONG
        );
        return;
      }
    }

    setExporting(true);

    let localData = {};
    const destPath = encodeURI(
      `${RNFS.DownloadDirectoryPath}/${appName}_${uuid().slice(0, 8)}.json`
    );

    const writeData = async () => {
      try {
        const results = Object.values(storage.getAllKeys())
          .map((localDataName) => {
            const data = JSON.parse(
              storage.getString(localDataName) || ''
            );
            return { [localDataName]: data };
          });
        localData = Object.assign({}, ...results);

        await RNFS.writeFile(
          destPath,
          JSON.stringify(localData),
          'utf8'
        );

        ToastAndroid.show(
          t('settings.data.export.toast') + destPath,
          ToastAndroid.LONG
        );
      } catch (error: any) {
        ToastAndroid.show(error.message, ToastAndroid.LONG);
      } finally {
        setExporting(false);
      }
    };

    writeData();
  }, [requestStoragePermission, t]);

  return (
    <List.Item
      title={t('settings.data.export.title')}
      description={t('settings.data.export.description')}
      left={ExportIcon}
      disabled={exporting}
      onPress={exportData}
    />
  );
};
