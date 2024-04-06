import BottomSheet from '@gorhom/bottom-sheet';
import React, { useRef } from 'react';
import {
  StatusBar,
  StyleSheet,
  useColorScheme
} from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import {
  Appbar,
  PaperProvider,
  Portal
} from 'react-native-paper';
import {
  useActiveTrack
} from 'react-native-track-player';
import { version as appVersion } from "../package.json";
import {
  LoadingPage,
  PlayControls,
  Progress,
  ScreenWrapper,
  Spacer,
  TrackInfo,
  TrackListSheet
} from './components';
import { useSetupPlayer } from './hook';

function App() {
  return (
    <GestureHandlerRootView style={styles.rootView}>
      <PaperProvider>
        <Inner />
      </PaperProvider>
    </GestureHandlerRootView>
  );
}

function Inner(): React.JSX.Element {
  const isDarkMode = useColorScheme() === 'dark';
  const track = useActiveTrack();
  const isPlayerReady = useSetupPlayer();

  const bottomSheetRef = useRef<BottomSheet>(null);

  if (!isPlayerReady) {
    return <LoadingPage />;
  }

  return (
    <>
      <StatusBar
        barStyle={!isDarkMode ? 'light-content' : 'dark-content'}
      />

      <Appbar.Header elevated>
        <Appbar.Action
          icon="menu"
          onPress={() => {
            bottomSheetRef.current?.expand();
          }}
        />
        <Appbar.Content title={`Joint Player v${appVersion}`} />
      </Appbar.Header>

      <ScreenWrapper contentContainerStyle={styles.screenContainer}>
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
});

export default App;
