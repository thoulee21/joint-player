import { useNavigation } from '@react-navigation/native';
import React, { useState } from 'react';
import { StatusBar } from 'react-native';
import HapticFeedback, {
  HapticFeedbackTypes,
} from 'react-native-haptic-feedback';
import { IconButton, Menu } from 'react-native-paper';
import { CommentsMenu } from './CommentsMenu';
import { MvMenu } from './MvMenu';

export function TrackMenu(props: any) {
  const navigation = useNavigation();

  const [visible, setVisible] = useState(false);
  const openMenu = () => setVisible(true);
  const closeMenu = () => setVisible(false);

  return (
    <Menu
      visible={visible}
      elevation={1}
      onDismiss={closeMenu}
      statusBarHeight={StatusBar.currentHeight}
      anchor={
        <IconButton
          {...props}
          size={24}
          icon="dots-vertical"
          onPress={() => {
            HapticFeedback.trigger(
              HapticFeedbackTypes.effectHeavyClick
            );
            openMenu();
          }}
        />
      }
    >
      <MvMenu
        onPostPressed={closeMenu}
        navigation={navigation}
      />
      <CommentsMenu
        onPostPressed={closeMenu}
        navigation={navigation}
      />
    </Menu>
  );
}
