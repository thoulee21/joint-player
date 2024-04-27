import Color from 'color';
import { BlurView } from 'expo-blur';
import React from 'react';
import { ImageBackground, StyleSheet } from 'react-native';
import {
    ActivityIndicator,
    List,
    Text,
    useTheme,
} from 'react-native-paper';
import {
    useActiveTrack,
    useProgress,
} from 'react-native-track-player';
import useSWR from 'swr';
import {
    Lyric,
    TrackInfoBar,
    placeholderImg,
} from '../components';
import { useAppSelector } from '../hook/reduxHooks';
import { blurRadius } from '../redux/slices';
import { Main as LyricMain } from '../types/lyrics';

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
    const appTheme = useTheme();

    const track = useActiveTrack();
    const { position } = useProgress();

    const timeOffset = 1003;
    const blurRadiusValue = useAppSelector(blurRadius);

    const { data: lyric, error, isLoading } = useSWR<LyricMain>(
        `https://music.163.com/api/song/lyric?id=${track?.id}&lv=1&kv=1&tv=-1`
    );

    return (
        <ImageBackground
            source={{ uri: track?.artwork || placeholderImg }}
            style={styles.rootView}
            blurRadius={blurRadiusValue}
        >
            <BlurView
                tint={appTheme.dark ? 'dark' : 'light'}
                style={[
                    styles.rootView,
                    styles.blurView,
                ]}
            >
                <TrackInfoBar />
                {
                    isLoading ?
                        <ActivityIndicator
                            size="large"
                            style={styles.loading}
                        />
                        : (lyric?.lrc.lyric && !error) ?
                            <LyricView
                                lrc={lyric.lrc.lyric}
                                currentTime={position * timeOffset}
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
                            />
                }
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
    center: {
        textAlign: 'center',
    },
    notFoundTitle: {
        marginTop: '10%',
        fontSize: 25,
        fontWeight: 'bold',
    },
});
