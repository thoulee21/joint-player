import React, { useContext } from 'react';
import { StyleSheet } from 'react-native';
import { ActivityIndicator, List, useTheme } from 'react-native-paper';
import { useActiveTrack, useProgress } from 'react-native-track-player';
import useSWR from 'swr';
import { LottieAnimation } from '../components/LottieAnimation';
import {
  LyricsContainer,
  TranslateContext,
} from '../components/LyricsContainer';
import { LyricView } from '../components/LyricView';
import { Main as LyricMain } from '../types/lyrics';

const OFFSET = 1000;

function LyricsContent() {
  const appTheme = useTheme();
  const { translated } = useContext(TranslateContext);

  const track = useActiveTrack();
  const { position } = useProgress();

  const { data: lyric, error, isLoading } = useSWR<LyricMain>(
    track?.id &&
    `https://music.163.com/api/song/lyric?id=${track.id}&lv=1&kv=1&tv=-1`
  );

  if (error) {
    return (
      <LottieAnimation
        animation="breathe"
        caption="Try again later"
      >
        <List.Item
          title="Failed to load lyrics"
          titleStyle={[
            styles.center,
            { color: appTheme.colors.error },
          ]}
          description={error.message}
          descriptionStyle={styles.center}
        />
      </LottieAnimation>
    );
  }

  if (isLoading) {
    return (
      <ActivityIndicator
        size="large"
        style={styles.loading}
      />
    );
  }

  // if there are no lyrics
  if (!lyric?.lrc.lyric) {
    return (
      <LottieAnimation
        animation="teapot"
        caption="No lyrics found"
      />
    );
  }

  return (
    <LyricView
      lrc={translated
        ? lyric.tlyric.lyric
        : lyric.lrc.lyric}
      currentTime={position * OFFSET}
    />
  );
}

export const LyricsScreen = () => {
  return (
    <LyricsContainer>
      <LyricsContent />
    </LyricsContainer>
  );
};

const styles = StyleSheet.create({
  loading: {
    marginTop: '40%',
  },
  center: {
    textAlign: 'center',
  },
});
