import React from 'react';
import { List } from 'react-native-paper';
import useSWR from 'swr';
import { PlaylistItem } from '../components/SearchPlaylistItem';
import type { PlaylistType } from '../redux/slices/playlists';
import type { Main } from '../types/playlistDetail';
import type { Playlist } from '../types/searchPlaylist';

export const PlaylistDisplay = (props: {
  item: PlaylistType, index: number
}) => {
  const { playlistID } = props.item;

  const { data, isLoading, error, mutate } = useSWR<Main>(
    `https://music.163.com/api/playlist/detail?id=${playlistID}`,
    {
      revalidateIfStale: false,
      revalidateOnFocus: false,
      revalidateOnReconnect: false
    }
  );

  if (isLoading) { return null; }

  if (error || data?.code !== 200) {
    return (
      <List.Item
        title="Error"
        // @ts-expect-error
        description={error?.message || data?.msg}
        onPress={() => mutate()}
      />
    );
  }

  return (
    <PlaylistItem
      {...props}
      item={data.result as unknown as Playlist}
    />
  );
};
