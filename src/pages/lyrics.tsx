import React from 'react';
import { StatusBar, StyleSheet } from 'react-native';
import HapticFeedback, {
    HapticFeedbackTypes
} from 'react-native-haptic-feedback';
import {
    ActivityIndicator,
    List,
    Text,
    useTheme,
} from 'react-native-paper';
import TrackPlayer, {
    useActiveTrack,
    useProgress,
} from 'react-native-track-player';
import useSWR from 'swr';
import {
    BlurBackground,
    Lyric,
    TrackInfoBar,
    TrackMenu
} from '../components';
import { LyricLine } from '../components/Lyric/lyric';
import { Main as LyricMain } from '../types/lyrics';

export const lyricTimeOffset = 1003;

const LyricView = ({ lrc, currentTime }:
    { lrc: string, currentTime: number }
) => {
    const appTheme = useTheme();

    const lineRenderer = ({ lrcLine: lyricLine, active }:
        { lrcLine: LyricLine, active: boolean }
    ) => {
        const lineColor =
            active
                ? appTheme.colors.onSurface
                : appTheme.dark
                    ? appTheme.colors.onSurfaceDisabled
                    : appTheme.colors.backdrop;

        return (
            <Text
                variant="displaySmall"
                numberOfLines={10}
                style={[
                    styles.lyricText,
                    { color: lineColor },
                ]}
                onPress={() => {
                    HapticFeedback.trigger(
                        HapticFeedbackTypes.effectHeavyClick
                    );
                    TrackPlayer.seekTo(
                        lyricLine.millisecond / lyricTimeOffset
                    );
                }}
            >
                {lyricLine.content}
            </Text>
        );
    };

    return (
        <Lyric
            style={styles.lyricView}
            lrc={lrc}
            currentTime={currentTime}
            lineRenderer={lineRenderer}
        />
    );
};

export function LyricsScreen() {
    const appTheme = useTheme();
    const track = useActiveTrack();
    const { position } = useProgress();

    const { data: lyric, error, isLoading } = useSWR<LyricMain>(
        `https://music.163.com/api/song/lyric?id=${track?.id}&lv=1&kv=1&tv=-1`
    );

    return (
        <BlurBackground style={styles.blurView}>
            <TrackInfoBar style={styles.infoBar} right={TrackMenu} />
            {isLoading ?
                <ActivityIndicator
                    size="large"
                    style={styles.loading}
                />
                : (lyric?.lrc.lyric && !error) ?
                    <LyricView
                        lrc={lyric.lrc.lyric}
                        currentTime={position * lyricTimeOffset}
                    />
                    : <List.Item
                        title={error
                            ? 'Failed to load lyrics'
                            : 'No lyrics found'}
                        titleStyle={[
                            styles.center, styles.notFoundTitle,
                        ]}
                        description={error?.message}
                        descriptionStyle={[styles.center, {
                            color: appTheme.colors.error,
                        }]}
                    />}
        </BlurBackground>
    );
}

const styles = StyleSheet.create({
    blurView: {
        paddingHorizontal: '5%',
    },
    infoBar: {
        paddingTop: StatusBar.currentHeight,
        marginVertical: '5%',
    },
    lyricText: {
        fontWeight: 'bold',
        paddingBottom: '5%',
    },
    lyricView: {
        paddingHorizontal: '3.5%',
    },
    loading: {
        marginTop: '20%',
    },
    center: {
        textAlign: 'center',
    },
    notFoundTitle: {
        marginTop: '10%',
        fontSize: 25,
        fontWeight: 'bold',
    },
});
