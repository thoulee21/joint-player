import { useNavigation } from '@react-navigation/native';
import React, { useCallback } from 'react';
import { List } from 'react-native-paper';

export const IssueReportItem = () => {
    const navigation = useNavigation();

    const IssueReportIcon = useCallback((props: any) => {
        return <List.Icon {...props} icon="message-text-outline" />;
    }, []);

    const ChevronRight = useCallback((props: any) => {
        return <List.Icon {...props} icon="chevron-right" />;
    }, []);

    return (
        <List.Item
            title="Report Issue"
            left={IssueReportIcon}
            right={ChevronRight}
            onPress={() => {
                //@ts-expect-error
                navigation.push('IssueReport');
            }}
        />
    );
};
