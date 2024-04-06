import BottomSheet from "@gorhom/bottom-sheet";
import React, { useContext, useRef, useState } from "react";
import { StatusBar, StyleSheet } from "react-native";
import {
    Appbar,
    IconButton,
    Portal,
    Searchbar,
    Surface,
    useTheme
} from "react-native-paper";
import TrackPlayer, { useActiveTrack } from "react-native-track-player";
import { PreferencesContext } from "../App";
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
import { QueueInitialTracksService } from "../services";

export function Player({ navigation }: { navigation: any }): React.JSX.Element {
    const isPlayerReady = useSetupPlayer();
    const track = useActiveTrack();

    const appTheme = useTheme();
    const preferences = useContext(PreferencesContext);
    const [searching, setSearching] = useState(false);
    const bottomSheetRef = useRef<BottomSheet>(null);

    if (!isPlayerReady) {
        return <LoadingPage />;
    }

    function searchSongs() {
        setSearching(true);
        QueueInitialTracksService(preferences?.keyword as string)
            .finally(() => {
                setSearching(false);
                TrackPlayer.play();
            });
    }

    return (
        <>
            <Surface style={styles.searchbarContainer}>
                <Searchbar
                    icon="menu"
                    placeholder="Search for music"
                    style={styles.searchbar}
                    onIconPress={() => {
                        navigation.openDrawer();
                    }}
                    onChangeText={(text) => {
                        preferences?.setKeyword(text);
                    }}
                    value={preferences?.keyword as string}
                    right={(props) =>
                        <IconButton
                            {...props}
                            icon="search-web"
                            onPress={searchSongs}
                            loading={searching}
                        />
                    }
                    onSubmitEditing={searchSongs}
                    blurOnSubmit
                    selectTextOnFocus
                    selectionColor={appTheme.colors.inversePrimary}
                />
            </Surface>
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
                    title={track?.album || ''}
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
    },
    searchbar: {
        margin: 10,
    },
    searchbarContainer: {
        paddingTop: StatusBar.currentHeight,
    }
});