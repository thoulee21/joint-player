import Color from 'color';
import { BlurView } from 'expo-blur';
import React, { useContext, useEffect, useState } from 'react';
import { ImageBackground, StyleSheet, ToastAndroid } from 'react-native';
import {
    ActivityIndicator,
    Text,
    useTheme,
} from 'react-native-paper';
import {
    useActiveTrack,
    useProgress,
} from 'react-native-track-player';
import { PreferencesContext } from '../App';
import {
    Lyric,
    TrackInfoBar,
    placeholderImg,
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
        const lineColor =
            active
                ? appTheme.colors.onSurface
                : appTheme.dark
                    ? appTheme.colors.onSurfaceDisabled
                    : appTheme.colors.backdrop;

        return (
            <Text
                variant="displaySmall"
                selectable
                selectionColor={
                    Color(appTheme.colors.inversePrimary)
                        .fade(0.5).string()
                }
                numberOfLines={10}
                style={[
                    styles.lyricText,
                    { color: lineColor },
                ]}
            >
                {content}
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
    const track = useActiveTrack();
    const { position } = useProgress();
    const appTheme = useTheme();

    const prefs = useContext(PreferencesContext);
    const [lyric, setLyric] = useState<Main>();
    const [noLyric, setNoLyric] = useState(false);

    const getLyric = useDebounce(async () => {
        if (!track?.id) {
            return;
        }

        const data = await fetch(
            `https://music.163.com/api/song/lyric?id=${track?.id}&lv=1&kv=1&tv=-1`,
            requestInit
        );

        if (data.status !== 200) {
            ToastAndroid.show(
                `Failed to fetch lyric: ${data.status} ${data.statusText}`,
                ToastAndroid.SHORT
            );
        }

        const lyricData: Main = await data.json();

        setNoLyric(!lyricData.lrc.lyric);
        setLyric(lyricData);
    });

    useEffect(() => {
        getLyric();
    }, [getLyric, track]);

    return (
        <ImageBackground
            source={{ uri: track?.artwork || placeholderImg }}
            style={styles.rootView}
            blurRadius={prefs?.blurRadius}
        >
            <BlurView
                tint={appTheme.dark ? 'dark' : 'light'}
                style={[
                    styles.rootView,
                    styles.blurView,
                ]}
            >
                <TrackInfoBar />

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
                            Pure music, no lyrics.
                        </Text>
                    )
                )}
            </BlurView>
        </ImageBackground>
    );
}

const styles = StyleSheet.create({
    rootView: {
        flex: 1,
        display: 'flex',
    },
    blurView: {
        paddingHorizontal: '5%',
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
    notFound: {
        marginTop: '20%',
        textAlign: 'center',
    },
});
