import Clipboard from '@react-native-clipboard/clipboard';
import { useNavigation } from '@react-navigation/native';
import React, { useCallback, useMemo, useState } from 'react';
import {
  Dimensions,
  ImageBackground,
  ScrollView,
  StyleSheet,
  ToastAndroid,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import HapticFeedback, {
  HapticFeedbackTypes,
} from 'react-native-haptic-feedback';
import {
  Button,
  Dialog,
  Portal,
  Surface,
  Text,
  useTheme,
} from 'react-native-paper';
import {
  useActiveTrack,
  useProgress,
} from 'react-native-track-player';
import useSWR from 'swr';
import { useAppSelector } from '../hook';
import { selectDevModeEnabled } from '../redux/slices';
import { Main as LyricMain } from '../types/lyrics';
import { ArtistNames } from './ArtistNames';
import { FavToggle } from './FavToggle';

export const placeholderImg = 'https://picsum.photos/800';

export const TrackInfo = () => {
  const navigation = useNavigation();
  const appTheme = useTheme();

  const [visible, setVisible] = useState(false);
  const showDialog = useCallback(() => setVisible(true), []);
  const hideDialog = useCallback(() => setVisible(false), []);

  const track = useActiveTrack();
  const progress = useProgress();

  const imageUri = track?.artwork || placeholderImg;
  const { data } = useSWR<LyricMain>(
    `https://music.163.com/api/song/lyric?id=${track?.id}&lv=1&kv=1&tv=-1`
  );

  const devModeEnabled = useAppSelector(selectDevModeEnabled);

  const isTrial = useMemo(() => {
    const trackDuration = Math.trunc(track?.duration || 0);
    const progressDuration = Math.trunc(progress.duration || trackDuration);
    return progressDuration !== trackDuration;
  }, [progress.duration, track?.duration]);

  const printTrackData = useCallback(() => {
    if (track && devModeEnabled) {
      HapticFeedback.trigger(
        HapticFeedbackTypes.effectHeavyClick
      );
      console.info(
        JSON.stringify(
          track, null, 2
        )
      );
      showDialog();
    }
  }, [devModeEnabled, showDialog, track]);

  const copyTrackData = useCallback(() => {
    Clipboard.setString(
      JSON.stringify(
        track, null, 2
      )
    );
    ToastAndroid.showWithGravity(
      'Copied to clipboard',
      ToastAndroid.SHORT,
      ToastAndroid.BOTTOM
    );
  }, [track]);

  const viewTrackPic = useCallback(() => {
    HapticFeedback.trigger(
      HapticFeedbackTypes.effectTick
    );
    if (track?.artwork !== placeholderImg) {
      // @ts-ignore
      navigation.push('WebView', {
        title: track?.title || 'Artwork',
        url: imageUri,
      });
    }
  }, [imageUri, navigation, track?.artwork, track?.title]);

  const goLyrics = useCallback(() => {
    if (track?.id && data?.lrc.lyric) {
      HapticFeedback.trigger('effectHeavyClick');
      // @ts-ignore
      navigation.push('Lyrics');
    }
  }, [data?.lrc.lyric, navigation, track?.id]);

  return (
    <>
      <View style={styles.container}>
        <Surface
          elevation={5}
          style={[
            styles.imgSurface,
            { borderRadius: appTheme.roundness * 5 },
          ]}
        >
          <TouchableWithoutFeedback
            style={[
              styles.artwork,
              { borderRadius: appTheme.roundness * 5 },
            ]}
            onPress={goLyrics}
            onLongPress={viewTrackPic}
          >
            <ImageBackground
              style={[
                styles.artwork, {
                  borderRadius: appTheme.roundness * 5,
                  backgroundColor: appTheme.colors.surface,
                },
              ]}
              imageStyle={{ borderRadius: appTheme.roundness * 5 }}
              source={{ uri: imageUri }}
              resizeMode="cover"
            >
              <FavToggle />
            </ImageBackground>
          </TouchableWithoutFeedback>
        </Surface>

        <Text
          style={styles.titleText}
          onPress={printTrackData}
        >
          {track?.title ?? 'No Track'}{isTrial ? ' (trial)' : ''}
        </Text>
        <ArtistNames textStyle={styles.artistsText} />
      </View>

      <Portal>
        <Dialog
          visible={visible}
          onDismiss={hideDialog}
          style={styles.dialog}
        >
          <Dialog.Title>Track Detail</Dialog.Title>
          <Dialog.ScrollArea style={styles.smallPadding}>
            <ScrollView
              contentContainerStyle={styles.biggerPadding}
            >
              <Text selectable>
                {JSON.stringify(
                  track, null, 2
                )}
              </Text>
            </ScrollView>
          </Dialog.ScrollArea>
          <Dialog.Actions>
            <Button
              icon="content-copy"
              onPress={copyTrackData}
            >
              Copy
            </Button>
            <Button onPress={hideDialog}>
              Close
            </Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    marginTop: '4%',
  },
  artwork: {
    width: Dimensions.get('window').width * 0.9,
    aspectRatio: 1,
  },
  imgSurface: {
    marginTop: '2%',
  },
  titleText: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 30,
    textAlign: 'center',
  },
  artistsText: {
    fontSize: 16,
    fontWeight: '200',
    textAlign: 'center',
  },
  dialog: {
    maxHeight: 0.8 * Dimensions.get('window').height,
  },
  smallPadding: {
    paddingHorizontal: 0,
  },
  biggerPadding: {
    paddingHorizontal: 24,
  },
});
