import { useNavigation } from '@react-navigation/native';
import React, { useCallback } from 'react';
import { StyleSheet } from 'react-native';
import { Appbar, Divider, List } from 'react-native-paper';
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

    const renderTestIcon = useCallback((props: ListLRProps) => (
        <List.Icon icon="test-tube" {...props} />
    ), []);

    const renderRightIcon = useCallback((props: ListLRProps) => (
        <List.Icon {...props} icon="chevron-right" />
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

                <ViewAppDataItem />
                <AniGalleryItem />
                <List.Item
                    title="Experimental Test"
                    description="This screen is for testing purposes"
                    left={renderTestIcon}
                    right={renderRightIcon}
                    onPress={() => {
                        navigation.navigate('Test' as never);
                    }}
                />

                <RestartItem />
                <ClearAllDataItem />
            </ListWrapper>
        </BlurBackground>
    );
}

const styles = StyleSheet.create({
    header: {
        backgroundColor: 'transparent',
    },
});
