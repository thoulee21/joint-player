import React, { useCallback, useMemo, useState } from 'react';
import { StyleSheet, ToastAndroid, View } from 'react-native';
import HapticFeedback, { HapticFeedbackTypes } from 'react-native-haptic-feedback';
import { IconButton, List, useTheme } from 'react-native-paper';
import TrackPlayer, { useActiveTrack, useIsPlaying } from 'react-native-track-player';
import { IndexOfSong } from '../components/IndexOfSong';
import { useAppDispatch } from '../hook';
import { addToQueueAsync, clearAddOneAsync } from '../redux/slices';
import type { TrackType } from '../services/GetTracksService';
import type { ListLRProps } from '../types/paperListItem';
import type { Song } from '../types/searchSongs';
import { fetchTrackDetails } from '../utils';

export const SearchSongItem = ({ index, item }: {
  index: number, item: Song
}) => {
  const dispatch = useAppDispatch();
  const appTheme = useTheme();

  const currentTrack = useActiveTrack() as TrackType | undefined;
  const { playing } = useIsPlaying();

  const [fetching, setFetching] = useState(false);
  const [added, setAdded] = useState(false);

  const isCurrentPlaying = useMemo(() => (
    (currentTrack?.id === item.id.toString()) && playing
  ), [currentTrack?.id, item.id, playing]);

  const renderIndex = useCallback((
    props: ListLRProps
  ) => (
    <IndexOfSong {...props} index={index} />
  ), [index]);

  const addToQueue = useCallback(async (play?: boolean) => {
    HapticFeedback.trigger(HapticFeedbackTypes.effectHeavyClick);

    setFetching(true);
    const details = await fetchTrackDetails(item.id.toString());
    setFetching(false);

    if (play) {
      await dispatch(clearAddOneAsync(details as TrackType));
      await TrackPlayer.play();
    } else {
      await dispatch(addToQueueAsync(details as TrackType));

      setAdded(true);
      ToastAndroid.showWithGravity(
        'Added to queue',
        ToastAndroid.SHORT,
        ToastAndroid.TOP
      );
    }
  }, [dispatch, item.id]);

  const renderRight = useCallback((
    props: ListLRProps
  ) => (
    <View style={styles.btns}>
      <IconButton
        {...props}
        icon={added ? 'playlist-check' : 'playlist-plus'}
        onPress={() => addToQueue()}
        disabled={fetching || added}
      />
      <IconButton
        {...props}
        icon="play-circle-outline"
        onPress={() => addToQueue(true)}
        disabled={fetching || isCurrentPlaying}
        selected
      />
    </View>
  ), [addToQueue, added, fetching, isCurrentPlaying]);

  const description = useMemo(() => (
    `${item.artists.map(
      (artist) => artist.name
    ).join(', ')} - ${item.album.name}`
  ), [item]);

  return (
    <List.Item
      title={item.name}
      description={description}
      descriptionNumberOfLines={1}
      style={styles.songItem}
      titleStyle={{ color: appTheme.colors.onSurface }}
      left={renderIndex}
      right={renderRight}
    />
  );
};

const styles = StyleSheet.create({
  songItem: {
    backgroundColor: 'transparent',
  },
  btns: {
    flexDirection: 'row'
  }
});
