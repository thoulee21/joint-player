import { useNavigation } from '@react-navigation/native';
import React, { useCallback } from 'react';
import { List } from 'react-native-paper';
import { useAppSelector } from '../hook';
import { selectDevModeEnabled } from '../redux/slices';

export const DevItem = () => {
    const navigation = useNavigation();
    const isDev = useAppSelector(selectDevModeEnabled);

    const CodeTags = useCallback((props: any) => {
        return <List.Icon {...props} icon="code-tags" />;
    }, []);

    const ChevronRight = useCallback((props: any) => {
        return <List.Icon {...props} icon="chevron-right" />;
    }, []);

    if (isDev) {
        return (
            <List.Item
                title="Developer Options"
                description="Access developer settings."
                left={CodeTags}
                right={ChevronRight}
                onPress={() => {
                    navigation.navigate('Dev' as never);
                }}
            />
        );
    }
};