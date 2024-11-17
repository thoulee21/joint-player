import React, { type ReactNode } from 'react';
import { StyleSheet, View } from 'react-native';
import HapticFeedback, { HapticFeedbackTypes } from 'react-native-haptic-feedback';
import { Button, Caption, List, useTheme } from 'react-native-paper';

export const TracksHeader = ({
  onPress, length, right
}: {
  onPress: () => void;
  length: number;
  right?: ReactNode
}) => {
  const appTheme = useTheme();
  return (
    <View
      style={[styles.songsHeader, styles.row, {
        backgroundColor: appTheme.colors.surface,
        borderTopLeftRadius: appTheme.roundness * 5,
        borderTopRightRadius: appTheme.roundness * 5,
      }]}
    >
      <View style={styles.row}>
        <Button
          compact
          icon="play-circle"
          onPress={() => {
            HapticFeedback.trigger(
              HapticFeedbackTypes.effectHeavyClick
            );
            onPress();
          }}
        >
          Play All
        </Button>

        <List.Subheader>
          <Caption>
            {length} song(s)
          </Caption>
        </List.Subheader>
      </View>

      {right}
    </View>
  );
};

const styles = StyleSheet.create({
  songsHeader: {
    paddingHorizontal: '2%',
    marginTop: '2%',
    justifyContent: 'space-between',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  }
});
