import BottomSheet from "@gorhom/bottom-sheet";
import Color from "color";
import * as SplashScreen from 'expo-splash-screen';
import React, { useContext, useEffect, useRef, useState } from "react";
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
    MvButton,
    PlayControls,
    Progress,
    RepeatModeSwitch,
    ScreenWrapper,
    Spacer,
    TrackInfo,
    TrackListSheet,
    placeholderImg
} from "../components";
import { useImageColors, useSetupPlayer } from "../hook";
import { QueueInitialTracksService } from "../services";

export function Player({ navigation }: { navigation: any }): React.JSX.Element {
    const isPlayerReady = useSetupPlayer();
    const track = useActiveTrack();

    const appTheme = useTheme();
    const preferences = useContext(PreferencesContext);
    const bottomSheetRef = useRef<BottomSheet>(null);
    const [searching, setSearching] = useState(false);

    useEffect(() => {
        const imageUri = track?.artwork;
        const colors = useImageColors(imageUri || placeholderImg);

        colors
            .then((colors) => {
                const color = Color(colors[0])
                preferences?.updateTheme(color.hex());

                if (isPlayerReady) {
                    SplashScreen.hideAsync();
                }
            });
    }, [track]);

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
                    enablesReturnKeyAutomatically
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
                <RepeatModeSwitch />
                <MvButton />
                <Appbar.Content
                    title={track?.album || 'No Album'}
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