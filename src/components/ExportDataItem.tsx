import React, { useCallback, useState } from 'react';
import { PermissionsAndroid, ToastAndroid } from 'react-native';
import RNFS from 'react-native-fs';
import { List } from 'react-native-paper';
import { v4 as uuid } from 'uuid';
import { name as appName } from '../../package.json';
import { StorageKeys } from '../App';
import { Storage } from '../utils';

export const ExportDataItem = () => {
    const [exporting, setExporting] = useState(false);

    const ExportIcon = useCallback((props: any) => (
        <List.Icon {...props} icon="export-variant" />
    ), []);

    const requestStoragePermission = useCallback(async () => {
        try {
            const granted = await PermissionsAndroid.request(
                PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
                {
                    title: 'Storage Permission Required',
                    message: 'This app needs access to your storage to export data.',
                    buttonNeutral: 'Ask Me Later',
                    buttonNegative: 'Cancel',
                    buttonPositive: 'OK',
                },
            );
            return granted === PermissionsAndroid.RESULTS.GRANTED;
        } catch (err) {
            return false;
        }
    }, []);

    const exportData = useCallback(async () => {
        const hasPermission = PermissionsAndroid.check(
            PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE
        );
        if (!hasPermission) {
            const granted = await requestStoragePermission();
            if (!granted) {
                ToastAndroid.show('Storage permission denied.', ToastAndroid.LONG);
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
                const promises = Object.values(StorageKeys).map(async (localDataName) => {
                    const data = await Storage.get(localDataName);
                    return { [localDataName]: data };
                });
                const results = await Promise.all(promises);
                localData = Object.assign({}, ...results);
                await RNFS.writeFile(destPath, JSON.stringify(localData), 'utf8');

                ToastAndroid.show(`Exported to：${destPath}`, ToastAndroid.LONG);
            } catch (error: any) {
                ToastAndroid.show(error.message, ToastAndroid.LONG);
            } finally {
                setExporting(false);
            }
        };

        writeData();
    }, [requestStoragePermission]);

    return (
        <List.Item
            title="Export Data"
            description="Export app data to JSON file"
            left={ExportIcon}
            disabled={exporting}
            onPress={exportData}
        />
    );
};
