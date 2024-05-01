import { BlurView } from 'expo-blur';
import React, { PropsWithChildren } from 'react';
import { ImageBackground, StyleSheet } from 'react-native';
import { useTheme } from 'react-native-paper';
import { useActiveTrack } from 'react-native-track-player';
import { placeholderImg } from '.';
import { useAppSelector } from '../hook/reduxHooks';
import { blurRadius } from '../redux/slices';

export function BlurBackground({ children }: PropsWithChildren) {
    const track = useActiveTrack();
    const appTheme = useTheme();
    const blurRadiusValue = useAppSelector(blurRadius);

    return (
        <ImageBackground
            style={styles.root}
            source={{ uri: track?.artwork || placeholderImg }}
            blurRadius={blurRadiusValue}
        >
            <BlurView
                style={styles.root}
                tint={appTheme.dark ? 'dark' : 'light'}
            >
                {children}
            </BlurView>
        </ImageBackground>
    );
}

const styles = StyleSheet.create({
    root: {
        flex: 1,
        display: 'flex',
    }
});
