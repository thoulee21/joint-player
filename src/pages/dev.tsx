import { useNavigation } from '@react-navigation/native';
import React, { useCallback } from 'react';
import { StyleSheet } from 'react-native';
import { Appbar, Divider, List, useTheme } from 'react-native-paper';
import { AniGalleryItem } from '../components/AniGalleryItem';
import { BlurBackground } from '../components/BlurBackground';
import { ClearAllDataItem } from '../components/ClearAllDataItem';
import { DevSwitchItem } from '../components/DevSwitchItem';
import { ListWrapper } from '../components/ListWrapper';
import { RestartItem } from '../components/RestartItem';
import { ViewAppDataItem } from '../components/ViewAppDataItem';
import type { ListLRProps } from '../types/paperListItem';

export function DevScreen() {
    const navigation = useNavigation();
    const appTheme = useTheme();

    const renderTestIcon = useCallback((props: ListLRProps) => (
        <List.Icon icon="test-tube" {...props} />
    ), []);

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

                <List.Item
                    left={renderTestIcon}
                    title="Test"
                    onPress={() => {
                        navigation.navigate('Test' as never);
                    }}
                />
                <AniGalleryItem />
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
