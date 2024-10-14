import React, { useCallback } from 'react';
import { Linking } from 'react-native';
import { List, useTheme } from 'react-native-paper';
import packageData from '../../package.json';

export const ContactMe = () => {
    const appTheme = useTheme();

    const OpenIcon = useCallback((props: any) => (
        <List.Icon {...props} icon="open-in-new" />
    ), []);

    const EmailIcon = useCallback((props: any) => (
        <List.Icon {...props} icon="email-outline" />
    ), []);

    const GithubIcon = useCallback((props: any) => (
        <List.Icon {...props} icon="github" />
    ), []);

    return (
        <List.Section
            title="Contact the Developer"
            titleStyle={{ color: appTheme.colors.secondary }}
        >
            <List.Item
                title="E-Mail"
                description={packageData.author.email}
                onPress={() => {
                    Linking.openURL(`mailto:${packageData.author.email}`);
                }}
                left={EmailIcon}
                right={OpenIcon}
            />
            <List.Item
                title="Homepage"
                description={packageData.homepage}
                onPress={() => Linking.openURL(packageData.homepage)}
                left={GithubIcon}
                right={OpenIcon}
            />
        </List.Section>
    );
};
