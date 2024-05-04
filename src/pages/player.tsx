import BottomSheet from '@gorhom/bottom-sheet';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Color from 'color';
import * as SplashScreen from 'expo-splash-screen';
import React, { useContext, useEffect, useRef, useState } from 'react';
import { ScrollView, StatusBar, StyleSheet } from 'react-native';
import HapticFeedback, { HapticFeedbackTypes } from 'react-native-haptic-feedback';
import { getColors } from 'react-native-image-colors';
import type { AndroidImageColors } from 'react-native-image-colors/build/types';
import { Portal, Searchbar, useTheme } from 'react-native-paper';
import TrackPlayer, { useActiveTrack } from 'react-native-track-player';
import { PreferencesContext, StorageKeys } from '../App';
import {
  BlurBackground,
  BottomBar,
  PlayControls,
  Progress,
  Spacer,
  TrackInfo,
  TrackListSheet,
  placeholderImg,
} from '../components';
import { useAppDispatch, useDebounce, useSetupPlayer } from '../hook';
import { toggleDarkMode } from '../redux/slices';
import { addTracks } from '../services';

export function Player() {
  const dispatch = useAppDispatch();
  const preferences = useContext(PreferencesContext);
  const appTheme = useTheme();

  const isPlayerReady = useSetupPlayer();
  const track = useActiveTrack();
  const bottomSheetRef = useRef<BottomSheet>(null);

  const [themeSet, setThemeSet] = useState(false);
  const [searching, setSearching] = useState(false);
  const [keyword, setKeyword] = useState('');
  const [placeholderKeyword, setPlaceholderKeyword] = useState('');

  const setTheme = async () => {
    const colors = await getColors(track?.artwork || placeholderImg);
    const androidColors = (colors as AndroidImageColors);
    const sourceColor = Color(androidColors.vibrant);

    preferences?.updateTheme(sourceColor.hex().toString());
    if (appTheme.dark !== Color(androidColors.average).isDark()) {
      dispatch(toggleDarkMode());
    }
  };

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
      AsyncStorage.setItem(StorageKeys.Keyword, keyword);
      await addTracks(keyword);
      TrackPlayer.play();
    } else if (placeholderKeyword) {
      setKeyword(placeholderKeyword);
      await addTracks(placeholderKeyword);
      TrackPlayer.play();
    }

    setSearching(false);
  });

  const onLoadEnd = () => {
    if (track?.artwork) {
      setTheme();
      setThemeSet(true);
    }
  };

  return (
    <BlurBackground
      style={styles.searchbarContainer}
      onLoadEnd={onLoadEnd}
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
        onIconPress={() => {
          searchSongs();
          HapticFeedback.trigger(
            HapticFeedbackTypes.effectHeavyClick
          );
        }}
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
        <Progress />
        <Spacer />
        <PlayControls />
        <Spacer mode="expand" />
      </ScrollView>

      <BottomBar bottomSheetRef={bottomSheetRef} />
      <Portal>
        <TrackListSheet
          bottomSheetRef={bottomSheetRef}
        />
      </Portal>
    </BlurBackground>
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
