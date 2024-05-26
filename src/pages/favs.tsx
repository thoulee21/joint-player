import { useNavigation } from '@react-navigation/native';
import React, { useState } from 'react';
import { StyleSheet } from 'react-native';
import HapticFeedback, {
    HapticFeedbackTypes
} from 'react-native-haptic-feedback';
import { Appbar, Button, Dialog, Text } from 'react-native-paper';
import { BlurBackground, FavsList } from '../components';
import { useAppDispatch, useAppSelector } from '../hook';
import { clearFavs, favs } from '../redux/slices';

const ConfirmClearFavsDialog = ({ visible, hideDialog }: {
    visible: boolean;
    hideDialog: () => void;
}) => {
    const dispatch = useAppDispatch();

    const confirmClearFavorites = () => {
        HapticFeedback.trigger(
            HapticFeedbackTypes.effectTick
        );
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
                <Button onPress={hideDialog}>Cancel</Button>
                <Button onPress={confirmClearFavorites}>
                    OK
                </Button>
            </Dialog.Actions>
        </Dialog>
    );
};

export function Favs() {
    const navigation = useNavigation();
    const favsValue = useAppSelector(favs);
    const [dialogVisible, setDialogVisible] = useState(false);

    return (
        <BlurBackground>
            <Appbar.Header style={styles.appbar}>
                <Appbar.Action
                    icon="menu"
                    onPress={() => {
                        HapticFeedback.trigger(
                            HapticFeedbackTypes.effectHeavyClick
                        );
                        // @ts-expect-error
                        navigation.openDrawer();
                    }}
                />
                <Appbar.Content title="Favorites" />
                <Appbar.Action
                    icon="delete-forever-outline"
                    disabled={favsValue.length === 0}
                    onPress={() => {
                        HapticFeedback.trigger(
                            HapticFeedbackTypes.notificationWarning
                        );
                        setDialogVisible(true);
                    }}
                />
            </Appbar.Header>

            <FavsList />
            <ConfirmClearFavsDialog
                visible={dialogVisible}
                hideDialog={() => setDialogVisible(false)}
            />
        </BlurBackground>
    );
}

const styles = StyleSheet.create({
    appbar: {
        backgroundColor: 'transparent'
    },
    loading: {
        marginTop: '50%',
    }
});
