import {
  BottomSheetFlashList,
  BottomSheetFooter,
  type BottomSheetFooterProps,
  type BottomSheetModal
} from '@gorhom/bottom-sheet';
import React, { useCallback, useEffect } from 'react';
import { DeviceEventEmitter, StyleSheet, View } from 'react-native';
import HapticFeedback, {
  HapticFeedbackTypes,
} from 'react-native-haptic-feedback';
import { FAB, List, Tooltip } from 'react-native-paper';
import TrackPlayer from 'react-native-track-player';
import { useAppDispatch, useAppSelector } from '../hook';
import { queue, setQueue, setQueueAsync } from '../redux/slices';
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

  const renderFooter = useCallback((props: BottomSheetFooterProps) => (
    <BottomSheetFooter {...props}>
      <View style={styles.footer}>
        <Tooltip title="Shuffle queue">
          <FAB
            icon="shuffle"
            visible={tracks.length >= 2}
            variant="surface"
            onPress={() => {
              HapticFeedback.trigger(HapticFeedbackTypes.effectClick);

              const shuffledQueue = [...tracks].sort(() => (
                0.5 - Math.random()
              ));
              dispatch(setQueueAsync(shuffledQueue));
            }}
          />
        </Tooltip>
      </View>
    </BottomSheetFooter>
  ), [tracks, dispatch]);

  return (
    <BottomSheetPaper
      ref={bottomSheetRef}
      footer={renderFooter}
    >
      <BottomSheetFlashList
        showsVerticalScrollIndicator={false}
        keyExtractor={keyExtractor}
        data={tracks}
        ListEmptyComponent={renderEmptyTrack}
        estimatedItemSize={96}
        renderItem={renderTrack}
      />
    </BottomSheetPaper>
  );
}

const styles = StyleSheet.create({
  noTrack: {
    marginHorizontal: '4%',
  },
  footer: {
    flexDirection: 'row',
    flex: 1,
    justifyContent: 'flex-end',
    margin: '4%',
  }
});
