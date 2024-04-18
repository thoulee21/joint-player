import BottomSheet from '@gorhom/bottom-sheet';
import { useNavigation } from '@react-navigation/native';
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
  IconButton,
  Portal,
  Searchbar,
  useTheme
} from 'react-native-paper';
import TrackPlayer, {
  useActiveTrack
} from 'react-native-track-player';
import { PreferencesContext } from '../App';
import {
  PlayControls,
  Progress,
  Spacer,
  TrackInfo,
  TrackListSheet,
  placeholderImg
} from '../components';
import { useSetupPlayer } from '../hook';
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

  useEffect(() => {
    const changeTheme = async () => {
      const colors = await getColors(track?.artwork || placeholderImg);
      preferences?.updateTheme(
        (colors as AndroidImageColors).dominant
      );
    }

    changeTheme()
      .then(() => {
        if (isPlayerReady && firstLoad) {
          SplashScreen.hideAsync();

          if (preferences?.playAtStartup) {
            TrackPlayer.play();
          }
        }
      })
      .finally(() => {
        setFirstLoad(false);
      });
  }, [track, isPlayerReady]);

  function searchSongs() {
    setSearching(true);
    QueueInitialTracksService(preferences?.keyword as string)
      .then(() => {
        setSearching(false);
        TrackPlayer.play();
      });
  }

  return (
    <ImageBackground
      source={{ uri: track?.artwork || placeholderImg }}
      style={styles.screenContainer}
      blurRadius={preferences?.blurRadius}
    >
      <BlurView
        style={[
          styles.screenContainer,
          styles.searchbarContainer
        ]}
        tint={appTheme.dark ? 'dark' : 'light'}
      >
        <Searchbar
          icon="menu"
          placeholder="Search for music"
          style={styles.searchbar}
          onIconPress={() => {
            // @ts-ignore
            navigation.openDrawer();
          }}
          onChangeText={text => {
            preferences?.setKeyword(text);
          }}
          value={preferences?.keyword as string}
          right={props => (
            <IconButton
              {...props}
              icon="search-web"
              onPress={searchSongs}
              loading={searching}
            />
          )}
          onSubmitEditing={searchSongs}
          blurOnSubmit
          selectTextOnFocus
          selectionColor={appTheme.colors.inversePrimary}
          enablesReturnKeyAutomatically
        />

        <ScrollView style={styles.screenContainer}>
          <Spacer />
          <TrackInfo track={track} />
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
