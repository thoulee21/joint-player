import { useNavigation } from '@react-navigation/native';
import React, { useCallback } from 'react';
import { List } from 'react-native-paper';

export const AboutItem = () => {
    const navigation = useNavigation();

    const Info = useCallback((props: any) => {
        return <List.Icon {...props} icon="information-outline" />;
    }, []);

    const ChevronRight = useCallback((props: any) => {
        return <List.Icon {...props} icon="chevron-right" />;
    }, []);

    return (
        <List.Item
            title="About"
            onPress={() => {
                navigation.navigate('About' as never);
            }}
            left={Info}
            right={ChevronRight}
        />
    );
};
