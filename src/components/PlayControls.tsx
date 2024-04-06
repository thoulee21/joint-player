import React from "react";
import { StyleSheet, View } from "react-native";
import { HelperText, IconButton } from "react-native-paper";
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

function ErrorText() {
    const playbackState = usePlaybackState();
    const isError = 'error' in playbackState;

    if (isError) {
        return (
            <HelperText type="error">
                {`${playbackState.error.message} - ${playbackState.error.code}`}
            </HelperText>
        );
    }
}

export function PlayControls() {
    return (
        <View style={styles.controlsContainer}>
            <View style={styles.playControls}>
                <BackwardButton />
                <PlayButton />
                <ForwardButton />
            </View>
            <ErrorText />
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