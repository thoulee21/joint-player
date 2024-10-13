import React, { createContext, PropsWithChildren, useCallback, useState } from 'react';
import { StatusBar, StyleSheet, View } from 'react-native';
import HapticFeedback, { HapticFeedbackTypes } from 'react-native-haptic-feedback';
import { ToggleButton } from 'react-native-paper';
import { useActiveTrack } from 'react-native-track-player';
import useSWR from 'swr';
import { BlurBackground } from '../components/BlurBackground';
import { TrackInfoBar } from '../components/TrackInfoBar';
import { TrackMenu } from '../components/TrackMenu';
import { Main as LyricMain } from '../types/lyrics';

export const FALLBACK_ID = 1470156770;

export const TranslateContext = createContext<{
    translated: boolean;
    toggleTranslate: () => void;
}>({ translated: false, toggleTranslate: () => { } });

export const LyricsContainer = ({ children }: PropsWithChildren) => {
    const track = useActiveTrack();
    const { data: lyric } = useSWR<LyricMain>(
        `https://music.163.com/api/song/lyric?id=${track?.id ?? FALLBACK_ID}&lv=1&kv=1&tv=-1`
    );

    const [translated, setTranslated] = useState(false);
    const toggleTranslate = useCallback(() => {
        HapticFeedback.trigger(HapticFeedbackTypes.effectHeavyClick);
        setTranslated(prev => !prev);
    }, []);

    const TranslateToggle = useCallback(() => (
        <ToggleButton
            icon="translate"
            status={translated ? 'checked' : 'unchecked'}
            disabled={!lyric?.tlyric.lyric}
            onPress={toggleTranslate}
        />
    ), [translated, lyric?.tlyric.lyric, toggleTranslate]);

    const RightButtons = useCallback(() => (
        <View style={styles.row}>
            <TranslateToggle />
            <TrackMenu />
        </View>
    ), [TranslateToggle]);

    return (
        <TranslateContext.Provider value={{ translated, toggleTranslate }}>
            <BlurBackground style={styles.blurView}>
                <TrackInfoBar style={styles.infoBar} right={RightButtons} />
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
    infoBar: {
        paddingTop: StatusBar.currentHeight,
        marginVertical: '5%',
    },
});
