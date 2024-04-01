import React, {
  useEffect,
  useState
} from 'react';
import {
  SafeAreaView,
  ScrollView,
  useColorScheme
} from 'react-native';
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
  VStack,
} from "@gluestack-ui/themed";
import TrackPlayer, {
  State,
  useProgress
} from 'react-native-track-player';

const track1 = {
  // Load media from the network
  url: 'http://music.163.com/song/media/outer/url?id=2078657625.mp3',
  title: '牢大想你了',
  artist: 'kobe',
  album: 'while(1<2)',
  genre: 'Progressive House, Electro House',
  date: '2014-05-20T07:00:00+00:00', // RFC 3339
  // Load artwork from the network
  artwork:
    'https://p1.music.126.net/XS6grXCDdSiqbZESp0scGg==/109951168886639260.jpg',
  duration: 120, // Duration in seconds
};

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
  useEffect(() => {
    const init = async () => {
      await TrackPlayer.setupPlayer()
      await TrackPlayer.add([track1])
    };

    init();
  }, []);

  const isDarkMode = useColorScheme() === 'dark';

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
                alt={track1.title}
                source={{ uri: track1.artwork }}
              />
              <PlayProgress />
              <PlayButton />
            </VStack>
          </Center>
        </ScrollView>
      </SafeAreaView>
    </GluestackUIProvider>
  );
}


export default App;
