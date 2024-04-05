import BottomSheet, { BottomSheetFlatList } from '@gorhom/bottom-sheet';
import React, { useEffect, useRef, useState } from 'react';
import {
  SafeAreaView,
  StatusBar,
  StyleSheet,
  View,
  useColorScheme
} from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import {
  ActivityIndicator,
  Appbar,
  Divider,
  HelperText,
  IconButton,
  List,
  PaperProvider,
  Portal,
  useTheme,
} from 'react-native-paper';
import TrackPlayer, {
  Track,
  useActiveTrack,
  useIsPlaying,
  usePlaybackState
} from 'react-native-track-player';
import { version as appVersion } from "../package.json";
import playlistData from "./assets/data/playlist.json";
import {
  BottomSheetPaper,
  Progress,
  ScreenWrapper,
  Spacer,
  TrackInfo
} from './components';
import { useSetupPlayer } from './hook';

function PlayButton() {
  const { playing, bufferingDuringPlay } = useIsPlaying();

  return (
    <IconButton
      icon={playing ? 'pause' : 'play'}
      size={48}
      loading={bufferingDuringPlay}
      selected
      animated
      onPress={playing ? TrackPlayer.pause : TrackPlayer.play}
    />
  );
}

function BackwardButton() {
  return (
    <IconButton
      icon="rewind"
      size={28}
      onPress={async () => {
        await TrackPlayer.skipToPrevious();
      }}
    />
  );
}

function ForwardButton() {
  return (
    <IconButton
      icon="fast-forward"
      size={28}
      onPress={async () => {
        await TrackPlayer.skipToNext();
      }}
    />
  );
}

function PlayControls() {
  return (
    <View style={styles.controlsContainer}>
      <View style={styles.playControls}>
        <BackwardButton />
        <PlayButton />
        <ForwardButton />
      </View>
      <ErrorText />
    </View>
  );
}

function LoadingApp() {
  return (
    <SafeAreaView style={styles.screenContainer}>
      <ActivityIndicator size="large" />
    </SafeAreaView>
  );
}

function App() {
  return (
    <GestureHandlerRootView style={styles.rootView}>
      <PaperProvider>
        <Inner />
      </PaperProvider>
    </GestureHandlerRootView>
  );
}

function ErrorText() {
  const playbackState = usePlaybackState();
  const isError = 'error' in playbackState;

  if (isError) {
    return (
      <HelperText type="error">
        {`${playbackState.error.message} - ${playbackState.error.code}`}
      </HelperText>
    );
  }
}

function TrackList() {
  const appTheme = useTheme();
  const currentTrack = useActiveTrack();
  const [queue, setQueue] = useState<Track[]>([]);

  useEffect(() => {
    async function getQueue() {
      const queue = await TrackPlayer.getQueue();
      if (queue) {
        setQueue(queue);
      }
    }

    getQueue().finally(() => {
      console.log(JSON.stringify(queue));
    });
  }, []);

  return (
    <BottomSheetFlatList
      style={{ height: '100%' }}
      data={queue.length != 0 ? queue : playlistData as Track[]}
      renderItem={({ item, index }) => (
        <List.Item
          title={item.title}
          description={item.artist}
          descriptionStyle={{
            color: appTheme.colors.secondary,
          }}
          style={{
            backgroundColor:
              currentTrack?.title === item.title
                ? appTheme.colors.secondaryContainer
                : undefined,
          }}
          left={(props) => <List.Icon {...props} icon="music-note" />}
          onPress={async () => {
            await TrackPlayer.skip(index);
          }}
        />
      )}
      ItemSeparatorComponent={() => <Divider />}
    />
  );
}

function TrackListSheet({ bottomSheetRef }:
  { bottomSheetRef: React.RefObject<BottomSheet> }) {
  return (
    <BottomSheetPaper bottomSheetRef={bottomSheetRef}>
      <TrackList />
    </BottomSheetPaper>
  );
}

function Inner(): React.JSX.Element {
  const isDarkMode = useColorScheme() === 'dark';
  const track = useActiveTrack();
  const isPlayerReady = useSetupPlayer();

  const bottomSheetRef = useRef<BottomSheet>(null);

  if (!isPlayerReady) {
    return <LoadingApp />;
  }

  return (
    <>
      <ScreenWrapper contentContainerStyle={styles.screenContainer}>
        <StatusBar barStyle={!isDarkMode ? 'light-content' : 'dark-content'} />
        <Appbar elevated>
          <Appbar.Action
            icon="menu"
            onPress={() => {
              bottomSheetRef.current?.expand();
            }}
          />
          <Appbar.Content title={`Joint Player v${appVersion}`} />
        </Appbar>
        <Spacer />
        <TrackInfo track={track} />
        <Progress live={track?.isLiveStream} />
        <Spacer />
        <PlayControls />
        <Spacer mode="expand" />
      </ScreenWrapper>
      <Portal>
        <TrackListSheet bottomSheetRef={bottomSheetRef} />
      </Portal>
    </>
  );
}

const styles = StyleSheet.create({
  rootView: {
    flex: 1,
  },
  screenContainer: {
    display: 'flex',
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  playControls: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-evenly',
  },
  controlsContainer: {
    width: '100%',
  },
});

export default App;
