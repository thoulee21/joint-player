import React, { useEffect, useState } from 'react';
import { SafeAreaView, StyleSheet } from 'react-native';
import { Lyric } from 'react-native-lyric';
import {
    ActivityIndicator,
    Text,
    useTheme
} from 'react-native-paper';
import { useActiveTrack, useProgress } from 'react-native-track-player';
import { TrackInfoBar } from '../components';
import { requestInit } from '../services';
import { Main } from '../types/lyrics';

const LyricView = ({ lrc, currentTime }:
    { lrc: string, currentTime: number }
) => {
    const appTheme = useTheme();

    const lineRenderer = ({ lrcLine: { content }, active }:
        { lrcLine: { content: string }, active: boolean }
    ) => {
        return (
            <Text
                variant="displayMedium"
                numberOfLines={2}
                style={[
                    styles.lyricText,
                    {
                        color: active
                            ? appTheme.colors.primary
                            : appTheme.colors.outlineVariant,
                    }
                ]}
            >
                {content}
            </Text>
        )
    };

    return (
        <Lyric
            style={styles.lyricView}
            lrc={lrc}
            currentTime={currentTime}
            lineHeight={120}
            lineRenderer={lineRenderer}
            autoScroll
            autoScrollAfterUserScroll={500}
        />
    );
};

export function LyricsScreen() {
    const track = useActiveTrack();
    const { position } = useProgress();

    const [lyric, setLyric] = useState<Main | null>(null);

    useEffect(() => {
        const getLyric = async () => {
            const data = await fetch(
                `https://music.163.com/api/song/lyric?id=${track?.id}&lv=1&kv=1&tv=-1`,
                requestInit
            )
            const lyricData: Main = await data.json();
            setLyric(lyricData);
        }

        getLyric();
    }, [track]);

    return (
        <SafeAreaView style={styles.rootView}>
            <TrackInfoBar />

            {lyric ? (
                <LyricView
                    lrc={lyric.lrc.lyric}
                    currentTime={position * 1000}
                />
            ) : (
                <ActivityIndicator
                    size="large"
                    style={styles.loading}
                />
            )}
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    rootView: {
        flex: 1,
        display: 'flex',
    },
    lyricText: {
        fontWeight: 'bold',
        paddingBottom: "5%",
    },
    lyricView: {
        height: 500,
        marginHorizontal: "2%"
    },
    loading: {
        marginTop: '20%'
    },
});