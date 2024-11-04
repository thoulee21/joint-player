import { useNavigation } from '@react-navigation/native';
import { useUpdates } from 'expo-updates';
import React, { useCallback, useEffect, useState } from 'react';
import { Snackbar } from 'react-native-paper';

export const UpdateSnackbar = () => {
    const navigation = useNavigation();
    const { isUpdatePending } = useUpdates();

    const [
        updateSnackbarVisible,
        setUpdateSnackbarVisible,
    ] = useState(false);

    const showSnackbar = useCallback(() =>
        setUpdateSnackbarVisible(true), []
    );

    const hideSnackbar = useCallback(() =>
        setUpdateSnackbarVisible(false), []
    );

    useEffect(() => {
        if (isUpdatePending) { showSnackbar(); }
    }, [isUpdatePending, showSnackbar]);

    return (
        <Snackbar
            visible={updateSnackbarVisible}
            icon="progress-download"
            onDismiss={hideSnackbar}
            action={{
                icon: 'arrow-right',
                label: 'Update',
                onPress: () => {
                    //@ts-expect-error
                    navigation.push('About');
                },
            }}
        >
            An update is pending...
        </Snackbar>
    );
};
