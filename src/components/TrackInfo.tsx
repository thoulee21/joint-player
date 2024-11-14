import Clipboard from '@react-native-clipboard/clipboard';
import { useNavigation } from '@react-navigation/native';
import Color from 'color';
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
  Badge,
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
import { playerLog } from '../utils/logger';
import { ArtistNames } from './ArtistNames';
import { FavToggle } from './FavToggle';

export const placeholderImg = 'https://picsum.photos/800';

export const TrackInfo = () => {
  const navigation = useNavigation();
  const appTheme = useTheme();
  const window = Dimensions.get('window');

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
      playerLog.info(track);
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
            onPress={goLyrics}
            onLongPress={viewTrackPic}
          >
            <ImageBackground
              style={[
                styles.artwork, {
                  borderRadius: appTheme.roundness * 5,
                  backgroundColor: appTheme.colors.surface,
                  width: window.width * 0.9,
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

        <View style={styles.titleView}>
          <Text
            style={styles.titleText}
            onPress={printTrackData}
            numberOfLines={1}
          >
            {track?.title ?? 'No Track'}
          </Text>

          {isTrial && (
            <Badge
              size={17}
              style={[
                styles.badge, {
                  color: appTheme.colors.onSurfaceVariant,
                  borderColor: appTheme.colors.outline,
                  backgroundColor: Color(
                    appTheme.colors.surface
                  ).fade(0.8).string(),
                }
              ]}
              onPress={() => {
                ToastAndroid.showWithGravity(
                  'This is a trial track, not the full version',
                  ToastAndroid.SHORT,
                  ToastAndroid.BOTTOM
                );
              }}
            >Trial</Badge>
          )}
        </View>
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
  badge: {
    borderWidth: 0.5,
    borderRadius: 3,
    position: 'absolute',
    right: -30,
    bottom: 5,
  },
  titleView: {
    maxWidth: '75%',
  },
  artistsText: {
    fontSize: 16,
    fontWeight: '200',
    textAlign: 'center',
  },
  dialog: {
    maxHeight: '80%',
  },
  smallPadding: {
    paddingHorizontal: 0,
  },
  biggerPadding: {
    paddingHorizontal: 24,
  },
});
