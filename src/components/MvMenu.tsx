import React from 'react';
import { Linking } from 'react-native';
import { Menu } from 'react-native-paper';
import TrackPlayer, { useActiveTrack } from 'react-native-track-player';
import useSWR from 'swr';

export function MvMenu({ onPostPressed }:
  { onPostPressed: () => void }
) {
  const track = useActiveTrack();

  const { data: mvData, isLoading, error } = useSWR(
    track ? `https://music.163.com/api/mv/detail?id=${track?.mvid}&type=mp4` : null,
  );

  const disabled =
    track?.mvid === 0
    || typeof track?.mvid === 'undefined'
    || isLoading || error;

  return (
    <Menu.Item
      title="Watch MV"
      leadingIcon="video-outline"
      trailingIcon={isLoading ? 'loading' : undefined}
      disabled={disabled}
      onPress={async () => {
        const highRes = Object.keys(mvData.data.brs).reverse()[0];
        const mv = mvData.data.brs[highRes];

        await Linking.openURL(mv as string);
        await TrackPlayer.pause();

        onPostPressed();
      }}
    />
  );
}
