import { useNavigation } from '@react-navigation/native';
import React, { useState } from 'react';
import { IconButton, Menu } from 'react-native-paper';
import { useActiveTrack } from 'react-native-track-player';
import { MvMenu } from '.';

function CommentsMenu(
  { onPostPressed, navigation }:
    { onPostPressed: () => void, navigation: any }) {
  const track = useActiveTrack();

  return (
    <Menu.Item
      title="Comments"
      leadingIcon="comment-outline"
      disabled={typeof track?.id === 'undefined'}
      onPress={() => {
        // @ts-ignore
        navigation.navigate('Comments');
        onPostPressed();
      }}
    />
  );
}

export function TrackMenu() {
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
        />
      }>
      <MvMenu onPostPressed={closeMenu} />
      <CommentsMenu
        onPostPressed={closeMenu}
        navigation={navigation}
      />
    </Menu>
  );
}
