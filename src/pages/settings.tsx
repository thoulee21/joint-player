import React, { useState } from "react";
import { Platform, StyleSheet } from "react-native";
import { Appbar, Divider, List, SegmentedButtons } from "react-native-paper";
import TrackPlayer, { RepeatMode } from "react-native-track-player";
import { version as appVersion } from "../../package.json";
import { ScreenWrapper } from "../components";
import { DefaultRepeatMode } from "../services";

const repeatModeToIndex = (repeatMode: RepeatMode): number => {
    switch (repeatMode) {
        case RepeatMode.Off:
            return 0;
        case RepeatMode.Track:
            return 1;
        case RepeatMode.Queue:
            return 2;
        default:
            return 2;
    }
};

const repeatModeFromIndex = (index: number): RepeatMode => {
    switch (index) {
        case 0:
            return RepeatMode.Off;
        case 1:
            return RepeatMode.Track;
        case 2:
            return RepeatMode.Queue;
        default:
            return RepeatMode.Queue;
    }
};

function RepeatModeButtons() {
    const [selectedRepeatMode, setSelectedRepeatMode] = useState(
        repeatModeToIndex(DefaultRepeatMode)
    );

    return (
        <List.Section title="Repeat Mode">
            <SegmentedButtons
                style={styles.buttons}
                value={selectedRepeatMode.toString()}
                buttons={[
                    // { label: "Off", value: '0', icon: 'repeat-off' },
                    { label: "Track", value: '1', icon: 'repeat-once' },
                    { label: "Queue", value: '2', icon: 'repeat' },
                ]}
                onValueChange={async (value) => {
                    setSelectedRepeatMode(Number(value));
                    const repeatMode = repeatModeFromIndex(Number(value));
                    await TrackPlayer.setRepeatMode(repeatMode);
                }}
            />
        </List.Section>
    );
}

export function Settings({ navigation }: { navigation: any }) {
    return (
        <>
            <Appbar.Header elevated>
                <Appbar.Action
                    icon="menu"
                    onPress={() => {
                        navigation.openDrawer()
                    }}
                />
                <Appbar.Content title="Settings" />
            </Appbar.Header>
            <ScreenWrapper>
                <RepeatModeButtons />
                <Divider />
                <List.Section>
                    <List.Item
                        title="Version"
                        description={`${Platform.OS} v${appVersion}`}
                        left={(props) =>
                            <List.Icon {...props} icon="information-outline" />
                        }
                    />
                </List.Section>
            </ScreenWrapper>
        </>
    );
}

const styles = StyleSheet.create({
    buttons: {
        marginHorizontal: '2%',
    },
});
