import { useNavigation } from '@react-navigation/native';
import React, { useCallback, useMemo } from 'react';
import {
  Alert,
  FlatList,
  Image,
  StyleSheet,
  TouchableWithoutFeedback,
  View
} from 'react-native';
import HapticFeedback, { HapticFeedbackTypes } from 'react-native-haptic-feedback';
import { Surface, Text, useTheme } from 'react-native-paper';
import { useActiveTrack, useProgress } from 'react-native-track-player';
import useSWR from 'swr';
import { useAppSelector } from '../hook';
import { selectDevModeEnabled } from '../redux/slices';
import { Artist } from '../types/albumArtist';
import { Main as LyricMain } from '../types/lyrics';

export const placeholderImg = 'https://picsum.photos/800';

export const TrackInfo = () => {
  const navigation = useNavigation();
  const appTheme = useTheme();

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
      if (__DEV__) {
        console.info(JSON.stringify(track, null, 2));
      } else {
        Alert.alert(
          track.title || 'Details',
          JSON.stringify(track, null, 2),
          [{ text: 'OK' }],
          { cancelable: true }
        );
      }
    }
  }, [devModeEnabled, track]);

  return (
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
          onPress={() => {
            if (track?.id && data?.lrc.lyric) {
              HapticFeedback.trigger('effectHeavyClick');
              // @ts-ignore
              navigation.push('Lyrics');
            }
          }}
          onLongPress={() => {
            HapticFeedback.trigger(HapticFeedbackTypes.effectTick);
            if (track?.artwork !== placeholderImg) {
              // @ts-ignore
              navigation.push('WebView', {
                title: track?.title || 'Artwork',
                url: imageUri,
              });
            }
          }}
        >
          <Image
            style={[
              styles.artwork,
              {
                borderRadius: appTheme.roundness * 5,
                backgroundColor: appTheme.colors.surface,
              },
            ]}
            source={{ uri: imageUri }}
          />
        </TouchableWithoutFeedback>
      </Surface>

      <Text
        style={styles.titleText}
        onPress={printTrackData}
      >
        {track?.title}{isTrial ? ' (trial)' : ''}
      </Text>

      <FlatList
        data={track?.artists as Artist[]}
        horizontal
        keyExtractor={(item) => item.id.toString()}
        ItemSeparatorComponent={() => (
          <Text
            style={[styles.artistText, {
              color: appTheme.dark
                ? appTheme.colors.onSurfaceDisabled
                : appTheme.colors.backdrop
            }]}
          >/</Text>
        )}
        renderItem={({ item }) => (
          <Text
            style={[styles.artistText, {
              color: appTheme.colors.primary
            }]}
            onPress={() => {
              HapticFeedback.trigger(
                HapticFeedbackTypes.effectHeavyClick
              );
              //@ts-ignore
              navigation.push('Artist', {
                artist: item,
              });
            }}
          >{item.name}</Text>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
  },
  artwork: {
    width: '90%',
    aspectRatio: 1,
  },
  imgSurface: {
    marginTop: '2%',
    elevation: 5,
    overflow: 'hidden',
  },
  titleText: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 30,
    textAlign: 'center',
  },
  artistText: {
    fontSize: 16,
    fontWeight: '200',
    textAlign: 'center',
  },
});
