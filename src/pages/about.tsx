import { useNavigation } from '@react-navigation/native';
import React, { useCallback, useState } from 'react';
import { StyleSheet } from 'react-native';
import { Appbar, List, Portal, Snackbar } from 'react-native-paper';
import { ListWrapper } from '../components/ListWrapper';
import { AboutDialog } from '../components/AboutDialog';
import { BlurBackground } from '../components/BlurBackground';
import { VersionItem } from '../components/VersionItem';

export function AboutScreen() {
    const navigation = useNavigation();

    const [dialogVisible, setDialogVisible] = useState(false);
    const [devSnackbarVisible, setDevSnackbarVisible] = useState(false);

    const showDialog = () => setDialogVisible(true);
    const hideDialog = () => setDialogVisible(false);

    const GoDevSnackbar = useCallback(() => (
        <Snackbar
            visible={devSnackbarVisible}
            onDismiss={() => setDevSnackbarVisible(false)}
            action={{
                label: 'Go to Dev',
                //@ts-expect-error
                onPress: () => navigation.navigate('Dev'),
            }}
        >
            Developer options enabled!
        </Snackbar>
    ), [devSnackbarVisible, navigation]);

    return (
        <BlurBackground>
            <Portal.Host>
                <Appbar.Header mode="large" style={styles.header}>
                    <Appbar.BackAction onPress={navigation.goBack} />
                    <Appbar.Content title="About" />
                </Appbar.Header>

                <ListWrapper>
                    <List.Section>
                        <VersionItem
                            showDevSnackbar={() => {
                                setDevSnackbarVisible(true);
                            }}
                        />
                        <List.Item
                            title="About This App"
                            onPress={showDialog}
                        />
                    </List.Section>
                </ListWrapper>

                <AboutDialog
                    hideDialog={hideDialog}
                    visible={dialogVisible}
                />
                <Portal>
                    <GoDevSnackbar />
                </Portal>
            </Portal.Host >
        </BlurBackground>
    );
}

const styles = StyleSheet.create({
    header: {
        backgroundColor: 'transparent',
    },
});
