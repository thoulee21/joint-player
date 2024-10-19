import React from 'react';
import { StyleSheet } from 'react-native';
import HapticFeedback, {
    HapticFeedbackTypes,
} from 'react-native-haptic-feedback';
import { Text, useTheme } from 'react-native-paper';
import TrackPlayer from 'react-native-track-player';
import Lyric from './Lyric/components/lyric';
import { LyricLine } from './Lyric/lyric';

const lyricOffset = 1000;

const LyricItem = ({ lrcLine, active }:
    { lrcLine: LyricLine, active: boolean }
) => {
    const appTheme = useTheme();
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
                TrackPlayer.seekTo(lrcLine.millisecond / lyricOffset);
            }}
        >
            {lrcLine.content}
        </Text>
    );
};

const lineRenderer = ({ lrcLine: lyricLine, active }:
    { lrcLine: LyricLine, active: boolean }
) => {
    return (
        <LyricItem
            key={lyricLine.millisecond}
            lrcLine={lyricLine}
            active={active}
        />
    );
};

export const LyricView = ({ lrc, currentTime }:
    { lrc: string, currentTime: number }
) => {
    return (
        <Lyric
            style={styles.lyricView}
            lrc={lrc}
            currentTime={currentTime}
            lineRenderer={lineRenderer}
        />
    );
};

const styles = StyleSheet.create({
    lyricText: {
        fontWeight: 'bold',
        paddingBottom: '5%',
    },
    lyricView: {
        paddingHorizontal: '3.5%',
    },
});
