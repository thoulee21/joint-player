import React, { useCallback, useState } from 'react';
import HapticFeedback, { HapticFeedbackTypes } from 'react-native-haptic-feedback';
import { Button, Dialog, List, Portal, Text, useTheme } from 'react-native-paper';
import RNRestart from 'react-native-restart';
import { Storage } from '../utils';

export const ClearAllDataItem = () => {
  const appTheme = useTheme();

  const [visible, setVisible] = useState(false);
  const showDialog = useCallback(() => setVisible(true), []);
  const hideDialog = useCallback(() => setVisible(false), []);

  const DeleteForeverIcon = useCallback((props: any) => (
    <List.Icon {...props}
      icon="delete-forever-outline"
      color={appTheme.colors.error}
    />
  ), [appTheme.colors.error]);

  const clearAndRestart = useCallback(() => {
    Storage.clear();
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
          <Dialog.Title>Clear All Data</Dialog.Title>
          <Dialog.Content>
            <Text>
              Are you sure you want to clear all data?
            </Text>
          </Dialog.Content>
          <Dialog.Actions>
            <Button onPress={hideDialog}>
              Cancel
            </Button>
            <Button onPress={clearAndRestart}>
              OK
            </Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>
    </>
  );
};
