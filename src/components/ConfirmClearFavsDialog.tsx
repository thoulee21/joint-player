import React from 'react';
import HapticFeedback, { HapticFeedbackTypes } from 'react-native-haptic-feedback';
import { Button, Dialog, Text } from 'react-native-paper';
import { useAppDispatch } from '../hook/reduxHooks';
import { clearFavs } from '../redux/slices/favs';

export const ConfirmClearFavsDialog = ({ visible, hideDialog }: {
    visible: boolean;
    hideDialog: () => void;
}) => {
    const dispatch = useAppDispatch();

    const confirmClearFavorites = () => {
        HapticFeedback.trigger(HapticFeedbackTypes.effectTick);

        hideDialog();
        dispatch(clearFavs());
    };

    return (
        <Dialog
            visible={visible}
            onDismiss={hideDialog}
            dismissable={false}
            dismissableBackButton
        >
            <Dialog.Icon icon="alert" size={40} />
            <Dialog.Title>Clear Favorites</Dialog.Title>
            <Dialog.Content>
                <Text>
                    Are you sure you want to clear all favorites?
                </Text>
            </Dialog.Content>

            <Dialog.Actions>
                <Button onPress={hideDialog}>
                    Cancel
                </Button>
                <Button onPress={confirmClearFavorites}>
                    OK
                </Button>
            </Dialog.Actions>
        </Dialog>
    );
};
