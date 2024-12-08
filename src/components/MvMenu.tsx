import React from 'react';
import { Menu } from 'react-native-paper';
import { useActiveTrack } from 'react-native-track-player';
import { useMenuContext } from './TrackMenu';

export function MvMenu() {
  const track = useActiveTrack();
  const { onPostPressed, navigation } = useMenuContext();

  const disabled =
    track?.mvid === 0
    || typeof track?.mvid === 'undefined';

  return (
    <Menu.Item
      title="Music Video"
      leadingIcon="video-outline"
      disabled={disabled}
      onPress={() => {
        navigation.navigate('MvDetail' as never);
        onPostPressed();
      }}
    />
  );
}
