import React, { createContext, PropsWithChildren, useCallback, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import HapticFeedback, { HapticFeedbackTypes } from 'react-native-haptic-feedback';
import { ToggleButton } from 'react-native-paper';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useActiveTrack } from 'react-native-track-player';
import useSWR from 'swr';
import { BlurBackground } from '../components/BlurBackground';
import { TrackInfoBar } from '../components/TrackInfoBar';
import { TrackMenu } from '../components/TrackMenu';
import { Main as LyricMain } from '../types/lyrics';
import { CommentsMenu } from './CommentsMenu';
import { MvMenu } from './MvMenu';

export const TranslateContext = createContext<{
  translated: boolean;
  toggleTranslate: () => void;
}>({
  translated: false,
  toggleTranslate: () => { }
});

export const LyricsContainer = ({ children }: PropsWithChildren) => {
  const insets = useSafeAreaInsets();
  const track = useActiveTrack();
  const [translated, setTranslated] = useState(false);

  const { data: lyric } = useSWR<LyricMain>(
    track?.id &&
    `https://music.163.com/api/song/lyric?id=${track?.id}&lv=1&kv=1&tv=-1`
  );

  const toggleTranslate = useCallback(() => {
    HapticFeedback.trigger(
      HapticFeedbackTypes.effectHeavyClick
    );
    setTranslated(prev => !prev);
  }, []);

  const TranslateToggle = useCallback(() => (
    <ToggleButton
      icon="translate"
      status={translated ? 'checked' : 'unchecked'}
      disabled={!lyric?.tlyric.lyric}
      onPress={toggleTranslate}
    />
  ), [translated, lyric, toggleTranslate]);

  const renderRightButtons = useCallback(() => (
    <View style={styles.row}>
      <TranslateToggle />
      <TrackMenu>
        <MvMenu />
        <CommentsMenu />
      </TrackMenu>
    </View>
  ), [TranslateToggle]);

  return (
    <TranslateContext.Provider
      value={{ translated, toggleTranslate }}
    >
      <BlurBackground
        style={[
          styles.blurView,
          { paddingTop: insets.top }
        ]}>
        <TrackInfoBar
          right={renderRightButtons}
        />
        {children}
      </BlurBackground>
    </TranslateContext.Provider>
  );
};

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
  },
  blurView: {
    paddingHorizontal: '5%',
  },
});
