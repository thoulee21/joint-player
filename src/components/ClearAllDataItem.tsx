import React, { useCallback, useState } from "react";
import HapticFeedback, {
  HapticFeedbackTypes,
} from "react-native-haptic-feedback";
import {
  Button,
  Dialog,
  List,
  Portal,
  Text,
  useTheme,
} from "react-native-paper";
import RNRestart from "react-native-restart";
import { storage } from "../utils/reduxPersistMMKV";

export const ClearAllDataItem = () => {
  const appTheme = useTheme();

  const [visible, setVisible] = useState(false);
  const showDialog = useCallback(() => setVisible(true), []);
  const hideDialog = useCallback(() => setVisible(false), []);

  const DeleteForeverIcon = useCallback(
    (props: any) => (
      <List.Icon
        {...props}
        icon="delete-forever-outline"
        color={appTheme.colors.error}
      />
    ),
    [appTheme.colors.error],
  );

  const clearAndRestart = useCallback(() => {
    storage.clearAll();
    RNRestart.Restart();
  }, []);

  const clearAllData = useCallback(async () => {
    HapticFeedback.trigger(HapticFeedbackTypes.notificationWarning);
    showDialog();
  }, [showDialog]);

  return (
    <>
      <List.Item
        title="Clear All Data"
        description="Clear all data and restart the app"
        left={DeleteForeverIcon}
        onPress={clearAllData}
      />

      <Portal>
        <Dialog visible={visible} onDismiss={hideDialog}>
          <Dialog.Icon icon="alert" color={appTheme.colors.error} size={40} />
          <Dialog.Title>Clear All Data</Dialog.Title>
          <Dialog.Content>
            <Text>Are you sure you want to clear all data?</Text>
          </Dialog.Content>

          <Dialog.Actions>
            <Button textColor={appTheme.colors.outline} onPress={hideDialog}>
              Cancel
            </Button>
            <Button textColor={appTheme.colors.error} onPress={clearAndRestart}>
              OK
            </Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>
    </>
  );
};
