import React from 'react';
import { Button, Dialog, Text } from 'react-native-paper';
import { author, displayName } from '../../package.json';

const date = new Date();
const copyright = `Copyright©${date.getFullYear()} ${author.name}.`;

export const AboutDialog = ({ visible, hideDialog }: {
    visible: boolean,
    hideDialog: () => void
}) => {
    return (
        <Dialog visible={visible} onDismiss={hideDialog}>
            <Dialog.Icon icon="information-outline" size={40} />
            <Dialog.Title>{displayName}</Dialog.Title>
            <Dialog.Content>
                <Text selectable>
                    {copyright
                        .concat(' All Rights Reserved.')}
                </Text>
            </Dialog.Content>

            <Dialog.Actions>
                <Button onPress={hideDialog}>Close</Button>
            </Dialog.Actions>
        </Dialog>
    );
};
