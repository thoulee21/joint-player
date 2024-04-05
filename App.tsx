import { config } from "@gluestack-ui/config";
import {
  Button,
  ButtonIcon,
  ButtonText,
  Center,
  CircleIcon,
  GluestackUIProvider,
  Heading,
  Image,
  PlayIcon,
  Progress,
  ProgressFilledTrack,
  StatusBar,
  Text,
  VStack
} from "@gluestack-ui/themed";
import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  useColorScheme
} from 'react-native';
import TrackPlayer, {
  State,
  useActiveTrack,
  usePlaybackState,
  useProgress
} from 'react-native-track-player';
import { QueueInitialTracksService, SetupService } from './src/services';

function useSetupPlayer() {
  const [playerReady, setPlayerReady] = useState<boolean>(false);

  useEffect(() => {
    let unmounted = false;
    (async () => {
      await SetupService();
      if (unmounted) return;
      setPlayerReady(true);
      const queue = await TrackPlayer.getQueue();
      if (unmounted) return;
      if (queue.length <= 0) {
        await QueueInitialTracksService();
      }
    })();
    return () => {
      unmounted = true;
    };
  }, []);
  return playerReady;
}

function PlayProgress() {
  const { position, duration } = useProgress();
  return (
    <Progress
      value={(position / duration) * 100}
      w={300}
      size="md"
      h="$1"
    >
      <ProgressFilledTrack />
    </Progress>
  )
}

function PlayButton() {
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    TrackPlayer.getPlaybackState().then((playbackState) => {
      setIsPlaying(playbackState.state === State.Playing);
    });
  }, []);

  return (
    <Button onPress={() => {
      if (isPlaying) {
        TrackPlayer.pause();
      } else {
        TrackPlayer.play();
      }

      setIsPlaying(!isPlaying);
    }}>
      <ButtonIcon as={isPlaying ? CircleIcon : PlayIcon} />
      <ButtonText>{isPlaying ? "Pause" : "Play"}</ButtonText>
    </Button>
  )
}

function App(): React.JSX.Element {
  const track = useActiveTrack();
  const isPlayerReady = useSetupPlayer();
  const playbackState = usePlaybackState();

  const isDarkMode = useColorScheme() === 'dark';

  if (!isPlayerReady) {
    return (
      <SafeAreaView style={styles.screenContainer}>
        <ActivityIndicator />
      </SafeAreaView>
    );
  }

  return (
    <GluestackUIProvider config={config}>
      <SafeAreaView>
        <StatusBar
          barStyle={isDarkMode ? 'light-content' : 'dark-content'}
        />
        <ScrollView contentInsetAdjustmentBehavior="automatic">
          <Center alignItems="center">
            <VStack space="md">
              <Heading size="2xl">Track Player</Heading>
              <Image
                size="2xl"
                rounded="$2xl"
                marginLeft="auto"
                marginRight="auto"
                alt={track?.title || "Track"}
                source={{ uri: track?.artwork || "https://via.placeholder.com/150" }}
              />
              <PlayProgress />
              <PlayButton />
              <Text>
                {'error' in playbackState
                  ? `${playbackState.error.code} - ${playbackState.error.message}`
                  : undefined}
              </Text>
            </VStack>
          </Center>
        </ScrollView>
      </SafeAreaView>
    </GluestackUIProvider>
  );
}

const styles = StyleSheet.create({
  screenContainer: {
    flex: 1,
    backgroundColor: '#212121',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: '100%',
  },
})

export default App;
