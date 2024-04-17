import { BlurView } from 'expo-blur';
import React, { useEffect, useState } from 'react';
import { ImageBackground, StyleSheet } from 'react-native';
import {
    ActivityIndicator,
    Text,
    useTheme
} from 'react-native-paper';
import {
    useActiveTrack,
    useProgress
} from 'react-native-track-player';
import {
    Lyric,
    TrackInfoBar,
    placeholderImg
} from '../components';
import { useDebounce } from '../hook';
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
                numberOfLines={10}
                style={[
                    styles.lyricText,
                    {
                        color: active
                            ? appTheme.colors.primary
                            : appTheme.colors.backdrop,
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
            lineRenderer={lineRenderer}
        />
    );
};

export function LyricsScreen() {
    const track = useActiveTrack();
    const { position } = useProgress();
    const appTheme = useTheme();

    const [lyric, setLyric] = useState<Main>();
    const [noLyric, setNoLyric] = useState(false);

    const getLyric = useDebounce(async () => {
        if (!track?.id) {
            return;
        }

        const data = await fetch(
            `https://music.163.com/api/song/lyric?id=${track?.id}&lv=1&kv=1&tv=-1`,
            requestInit
        )
        const lyricData: Main = await data.json();

        setNoLyric(!lyricData.lrc.lyric);
        setLyric(lyricData);
    });

    useEffect(() => {
        getLyric();
    }, [track]);

    return (
        <ImageBackground
            source={{ uri: track?.artwork || placeholderImg }}
            style={styles.rootView}
            blurRadius={20}
        >
            <TrackInfoBar />

            <BlurView
                tint={appTheme.dark ? 'dark' : 'light'}
            >
                {lyric?.lrc.lyric ? (
                    <LyricView
                        lrc={lyric.lrc.lyric}
                        currentTime={position * 1000}
                    />
                ) : (
                    !noLyric ? (
                        <ActivityIndicator
                            size="large"
                            style={styles.loading}
                        />
                    ) : (
                        <Text
                            style={styles.notFound}
                            variant="headlineSmall"
                        >
                            No lyric found
                        </Text>
                    )
                )}
            </BlurView>
        </ImageBackground>
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
        paddingHorizontal: "2%",
    },
    loading: {
        marginTop: '20%'
    },
    notFound: {
        marginTop: '20%',
        textAlign: 'center'
    }
});