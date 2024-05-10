import React, { useState } from 'react';
import { StatusBar, StyleSheet, View } from 'react-native';
import HapticFeedback, { HapticFeedbackTypes } from 'react-native-haptic-feedback';
import { ActivityIndicator, List, ToggleButton, useTheme } from 'react-native-paper';
import { useActiveTrack, useProgress, } from 'react-native-track-player';
import useSWR from 'swr';
import { BlurBackground, LyricView, TrackInfoBar, TrackMenu } from '../components';
import { Main as LyricMain } from '../types/lyrics';

export const timeOffset = 1005;

export function LyricsScreen() {
    const appTheme = useTheme();
    const track = useActiveTrack();
    const { position } = useProgress();

    const [translated, setTranslated] = useState(false);
    const { data: lyric, error, isLoading } = useSWR<LyricMain>(
        `https://music.163.com/api/song/lyric?id=${track?.id}&lv=1&kv=1&tv=-1`
    );

    const RightButtons = () => {
        return (
            <View style={styles.row}>
                <ToggleButton
                    icon="translate"
                    status={translated ? 'checked' : 'unchecked'}
                    disabled={!lyric?.tlyric.lyric}
                    onPress={() => {
                        HapticFeedback.trigger(
                            HapticFeedbackTypes.effectHeavyClick
                        );
                        setTranslated(prev => !prev);
                    }}
                />
                <TrackMenu />
            </View>
        );
    };

    return (
        <BlurBackground style={styles.blurView}>
            <TrackInfoBar
                style={styles.infoBar}
                right={RightButtons}
            />
            {isLoading ?
                <ActivityIndicator
                    size="large"
                    style={styles.loading}
                />
                : (lyric?.lrc.lyric && !error) ?
                    <LyricView
                        lrc={translated
                            ? lyric.tlyric.lyric
                            : lyric.lrc.lyric}
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
    row: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'flex-end',
    },
});
