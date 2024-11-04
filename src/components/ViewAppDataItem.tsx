import { useNavigation } from '@react-navigation/native';
import React, { useCallback } from 'react';
import { List } from 'react-native-paper';

export const ViewAppDataItem = () => {
    const navigation = useNavigation();

    const renderDataBaseIcon = useCallback((props: any) => (
        <List.Icon {...props} icon="database-cog-outline" />
    ), []);

    const renderChevronRightIcon = useCallback((props: any) => (
        <List.Icon {...props} icon="chevron-right" />
    ), []);

    return (
        <List.Item
            title="View App Data"
            description="View the data that related to the app"
            left={renderDataBaseIcon}
            right={renderChevronRightIcon}
            onPress={() => {
                //@ts-expect-error
                navigation.push('AppData');
            }}
        />
    );
};
