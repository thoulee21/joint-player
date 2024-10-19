import React, { useContext } from 'react';
import { StyleSheet } from 'react-native';
import { ActivityIndicator, List, Text, useTheme } from 'react-native-paper';
import { useActiveTrack, useProgress, } from 'react-native-track-player';
import useSWR from 'swr';
import { LottieAnimation } from '../components/LottieAnimation';
import { FALLBACK_ID, LyricsContainer, TranslateContext } from '../components/LyricsContainer';
import { LyricView } from '../components/LyricView';
import { Main as LyricMain } from '../types/lyrics';

export const TIME_OFFSET = 1005;

export function LyricsScreen() {
    const appTheme = useTheme();
    const { translated } = useContext(TranslateContext);

    const track = useActiveTrack();
    const { position } = useProgress();

    const { data: lyric, error, isLoading } = useSWR<LyricMain>(
        `https://music.163.com/api/song/lyric?id=${track?.id ?? FALLBACK_ID}&lv=1&kv=1&tv=-1`
    );

    if (error) {
        return (
            <LyricsContainer>
                <LottieAnimation
                    animation="sushi"
                    caption="Try again later"
                >
                    <List.Item
                        title="Failed to load lyrics"
                        titleStyle={[
                            styles.center,
                            { color: appTheme.colors.error }
                        ]}
                        description={error.message}
                        descriptionStyle={styles.center}
                    />
                </LottieAnimation>
            </LyricsContainer>
        );
    }

    if (isLoading) {
        return (
            <LyricsContainer>
                <ActivityIndicator size="large" style={styles.loading} />
            </LyricsContainer>
        );
    }

    // if there are no lyrics
    if (!lyric?.lrc.lyric) {
        return (
            <LyricsContainer>
                <LottieAnimation
                    animation="teapot"
                    loop={false}
                >
                    <Text
                        variant="displaySmall"
                        style={[styles.center, styles.reason]}
                    >
                        No lyrics found
                    </Text>
                </LottieAnimation>
            </LyricsContainer>
        );
    }

    return (
        <LyricsContainer>
            <LyricView
                lrc={translated ? lyric.tlyric.lyric : lyric.lrc.lyric}
                currentTime={position * TIME_OFFSET}
            />
        </LyricsContainer>
    );
}

const styles = StyleSheet.create({
    loading: {
        marginTop: '20%',
    },
    center: {
        textAlign: 'center',
    },
    reason: {
        fontWeight: 'bold',
    },
});
