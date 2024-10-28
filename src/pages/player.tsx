import BottomSheet from '@gorhom/bottom-sheet';
import { useNavigation } from '@react-navigation/native';
import Color from 'color';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { ScrollView, StatusBar, StyleSheet } from 'react-native';
import HapticFeedback, { HapticFeedbackTypes } from 'react-native-haptic-feedback';
import { IconButton, Portal, Searchbar, useTheme } from 'react-native-paper';
import TrackPlayer from 'react-native-track-player';
import { BlurBackground } from '../components/BlurBackground';
import { BottomBar } from '../components/BottomBar';
import { PlayControls } from '../components/PlayControls';
import { Progress } from '../components/Progress';
import { TrackInfo } from '../components/TrackInfo';
import { TrackListSheet } from '../components/TrackListSheet';
import { UpdateSnackbar } from '../components/UpdateSnackbar';
import { useAppDispatch, useThrottle } from '../hook';
import { setQueue } from '../redux/slices';
import { getTracks, TrackType } from '../services/GetTracksService';
import { Storage } from '../utils';
import { StorageKeys } from '../utils/storageKeys';

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
      dispatch(setQueue(
        await getTracks(placeholderKeyword) as TrackType[]
      ));
      TrackPlayer.play();
    }

    setSearching(false);
  }, 3000);

  const pressRightIcon = useCallback(() => {
    // Clear keyword if it's not empty, otherwise search
    if (keyword) { setKeyword(''); }
    else { searchSongs(); }

    HapticFeedback.trigger(
      HapticFeedbackTypes.effectHeavyClick
    );
  }, [keyword, searchSongs]);

  // Render clear or search icon
  const renderRightIcon = useCallback((props: any) => (
    <IconButton
      {...props}
      icon={keyword ? 'close' : 'magnify'}
      animated
      loading={searching}
      onPress={pressRightIcon}
    />
  ), [keyword, searching, pressRightIcon]);

  return (
    <Portal.Host>
      <BlurBackground
        style={{ paddingTop: StatusBar.currentHeight }}
      >
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
          right={renderRightIcon}
          blurOnSubmit
          selectTextOnFocus
          selectionColor={
            Color(appTheme.colors.inversePrimary)
              .fade(0.5).string()
          }
        />

        <ScrollView
          style={styles.screenContainer}
          showsVerticalScrollIndicator={false}
        >
          <TrackInfo />
          <Progress />
          <PlayControls />
        </ScrollView>

        <BottomBar bottomSheetRef={bottomSheetRef} />
        <Portal>
          <UpdateSnackbar />
        </Portal>
        <Portal>
          <TrackListSheet
            bottomSheetRef={bottomSheetRef}
            navigation={navigation}
          />
        </Portal>
      </BlurBackground>
    </Portal.Host>
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
});
