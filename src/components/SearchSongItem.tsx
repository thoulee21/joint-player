import React, { useCallback, useMemo, useState } from 'react';
import { StyleSheet, ToastAndroid } from 'react-native';
import HapticFeedback, { HapticFeedbackTypes } from 'react-native-haptic-feedback';
import { IconButton, List, useTheme } from 'react-native-paper';
import TrackPlayer from 'react-native-track-player';
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
  const [fetching, setFetching] = useState(false);

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

      ToastAndroid.showWithGravity(
        'Added to queue',
        ToastAndroid.SHORT,
        ToastAndroid.TOP
      );
    }
    //no dispatch
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [item.id]);

  const renderRight = useCallback((props: ListLRProps) => (
    <IconButton
      {...props}
      icon="playlist-plus"
      onPress={() => addToQueue()}
      loading={fetching}
    />
  ), [addToQueue, fetching]);

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
      onPress={() => addToQueue(true)}
    />
  );
};

const styles = StyleSheet.create({
  songItem: {
    backgroundColor: 'transparent',
  },
});
