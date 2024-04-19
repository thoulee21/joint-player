import BottomSheet from '@gorhom/bottom-sheet';
import { useNavigation } from '@react-navigation/native';
import Color from 'color';
import { BlurView } from 'expo-blur';
import * as SplashScreen from 'expo-splash-screen';
import React, {
  useContext,
  useEffect,
  useRef,
  useState
} from 'react';
import {
  ImageBackground,
  ScrollView,
  StatusBar,
  StyleSheet,
  ToastAndroid
} from 'react-native';
import { getColors } from 'react-native-image-colors';
import type {
  AndroidImageColors
} from 'react-native-image-colors/build/types';
import {
  Appbar,
  Portal,
  Searchbar,
  useTheme
} from 'react-native-paper';
import { useActiveTrack } from 'react-native-track-player';
import { PreferencesContext } from '../App';
import {
  PlayControls,
  Progress,
  Spacer,
  TrackInfo,
  TrackListSheet,
  placeholderImg
} from '../components';
import { useDebounce, useSetupPlayer } from '../hook';
import { QueueInitialTracksService } from '../services';

export function Player(): React.JSX.Element {
  const navigation = useNavigation();
  const appTheme = useTheme();
  const preferences = useContext(PreferencesContext);

  const isPlayerReady = useSetupPlayer();
  const track = useActiveTrack();
  const bottomSheetRef = useRef<BottomSheet>(null);

  const [searching, setSearching] = useState(false);
  const [firstLoad, setFirstLoad] = useState(true);

  const changeTheme = async () => {
    const colors = await getColors(track?.artwork || placeholderImg);
    const dominantColor = (colors as AndroidImageColors).dominant;

    preferences?.updateTheme(dominantColor);
    preferences?.setIsDarkMode(
      Color(dominantColor).isDark()
    );
  }

  useEffect(useDebounce(() => {
    changeTheme()
      .then(() => {
        if (firstLoad) {
          if (isPlayerReady) {
            SplashScreen.hideAsync();
          }
        }
      })
      .finally(() => {
        setFirstLoad(false);
      });
  }), [track, isPlayerReady]);

  const searchSongs = useDebounce(async () => {
    if (preferences?.keyword) {
      setSearching(true);
      await QueueInitialTracksService(preferences.keyword);
      setSearching(false);
    }
  })

  return (
    <ImageBackground
      source={{ uri: track?.artwork || placeholderImg }}
      style={styles.screenContainer}
      blurRadius={preferences?.blurRadius}
    >
      <BlurView
        tint={appTheme.dark ? 'dark' : 'light'}
        style={[
          styles.screenContainer,
          styles.searchbarContainer
        ]}
      >
        <Searchbar
          placeholder="Search for music"
          style={styles.searchbar}
          onChangeText={text => {
            preferences?.setKeyword(text);
          }}
          value={preferences?.keyword as string}
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

        <Appbar.Header
          style={styles.bottom}
          mode="center-aligned"
          elevated
          statusBarHeight={0}
        >
          <Appbar.Action
            icon="cog-outline"
            onPress={() => {
              // @ts-ignore
              navigation.push('Settings');
            }}
          />
          <Appbar.Content
            title={track?.album || 'No Album'}
            titleStyle={styles.bottomTitle}
            onPress={() => {
              if (track?.album) {
                ToastAndroid.show(track.album, ToastAndroid.SHORT);
              }
            }}
          />
          <Appbar.Action
            icon="menu-open"
            onPress={() => {
              bottomSheetRef.current?.expand();
            }}
          />
        </Appbar.Header>
      </BlurView>

      <Portal>
        <TrackListSheet bottomSheetRef={bottomSheetRef} />
      </Portal>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  screenContainer: {
    display: 'flex',
    flex: 1,
  },
  bottom: {
    backgroundColor: 'transparent',
  },
  bottomTitle: {
    fontSize: 16,
  },
  searchbar: {
    margin: 10,
    backgroundColor: 'transparent',
  },
  searchbarContainer: {
    paddingTop: StatusBar.currentHeight,
  },
});
