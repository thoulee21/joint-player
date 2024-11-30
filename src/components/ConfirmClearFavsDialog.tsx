import React from 'react';
import HapticFeedback, {
  HapticFeedbackTypes,
} from 'react-native-haptic-feedback';
import { Button, Dialog, Text, useTheme } from 'react-native-paper';
import { useAppDispatch } from '../hook/reduxHooks';
import { clearFavs } from '../redux/slices/favs';

export const ConfirmClearFavsDialog = ({ visible, hideDialog }: {
  visible: boolean;
  hideDialog: () => void;
}) => {
  const dispatch = useAppDispatch();
  const appTheme = useTheme();

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
      <Dialog.Icon
        icon="alert"
        color={appTheme.colors.error}
        size={40}
      />
      <Dialog.Title>Clear Favorites</Dialog.Title>
      <Dialog.Content>
        <Text>
          Are you sure you want to clear all favorites?
        </Text>
      </Dialog.Content>

      <Dialog.Actions>
        <Button
          textColor={appTheme.colors.outline}
          onPress={hideDialog}
        >
          Cancel
        </Button>
        <Button
          textColor={appTheme.colors.error}
          onPress={confirmClearFavorites}
        >
          OK
        </Button>
      </Dialog.Actions>
    </Dialog>
  );
};
