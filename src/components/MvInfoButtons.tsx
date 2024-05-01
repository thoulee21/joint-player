import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Button, useTheme } from 'react-native-paper';
import TrackPlayer, { useActiveTrack } from 'react-native-track-player';
import useSWR from 'swr';
import { Main as MvMain } from '../types/mv';

export const MvInfoButtons = ({ res }: { res: string | null }) => {
    const appTheme = useTheme();
    const track = useActiveTrack();

    const { data } = useSWR<MvMain>(
        `http://music.163.com/api/mv/detail?id=${track?.mvid}`
    );

    return (
        <View style={styles.row}>
            <Button
                icon="heart-outline"
                labelStyle={{ color: appTheme.colors.onSurface }}
            >
                {data?.data.likeCount.toLocaleString()} likes
            </Button>
            <Button
                icon="play-circle"
                onPress={() => {
                    TrackPlayer.pause();
                    // @ts-ignore
                    navigator.navigate('MvPlayer', { res: res });
                }}
            >
                {data?.data.playCount.toLocaleString()} plays
            </Button>
        </View>
    );
};

const styles = StyleSheet.create({
    row: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'flex-end',
        width: '100%'
    },
});
