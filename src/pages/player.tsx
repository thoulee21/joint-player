import BottomSheet from '@gorhom/bottom-sheet';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Color from 'color';
import { BlurView } from 'expo-blur';
import * as SplashScreen from 'expo-splash-screen';
import React, {
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react';
import {
  ImageBackground,
  ScrollView,
  StatusBar,
  StyleSheet,
} from 'react-native';
import { getColors } from 'react-native-image-colors';
import type {
  AndroidImageColors,
} from 'react-native-image-colors/build/types';
import {
  Portal,
  Searchbar,
  useTheme,
} from 'react-native-paper';
import TrackPlayer, {
  useActiveTrack,
} from 'react-native-track-player';
import { PreferencesContext, StorageKeys } from '../App';
import {
  BottomBar,
  PlayControls,
  Progress,
  Spacer,
  TrackInfo,
  TrackListSheet,
  placeholderImg,
} from '../components';
import { useDebounce, useSetupPlayer } from '../hook';
import { QueueInitialTracksService } from '../services';

export function Player(): React.JSX.Element {
  const appTheme = useTheme();
  const preferences = useContext(PreferencesContext);

  const isPlayerReady = useSetupPlayer();
  const track = useActiveTrack();
  const bottomSheetRef = useRef<BottomSheet>(null);

  const [themeSet, setThemeSet] = useState(false);
  const [searching, setSearching] = useState(false);
  const [keyword, setKeyword] = useState('');
  const [placeholderKeyword, setPlaceholderKeyword] = useState('');

  const setTheme = useDebounce(async () => {
    const colors = await getColors(track?.artwork || placeholderImg);
    const sourceColor = Color((colors as AndroidImageColors).dominant);

    preferences?.setIsDarkMode(sourceColor.isDark());
    preferences?.updateTheme(sourceColor.hex().toString());
  });

  useEffect(() => {
    const restoreInitKeyword = async () => {
      const storedKeyword = await AsyncStorage.getItem(StorageKeys.Keyword);
      if (storedKeyword) {
        setPlaceholderKeyword(storedKeyword);
      }
    };

    restoreInitKeyword();
  }, []);

  useEffect(() => {
    if (isPlayerReady && themeSet) {
      SplashScreen.hideAsync();
    }
  }, [isPlayerReady, themeSet, track?.artwork]);

  const searchSongs = useDebounce(async () => {
    setSearching(true);

    if (keyword) {
      await QueueInitialTracksService(keyword);
    } else if (placeholderKeyword) {
      setKeyword(placeholderKeyword);
      await QueueInitialTracksService(placeholderKeyword);
    }

    setSearching(false);
    await TrackPlayer.play();
  });

  return (
    <ImageBackground
      source={{ uri: track?.artwork || placeholderImg }}
      style={styles.screenContainer}
      blurRadius={preferences?.blurRadius}
      onLoadEnd={() => {
        if (track?.artwork) {
          setTheme();
          setThemeSet(true);
        }
      }}
    >
      <BlurView
        tint={appTheme.dark ? 'dark' : 'light'}
        style={[
          styles.screenContainer,
          styles.searchbarContainer,
        ]}
      >
        <Searchbar
          placeholder={placeholderKeyword || 'Search for songs'}
          placeholderTextColor={appTheme.colors.onSurfaceVariant}
          style={styles.searchbar}
          inputStyle={{ color: appTheme.colors.onSurface }}
          onChangeText={setKeyword}
          value={keyword}
          loading={searching}
          onSubmitEditing={searchSongs}
          onIconPress={searchSongs}
          blurOnSubmit
          selectTextOnFocus
          selectionColor={
            Color(appTheme.colors.inversePrimary)
              .fade(0.5).string()
          }
        />

        <ScrollView style={styles.screenContainer}>
          <Spacer />
          <TrackInfo />
          <Progress live={track?.isLiveStream} />
          <Spacer />
          <PlayControls />
          <Spacer mode="expand" />
        </ScrollView>

        <BottomBar bottomSheetRef={bottomSheetRef} />
      </BlurView>

      <Portal>
        <TrackListSheet
          bottomSheetRef={bottomSheetRef}
          experimentalBlurEnabled={
            preferences?.experimentalBlur ?? true
          }
        />
      </Portal>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  screenContainer: {
    display: 'flex',
    flex: 1,
  },
  searchbar: {
    margin: 10,
    backgroundColor: 'transparent',
  },
  searchbarContainer: {
    paddingTop: StatusBar.currentHeight,
  },
});
