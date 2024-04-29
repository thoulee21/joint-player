import { useNavigation } from '@react-navigation/native';
import { BlurView } from 'expo-blur';
import React from 'react';
import { ImageBackground, StyleSheet } from 'react-native';
import { Appbar, useTheme } from 'react-native-paper';
import { useActiveTrack } from 'react-native-track-player';
import { CommentList, placeholderImg } from '../components';
import { useAppSelector } from '../hook/reduxHooks';
import { blurRadius } from '../redux/slices';

export function Comments(): React.JSX.Element {
    const navigation = useNavigation();
    const appTheme = useTheme();

    const track = useActiveTrack();
    const blurRadiusValue = useAppSelector(blurRadius);

    return (
        <ImageBackground
            style={styles.rootView}
            source={{ uri: track?.artwork || placeholderImg }}
            blurRadius={blurRadiusValue}
        >
            <BlurView
                tint={appTheme.dark ? 'dark' : 'light'}
                style={styles.rootView}
            >
                <Appbar.Header style={styles.header}>
                    <Appbar.BackAction onPress={navigation.goBack} />
                    <Appbar.Content title="Comments" />
                </Appbar.Header>

                <CommentList commentThreadId={`R_SO_4_${track?.id}`} />
            </BlurView>
        </ImageBackground>
    );
}

const styles = StyleSheet.create({
    rootView: {
        flex: 1,
        display: 'flex',
    },
    header: {
        backgroundColor: 'transparent',
    },
});
