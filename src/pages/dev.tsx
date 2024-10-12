import { useNavigation } from '@react-navigation/native';
import React, { useState } from 'react';
import { KeyboardAvoidingView, StyleSheet } from 'react-native';
import { Appbar, Divider, List, Portal, Snackbar, useTheme } from 'react-native-paper';
import RNRestart from 'react-native-restart';
import { BlurBackground } from '../components/BlurBackground';
import { ClearAllDataItem } from '../components/ClearAllDataItem';
import { DevSwitchItem } from '../components/DevSwitchItem';
import { ExportDataItem } from '../components/ExportDataItem';
import { ImportDataItem } from '../components/ImportDataItem';
import { ListWrapper } from '../components/ListWrapper';
import { RestartItem } from '../components/RestartItem';
import { ViewAppDataItem } from '../components/ViewAppDataItem';

export function DevScreen() {
    const navigation = useNavigation();
    const appTheme = useTheme();

    const [restartBarVisible, setRestartBarVisible] = useState(false);

    return (
        <BlurBackground>
            <Appbar.Header mode="large" style={styles.header}>
                <Appbar.BackAction onPress={navigation.goBack} />
                <Appbar.Content title="Developer Options" />
            </Appbar.Header>

            <KeyboardAvoidingView behavior="height">
                <ListWrapper bottomViewHeight={100}>
                    <DevSwitchItem />
                    <Divider />

                    <List.Section
                        title="Data Management"
                        titleStyle={{ color: appTheme.colors.secondary }}
                    >
                        <ViewAppDataItem />
                        <ExportDataItem />
                        <ImportDataItem
                            setRestartBarVisible={setRestartBarVisible}
                        />
                        <ClearAllDataItem />
                        <Divider />
                    </List.Section>

                    <RestartItem />
                </ListWrapper>
            </KeyboardAvoidingView>

            <Portal>
                <Snackbar
                    visible={restartBarVisible}
                    onDismiss={() => setRestartBarVisible(false)}
                    onIconPress={() => setRestartBarVisible(false)}
                    action={{
                        label: 'Restart',
                        onPress: () => RNRestart.Restart(),
                    }}
                >
                    Data imported successfully! Restart the app to apply changes.
                </Snackbar>
            </Portal>
        </BlurBackground>
    );
}

const styles = StyleSheet.create({
    header: {
        backgroundColor: 'transparent',
    },
});
