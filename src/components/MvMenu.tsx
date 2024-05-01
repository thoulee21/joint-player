import React from 'react';
import { Menu } from 'react-native-paper';
import TrackPlayer, { useActiveTrack } from 'react-native-track-player';

export function MvMenu({ onPostPressed, navigation }:
  { onPostPressed: () => void, navigation: any }
) {
  const track = useActiveTrack();

  const disabled =
    track?.mvid === 0
    || typeof track?.mvid === 'undefined';

  return (
    <Menu.Item
      title="Watch MV"
      leadingIcon="video-outline"
      disabled={disabled}
      onPress={async () => {
        navigation.navigate('MvDetail');

        await TrackPlayer.pause();
        onPostPressed();
      }}
    />
  );
}
