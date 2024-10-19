import { useNavigation } from '@react-navigation/native';
import React from 'react';
import { IconButton } from 'react-native-paper';
import { useActiveTrack } from 'react-native-track-player';
import useSWR from 'swr';
import { Main } from '../types/comments';

export const CommentsButton = () => {
    const navigation = useNavigation();
    const track = useActiveTrack();

    const { data } = useSWR<Main>(
        `http://music.163.com/api/v1/resource/comments/R_SO_4_${track?.id}`,
    );
    const disabled = typeof track?.id === 'undefined' || data?.total === 0;

    return (
        <IconButton
            icon="comment-text-multiple-outline"
            disabled={disabled}
            onPress={() => {
                // @ts-ignore
                navigation.push('Comments', {
                    commentThreadId: `R_SO_4_${track?.id}`,
                });
            }}
        />
    );
};
