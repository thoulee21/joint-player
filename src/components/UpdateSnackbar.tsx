import { useNavigation } from '@react-navigation/native';
import { useUpdates } from 'expo-updates';
import React, { useEffect, useState } from 'react';
import { Snackbar } from 'react-native-paper';

export const UpdateSnackbar = () => {
    const navigation = useNavigation();
    const { isUpdatePending } = useUpdates();

    const [
        updateSnackbarVisible,
        setUpdateSnackbarVisible,
    ] = useState(false);

    useEffect(() => {
        if (isUpdatePending) {
            setUpdateSnackbarVisible(true);
        }
    }, [isUpdatePending]);

    return (
        <Snackbar
            visible={updateSnackbarVisible}
            icon="progress-download"
            onDismiss={() => {
                setUpdateSnackbarVisible(false);
            }}
            action={{
                icon: 'arrow-right',
                label: 'Update',
                onPress: () => {
                    //@ts-expect-error
                    navigation.push('About');
                    setUpdateSnackbarVisible(false);
                },
            }}
        >
            An update is pending...
        </Snackbar>
    );
};
