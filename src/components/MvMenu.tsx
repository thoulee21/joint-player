import React, { useEffect, useState } from 'react';
import { Linking } from 'react-native';
import { Menu } from 'react-native-paper';
import TrackPlayer, { useActiveTrack } from 'react-native-track-player';
import useSWR from 'swr';

export function MvMenu({ onPostPressed }:
  { onPostPressed: () => void }
) {
  const track = useActiveTrack();
  const [disabled, setDisabled] = useState(true);

  const { data: mvData, isLoading, error } = useSWR(
    track ? `https://music.163.com/api/mv/detail?id=${track?.mvid}&type=mp4` : null,
  );

  useEffect(() => {
    if (track && track?.mvid) {
      setDisabled(track?.mvid === 0);
    } else {
      setDisabled(true);
    }
  }, [track]);

  return (
    <Menu.Item
      title="Watch MV"
      leadingIcon="video-outline"
      trailingIcon={isLoading ? 'loading' : undefined}
      disabled={disabled || isLoading || error}
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
