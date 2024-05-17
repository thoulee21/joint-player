import BottomSheet from '@gorhom/bottom-sheet';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import Color from 'color';
import React, { useEffect, useRef, useState } from 'react';
import { ScrollView, StatusBar, StyleSheet } from 'react-native';
import HapticFeedback, {
  HapticFeedbackTypes
} from 'react-native-haptic-feedback';
import { Searchbar, useTheme } from 'react-native-paper';
import TrackPlayer from 'react-native-track-player';
import { StorageKeys } from '../App';
import {
  BlurBackground,
  BottomBar,
  PlayControls,
  Progress,
  Spacer,
  TrackInfo,
  TrackListSheet,
} from '../components';
import { useAppDispatch, useDebounce } from '../hook';
import { setQueue } from '../redux/slices';
import { TrackType, addTracks } from '../services';

export function Player() {
  const dispatch = useAppDispatch();
  const navigation = useNavigation();
  const appTheme = useTheme();
  const bottomSheetRef = useRef<BottomSheet>(null);

  const [searching, setSearching] = useState(false);
  const [keyword, setKeyword] = useState('');
  const [placeholderKeyword, setPlaceholderKeyword] = useState('');

  useEffect(() => {
    const restoreInitKeyword = async () => {
      const storedKeyword = await AsyncStorage.getItem(StorageKeys.Keyword);
      if (storedKeyword) {
        setPlaceholderKeyword(storedKeyword);
      }
    };

    restoreInitKeyword();
  }, []);

  const searchSongs = useDebounce(async () => {
    setSearching(true);

    if (keyword) {
      AsyncStorage.setItem(StorageKeys.Keyword, keyword);
      dispatch(setQueue(await addTracks(keyword) as TrackType[]));
      TrackPlayer.play();
    } else if (placeholderKeyword) {
      setKeyword(placeholderKeyword);
      dispatch(setQueue(await addTracks(placeholderKeyword) as TrackType[]));
      TrackPlayer.play();
    }

    setSearching(false);
  });

  return (
    <BlurBackground style={styles.searchbarContainer}>
      <Searchbar
        placeholder={placeholderKeyword || 'Search for songs'}
        placeholderTextColor={appTheme.dark
          ? appTheme.colors.onSurfaceDisabled
          : appTheme.colors.backdrop}
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
      <TrackListSheet
        bottomSheetRef={bottomSheetRef}
        navigation={navigation}
      />
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
