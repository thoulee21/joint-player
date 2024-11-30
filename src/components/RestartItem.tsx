import React, { useCallback, useState } from 'react';
import { Button, Dialog, List, Portal, Text, useTheme } from 'react-native-paper';
import RNRestart from 'react-native-restart';
import type { ListLRProps } from '../types/paperListItem';
import HapticFeedback, { HapticFeedbackTypes } from 'react-native-haptic-feedback';

export const RestartItem = () => {
  const appTheme = useTheme();

  const [
    dialogVisible,
    setDialogVisible
  ] = useState(false);

  const renderRestartIcon = useCallback((
    props: ListLRProps
  ) => (
    <List.Icon {...props} icon="restart" />
  ), []);

  return (
    <>
      <List.Item
        title="Restart App"
        description="Restart the app to apply changes"
        left={renderRestartIcon}
        onPress={() => {
          HapticFeedback.trigger(
            HapticFeedbackTypes.notificationWarning
          );
          setDialogVisible(true);
        }}
      />
      <Portal>
        <Dialog
          visible={dialogVisible}
          onDismiss={() => setDialogVisible(false)}
        >
          <Dialog.Icon icon="alert" size={40} />
          <Dialog.Title>Restart App</Dialog.Title>
          <Dialog.Content>
            <Text>Are you sure you want to restart the app?</Text>
          </Dialog.Content>
          <Dialog.Actions>
            <Button
              textColor={appTheme.colors.outline}
              onPress={() => setDialogVisible(false)}
            >Cancel</Button>
            <Button
              textColor={appTheme.colors.error}
              onPress={() => RNRestart.Restart()}
            >OK</Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>
    </>
  );
};
