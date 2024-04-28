import { useNavigation } from '@react-navigation/native';
import React, { useState } from 'react';
import { IconButton, Menu } from 'react-native-paper';
import { CommentsMenu, MvMenu } from '.';

export function TrackMenu(props: any) {
  const navigation = useNavigation();
  const [visible, setVisible] = useState(false);

  const openMenu = () => setVisible(true);
  const closeMenu = () => setVisible(false);

  return (
    <Menu
      visible={visible}
      onDismiss={closeMenu}
      anchor={
        <IconButton
          size={24}
          icon="dots-vertical-circle-outline"
          onPress={openMenu}
          {...props}
        />
      }>
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
