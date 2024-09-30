import { useNavigation } from '@react-navigation/native';
import React from 'react';
import { List } from 'react-native-paper';

export const IssueReportItem = () => {
    const navigation = useNavigation();
    return (
        <List.Item
            title="Report Issue"
            left={(props) => <List.Icon {...props} icon="message-text-outline" />}
            right={(props) => <List.Icon {...props} icon="chevron-right" />}
            //@ts-expect-error
            onPress={() => navigation.push('IssueReport')}
            description="Report an issue or send feedback"
        />
    );
};
