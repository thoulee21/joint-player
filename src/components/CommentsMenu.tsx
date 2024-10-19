import React from 'react';
import { Menu } from 'react-native-paper';
import { useActiveTrack } from 'react-native-track-player';
import useSWR from 'swr';
import { Main as CommentsMain } from '../types/comments';

export function CommentsMenu({ onPostPressed, navigation }:
    { onPostPressed: () => void, navigation: any }
) {
    const track = useActiveTrack();
    const { data } = useSWR<CommentsMain>(
        `http://music.163.com/api/v1/resource/comments/R_SO_4_${track?.id}`,
    );

    const disabled = typeof track?.id === 'undefined' || data?.total === 0;

    return (
        <Menu.Item
            title="Comments"
            leadingIcon="comment-outline"
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
