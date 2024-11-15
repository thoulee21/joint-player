import { useNavigation } from '@react-navigation/native';
import React, { useCallback } from 'react';
import { Avatar, List } from 'react-native-paper';
import type { ListLRProps } from '../types/paperListItem';

export const AboutItem = () => {
    const navigation = useNavigation();

    const Info = useCallback((props: ListLRProps) => (
        <Avatar.Image
            {...props}
            size={24}
            source={require('../assets/images/logo.png')}
        />
    ), []);

    const ChevronRight = useCallback((props: any) => {
        return <List.Icon {...props} icon="chevron-right" />;
    }, []);

    return (
        <List.Item
            title="About"
            description="View app information"
            onPress={() => {
                navigation.navigate('About' as never);
            }}
            left={Info}
            right={ChevronRight}
        />
    );
};
