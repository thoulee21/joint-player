import React, { useState } from 'react';
import Color from 'color';
import { Chip, Dialog, Button, Portal, Text, useTheme } from 'react-native-paper';
import HapticFeedback, { HapticFeedbackTypes } from 'react-native-haptic-feedback';
import { useAppDispatch } from '../hook';
import { removeSearchHistory } from '../redux/slices';
import { StyleSheet } from 'react-native';

export const HistoryItem = ({
  item, setKeyword, onPressHistory
}: {
  item: string,
  setKeyword: (keyword: string) => void,
  onPressHistory: () => void
}) => {
  const dispatch = useAppDispatch();
  const appTheme = useTheme();

  const [
    dialogVisible,
    setDialogVisible,
  ] = useState(false);

  return (
    <React.Fragment>
      <Chip
        compact
        mode="outlined"
        style={[styles.chip, {
          backgroundColor:
            Color(appTheme.colors.surface)
              .fade(0.4).toString(),
        }]}
        onPress={() => {
          HapticFeedback.trigger(
            HapticFeedbackTypes.effectHeavyClick
          );
          setKeyword(item);
          onPressHistory();
        }}
        onLongPress={() => {
          HapticFeedback.trigger(
            HapticFeedbackTypes.effectDoubleClick
          );
          setDialogVisible(true);
        }}
      >{item}</Chip>

      <Portal>
        <Dialog
          visible={dialogVisible}
          onDismiss={() => setDialogVisible(false)}
        >
          <Dialog.Title>Clear Search History</Dialog.Title>
          <Dialog.Content>
            <Text>
              Do you want to clear this search history?
            </Text>
          </Dialog.Content>

          <Dialog.Actions>
            <Button
              textColor={appTheme.colors.outline}
              onPress={() => setDialogVisible(false)}
            >Cancel</Button>
            <Button
              onPress={() => {
                setDialogVisible(false);
                dispatch(
                  removeSearchHistory(item)
                );
              }}
            >OK</Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>
    </React.Fragment>
  );
};

const styles = StyleSheet.create({
  chip: {
    margin: 3,
  },
});
