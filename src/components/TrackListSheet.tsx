import { BottomSheetFlatList, type BottomSheetModal } from '@gorhom/bottom-sheet';
import React, { useCallback, useEffect } from 'react';
import { DeviceEventEmitter, Dimensions, StyleSheet } from 'react-native';
import TrackPlayer from 'react-native-track-player';
import { useAppDispatch, useAppSelector } from '../hook';
import { queue, setQueue } from '../redux/slices';
import { TrackType } from '../services/GetTracksService';
import { BottomSheetPaper } from './BottomSheetPaper';
import { LottieAnimation } from './LottieAnimation';
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
    //no dispatch dependency
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    DeviceEventEmitter.addListener(
      'loadEnd',
      initQueue
    );
  }, [initQueue]);

  const renderTrack = useCallback(({ item, index }:
    { item: TrackType; index: number }
  ) => {
    return (
      <TrackItem item={item} index={index} />
    );
  }, []);

  const renderEmptyTrack = useCallback(() => {
    return (
      <LottieAnimation
        animation="teapot"
        style={styles.noTracks}
        caption="No tracks found"
      />
    );
  }, []);

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
  root: {
    flex: 1,
  },
  noTracks: {
    height: Dimensions.get('window').height,
    width: Dimensions.get('window').width,
  },
});
