import React from 'react';
import { Linking } from 'react-native';
import { Button, Dialog, Divider, IconButton, Text } from 'react-native-paper';
import packageData from '../../package.json';

const copyright = `Copyright©${new Date().getFullYear()} ${packageData.author.name
    }. All Rights Reserved.`;

export const AboutDialog = ({ visible, hideDialog }: {
    visible: boolean,
    hideDialog: () => void
}) => {
    const gotoHomepage = () => Linking.openURL(packageData.homepage);
    const mailto = () => Linking.openURL(`mailto:${packageData.author.email}`);

    return (
        <Dialog visible={visible} onDismiss={hideDialog}>
            <Dialog.Icon icon="information-outline" size={40} />
            <Dialog.Title>{packageData.displayName}</Dialog.Title>
            <Dialog.Content>
                <Text>{copyright}</Text>
            </Dialog.Content>

            <Divider />
            <Dialog.Actions>
                <Button icon="email-outline" onPress={mailto}>E-Mail</Button>
                <Button icon="github" onPress={gotoHomepage}>Homepage</Button>
                <IconButton icon="close" onPress={hideDialog} />
            </Dialog.Actions>
        </Dialog>
    );
};
