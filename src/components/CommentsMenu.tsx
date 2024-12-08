import React from 'react';
import { Menu } from 'react-native-paper';
import { useActiveTrack } from 'react-native-track-player';
import useSWR from 'swr';
import { Main as CommentsMain } from '../types/comments';
import { useMenuContext } from './TrackMenu';

export function CommentsMenu() {
  const track = useActiveTrack();
  const { onPostPressed, navigation } = useMenuContext();

  const { data } = useSWR<CommentsMain>(
    `http://music.163.com/api/v1/resource/comments/R_SO_4_${track?.id}`,
  );

  const disabled = typeof track?.id === 'undefined' || data?.total === 0;

  return (
    <Menu.Item
      title="Comments"
      leadingIcon="comment-text-multiple-outline"
      disabled={disabled}
      onPress={() => {
        // @ts-ignore
        navigation.push('Comments', {
          commentThreadId: `R_SO_4_${track?.id}`,
        });
        onPostPressed();
      }}
    />
  );
}
