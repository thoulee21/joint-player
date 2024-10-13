import React from 'react';
import { Button, Dialog, Text } from 'react-native-paper';
import packageData from '../../package.json';

const copyright = `Copyright©${new Date().getFullYear()} ${packageData.author.name
    }. All Rights Reserved.`;

export const AboutDialog = ({ visible, hideDialog }: {
    visible: boolean,
    hideDialog: () => void
}) => {
    return (
        <Dialog visible={visible} onDismiss={hideDialog}>
            <Dialog.Icon icon="information-outline" size={40} />
            <Dialog.Title>{packageData.displayName}</Dialog.Title>
            <Dialog.Content>
                <Text>{copyright}</Text>
            </Dialog.Content>

            <Dialog.Actions>
                <Button onPress={hideDialog}>Close</Button>
            </Dialog.Actions>
        </Dialog>
    );
};
