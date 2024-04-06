import BottomSheet from "@gorhom/bottom-sheet";
import { useRef } from "react";
import { StyleSheet } from "react-native";
import { Appbar, Portal } from "react-native-paper";
import { useActiveTrack } from "react-native-track-player";
import {
    LoadingPage,
    PlayControls,
    Progress,
    ScreenWrapper,
    Spacer,
    TrackInfo,
    TrackListSheet
} from "../components";
import { useSetupPlayer } from "../hook";

export function Player({ navigation }: { navigation: any }): React.JSX.Element {
    const track = useActiveTrack();
    const isPlayerReady = useSetupPlayer();
    const bottomSheetRef = useRef<BottomSheet>(null);

    if (!isPlayerReady) {
        return <LoadingPage />;
    }

    return (
        <>
            <Appbar.Header elevated>
                <Appbar.Action
                    icon="menu"
                    onPress={() => {
                        navigation.openDrawer();
                    }}
                />
                <Appbar.Content title="Joint Player" />
            </Appbar.Header>

            <ScreenWrapper contentContainerStyle={styles.screenContainer}>
                <Spacer />
                <TrackInfo track={track} />
                <Progress live={track?.isLiveStream} />
                <Spacer />
                <PlayControls />
                <Spacer mode="expand" />
            </ScreenWrapper>

            <Appbar.Header
                style={styles.bottom}
                mode="center-aligned"
                elevated
            >
                <Appbar.Content
                    title={track?.type || ''}
                    titleStyle={styles.bottomTitle}
                />
                <Appbar.Action
                    icon="menu-open"
                    onPress={() => {
                        bottomSheetRef.current?.expand();
                    }}
                />
            </Appbar.Header>

            <Portal>
                <TrackListSheet bottomSheetRef={bottomSheetRef} />
            </Portal>
        </>
    );
}

const styles = StyleSheet.create({
    screenContainer: {
        display: 'flex',
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    bottom: {
        position: 'absolute',
        left: 0,
        right: 0,
        bottom: 0,
    },
    bottomTitle: {
        fontSize: 16,
    }
});