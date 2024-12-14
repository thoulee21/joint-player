import Clipboard from '@react-native-clipboard/clipboard';
import React, { useState } from 'react';
import { Share, ToastAndroid } from 'react-native';
import HapticFeedback, {
  HapticFeedbackTypes,
} from 'react-native-haptic-feedback';
import { IconButton, Menu } from 'react-native-paper';
import type {
  Style,
} from 'react-native-paper/lib/typescript/components/List/utils';

export const MoreBtn = ({
  data, color, style
}: {
  data: string, color: string, style?: Style
}) => {
  const [
    menuVisible,
    setMenuVisible,
  ] = useState(false);

  const onPostPressed = () => {
    HapticFeedback.trigger(
      HapticFeedbackTypes.effectTick
    );
    setMenuVisible(false);
  };

  return (
    <Menu
      statusBarHeight={-60}
      anchor={
        <IconButton
          icon="dots-vertical"
          iconColor={color}
          style={style}
          onPress={() => {
            HapticFeedback.trigger(
              HapticFeedbackTypes.effectHeavyClick
            );
            setMenuVisible(true);
          }}
        />}
      visible={menuVisible}
      onDismiss={() => setMenuVisible(false)}
    >
      <Menu.Item
        leadingIcon="clipboard-outline"
        title="Copy"
        onPress={() => {
          Clipboard.setString(data);
          ToastAndroid.show(
            'Copied to clipboard',
            ToastAndroid.SHORT
          );
          onPostPressed();
        }}
      />
      <Menu.Item
        leadingIcon="share-outline"
        title="Share"
        disabled={typeof data === 'undefined' || data === ''}
        onPress={() => {
          Share.share({ message: data });
          onPostPressed();
        }}
      />
    </Menu>
  );
};
