import BottomSheet from '@gorhom/bottom-sheet';
import { useNavigation } from '@react-navigation/native';
import Color from 'color';
import React, { useEffect, useRef, useState } from 'react';
import { ScrollView, StatusBar, StyleSheet } from 'react-native';
import HapticFeedback, { HapticFeedbackTypes } from 'react-native-haptic-feedback';
import { IconButton, Searchbar, useTheme } from 'react-native-paper';
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
import { useAppDispatch, useThrottle } from '../hook';
import { setQueue } from '../redux/slices';
import { TrackType, getTracks } from '../services';
import { Storage } from '../utils';

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
      const storedKeyword = await Storage.get(StorageKeys.Keyword);
      if (storedKeyword) {
        setPlaceholderKeyword(storedKeyword);
      }
    };

    restoreInitKeyword();
  }, []);

  const searchSongs = useThrottle(async () => {
    setSearching(true);

    if (keyword) {
      Storage.set(StorageKeys.Keyword, keyword);
      dispatch(setQueue(await getTracks(keyword) as TrackType[]));
      TrackPlayer.play();
    } else if (placeholderKeyword) {
      setKeyword(placeholderKeyword);
      dispatch(setQueue(await getTracks(placeholderKeyword) as TrackType[]));
      TrackPlayer.play();
    }

    setSearching(false);
  }, 3000);

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
        onSubmitEditing={searchSongs}
        icon="menu"
        onIconPress={() => {
          //@ts-ignore
          navigation.openDrawer();
          HapticFeedback.trigger(
            HapticFeedbackTypes.effectHeavyClick
          );
        }}
        right={(props) => (
          <IconButton {...props}
            icon={keyword ? 'close' : 'magnify'}
            animated
            loading={searching}
            onPress={() => {
              if (keyword) {
                setKeyword('');
              } else {
                searchSongs();
              }

              HapticFeedback.trigger(
                HapticFeedbackTypes.effectHeavyClick
              );
            }}
          />
        )}
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
        <PlayControls />
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
