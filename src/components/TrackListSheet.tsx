import {
  BottomSheetFlatList,
  type BottomSheetModal,
} from '@gorhom/bottom-sheet';
import React, { useCallback, useEffect } from 'react';
import { DeviceEventEmitter, StyleSheet } from 'react-native';
import { List } from 'react-native-paper';
import TrackPlayer from 'react-native-track-player';
import { useAppDispatch, useAppSelector } from '../hook';
import { queue, setQueue } from '../redux/slices';
import { TrackType } from '../services/GetTracksService';
import type { ListLRProps } from '../types/paperListItem';
import { BottomSheetPaper } from './BottomSheetPaper';
import { TrackItem } from './TrackItem';

export function TrackListSheet({ bottomSheetRef }: {
  bottomSheetRef: React.RefObject<BottomSheetModal>;
}) {
  const dispatch = useAppDispatch();
  const tracks = useAppSelector(queue);

  const initQueue = useCallback(async () => {
    try {
      const playerQueue = await TrackPlayer.getQueue();

      if (playerQueue) {
        dispatch(
          setQueue(playerQueue as TrackType[])
        );
      }
    } catch { } // ignore player errors
  }, [dispatch]);

  useEffect(() => {
    const subscription = DeviceEventEmitter.addListener(
      'loadEnd',
      initQueue
    );

    return () => { subscription.remove(); };
  }, [initQueue]);

  const renderTrack = useCallback(({ item, index }:
    { item: TrackType; index: number }
  ) => {
    return (
      <TrackItem item={item} index={index} />
    );
  }, []);

  const renderEmptyIcon = useCallback(
    (props: ListLRProps) => (
      <List.Icon {...props} icon="music-circle-outline" />
    ), []
  );

  const renderEmptyTrack = useCallback(() => {
    return (
      <List.Item
        title="No tracks in queue"
        description="Add some songs to your queue"
        left={renderEmptyIcon}
        style={styles.noTrack}
      />
    );
  }, [renderEmptyIcon]);

  const keyExtractor = useCallback(
    (item: TrackType) => item.id.toString(), []
  );

  return (
    <BottomSheetPaper ref={bottomSheetRef}>
      <BottomSheetFlatList
        showsVerticalScrollIndicator={false}
        keyExtractor={keyExtractor}
        data={tracks}
        ListEmptyComponent={renderEmptyTrack}
        renderItem={renderTrack}
      />
    </BottomSheetPaper>
  );
}

const styles = StyleSheet.create({
  noTrack: {
    marginHorizontal: '4%',
  }
});
