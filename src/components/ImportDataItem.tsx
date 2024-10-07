import React, { useCallback } from 'react';
import { ToastAndroid } from 'react-native';
import {
    types as documentTypes,
    isCancel,
    isInProgress,
    pickSingle,
} from 'react-native-document-picker';
import RNFS from 'react-native-fs';
import HapticFeedback from 'react-native-haptic-feedback';
import { List } from 'react-native-paper';
import { Storage } from '../utils';

export const ImportDataItem = ({ setRestartBarVisible }: {
    setRestartBarVisible: (visible: boolean) => void
}) => {
    const ImportIcon = useCallback((props: any) => (
        <List.Icon {...props} icon="import" />
    ), []);

    const importData = useCallback(async (path: string) => {
        try {
            const dataFromFile = await RNFS.readFile(path, 'utf8');
            const localData = JSON.parse(dataFromFile);

            await Promise.all(Object.keys(localData).map(async (localDataName) => {
                await Storage.set(localDataName, localData[localDataName]);
            }));

            HapticFeedback.trigger('effectTick');
            setRestartBarVisible(true);
        } catch (error) {
            ToastAndroid.show(
                `Import failed: ${JSON.stringify(error, null, 2)}`,
                ToastAndroid.LONG
            );
        }
    }, [setRestartBarVisible]);

    const openPicker = useCallback(async () => {
        try {
            const res = await pickSingle({
                type: [documentTypes.allFiles],
            });
            importData(res.uri);
        } catch (err) {
            if (isCancel(err)) {
                // Handle cancellation
            } else if (isInProgress(err)) {
                // Handle in progress
            } else {
                ToastAndroid.show(
                    `Can not read file: ${JSON.stringify(err)}`,
                    ToastAndroid.LONG
                );
            }
        }
    }, [importData]);

    return (
        <List.Item
            title="Import Data"
            description="Import data from a JSON file"
            left={ImportIcon}
            onPress={openPicker}
        />
    );
};
