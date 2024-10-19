import { BlurView } from 'expo-blur';
import React, { ReactNode, memo } from 'react';
import { ImageBackground, StyleSheet, ViewStyle } from 'react-native';
import { useTheme } from 'react-native-paper';
import { useActiveTrack } from 'react-native-track-player';
import { useAppSelector } from '../hook';
import { blurRadius } from '../redux/slices';
import { placeholderImg } from './TrackInfo';

export const BlurBackground = memo(({ children, style, onLoadEnd }:
    { children?: ReactNode, style?: ViewStyle, onLoadEnd?: () => void }
) => {
    const appTheme = useTheme();
    const blurRadiusValue = useAppSelector(blurRadius);
    const track = useActiveTrack();

    return (
        <ImageBackground
            style={styles.root}
            source={{ uri: track?.artwork || placeholderImg }}
            blurRadius={blurRadiusValue}
            onLoadEnd={onLoadEnd}
        >
            <BlurView
                style={[styles.root, style]}
                tint={appTheme.dark ? 'dark' : 'light'}
            >
                {children}
            </BlurView>
        </ImageBackground>
    );
});

const styles = StyleSheet.create({
    root: {
        flex: 1,
        display: 'flex',
    },
});
