import React, { useState } from 'react';
import { StatusBar } from 'react-native';
import { IconButton, Menu } from 'react-native-paper';
import { MvButton } from './MvButton';

export function TrackMenu() {
  const [visible, setVisible] = useState(false);

  const openMenu = () => setVisible(true);
  const closeMenu = () => setVisible(false);

  return (
    <Menu
      visible={visible}
      onDismiss={closeMenu}
      statusBarHeight={StatusBar.currentHeight}
      anchor={
        <IconButton
          size={24}
          icon="dots-vertical-circle-outline"
          onPress={openMenu}
        />
      }>
      <MvButton onPostPressed={closeMenu} />
    </Menu>
  );
}
