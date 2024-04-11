import React, { useEffect } from "react";
import { StyleSheet, ToastAndroid, View } from "react-native";
import { IconButton } from "react-native-paper";
import TrackPlayer, {
    useIsPlaying,
    usePlaybackState
} from "react-native-track-player";

function BackwardButton() {
    return (
        <IconButton
            icon="rewind"
            size={30}
            onPress={async () => {
                await TrackPlayer.skipToPrevious();
            }}
        />
    );
}

function PlayButton() {
    const { playing, bufferingDuringPlay } = useIsPlaying();

    return (
        <IconButton
            icon={playing ? 'pause' : 'play'}
            size={80}
            loading={bufferingDuringPlay}
            selected
            animated
            onPress={playing ? TrackPlayer.pause : TrackPlayer.play}
        />
    );
}

function ForwardButton() {
    return (
        <IconButton
            icon="fast-forward"
            size={30}
            onPress={async () => {
                await TrackPlayer.skipToNext();
            }}
        />
    );
}

export function PlayControls() {
    const playbackState = usePlaybackState();
    const isError = 'error' in playbackState;

    useEffect(() => {
        if (isError) {
            if (__DEV__) {
                const errMsgDev = `${playbackState.error.message}: ${playbackState.error.code}`;
                console.error(errMsgDev);
            } else {
                const errMsg = "播放出错，自动播放下一首";
                ToastAndroid.show(errMsg, ToastAndroid.SHORT);
            }

            TrackPlayer.skipToNext();
            TrackPlayer.play();
        }
    }, [isError]);

    return (
        <View style={styles.controlsContainer}>
            <View style={styles.playControls}>
                <BackwardButton />
                <PlayButton />
                <ForwardButton />
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    playControls: {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-evenly',
    },
    controlsContainer: {
        width: '100%',
    },
});