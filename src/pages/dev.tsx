import { useNavigation } from '@react-navigation/native';
import React from 'react';
import { StyleSheet } from 'react-native';
import { Appbar, Divider, List, useTheme } from 'react-native-paper';
import { BlurBackground } from '../components/BlurBackground';
import { ClearAllDataItem } from '../components/ClearAllDataItem';
import { DevSwitchItem } from '../components/DevSwitchItem';
import { ListWrapper } from '../components/ListWrapper';
import { RestartItem } from '../components/RestartItem';
import { ViewAppDataItem } from '../components/ViewAppDataItem';

export function DevScreen() {
    const navigation = useNavigation();
    const appTheme = useTheme();

    return (
        <BlurBackground>
            <Appbar.Header mode="large" style={styles.header}>
                <Appbar.BackAction onPress={navigation.goBack} />
                <Appbar.Content title="Developer Options" />
            </Appbar.Header>

            <ListWrapper bottomViewHeight={100}>
                <DevSwitchItem />
                <Divider />

                <List.Section
                    title="Data Management"
                    titleStyle={{
                        color: appTheme.colors.secondary,
                    }}
                >
                    <ViewAppDataItem />
                    <ClearAllDataItem />
                    <Divider />
                </List.Section>

                <RestartItem />
            </ListWrapper>
        </BlurBackground>
    );
}

const styles = StyleSheet.create({
    header: {
        backgroundColor: 'transparent',
    },
});
