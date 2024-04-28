import { useAnimations } from '@react-native-media-console/reanimated';
import { useNavigation } from '@react-navigation/native';
import { OrientationLock, lockAsync } from 'expo-screen-orientation';
import React, { useEffect } from 'react';
import { StatusBar, StyleSheet } from 'react-native';
import VideoPlayer from 'react-native-media-console';
import { useActiveTrack } from 'react-native-track-player';
import useSWR from 'swr';
import { Main as MvMain } from '../types/mv';

export const MvPlayer = () => {
    const navigator = useNavigation();
    const track = useActiveTrack();

    const { data } = useSWR<MvMain>(
        `http://music.163.com/api/mv/detail?id=${track?.mvid}`
    );
    const highestRes = data?.data.brs
        ? Object.keys(data.data.brs).reverse()[0]
        : '240';
    const mvLink = data?.data.brs
        ? data.data.brs[highestRes as keyof typeof data.data.brs]
        : 'https://vjs.zencdn.net/v/oceans.mp4';

    useEffect(() => {
        lockAsync(OrientationLock.LANDSCAPE);
        StatusBar.setHidden(true);

        return () => {
            lockAsync(OrientationLock.PORTRAIT);
            StatusBar.setHidden(false);
        };
    }, []);

    return (
        <VideoPlayer
            containerStyle={styles.root}
            useAnimations={useAnimations}
            source={{ uri: mvLink }}
            isFullscreen
            disableFullscreen
            disableVolume
            showDuration
            navigator={navigator}
            showOnEnd
            title={data?.data.name || 'MV'}
        />
    );
};

const styles = StyleSheet.create({
    root: {
        flex: 1,
    },
});
