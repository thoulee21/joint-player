import BottomSheet, { BottomSheetFlatList } from '@gorhom/bottom-sheet';
import React, { useCallback, useEffect } from 'react';
import { Dimensions, StyleSheet } from 'react-native';
import TrackPlayer, { useActiveTrack } from 'react-native-track-player';
import { useAppDispatch, useAppSelector } from '../hook';
import { queue, setQueue } from '../redux/slices';
import { TrackType } from '../services/GetTracksService';
import { BottomSheetPaper } from './BottomSheetPaper';
import { LottieAnimation } from './LottieAnimation';
import { TrackItem } from './TrackItem';

interface TrackListProps {
  bottomSheetRef: React.RefObject<BottomSheet>;
  navigation: any;
}

export function TrackListSheet({ bottomSheetRef }: TrackListProps) {
  const dispatch = useAppDispatch();
  const currentTrack = useActiveTrack();
  const tracks = useAppSelector(queue);

  useEffect(() => {
    async function getQueue() {
      try {
        const playerQueue = await TrackPlayer.getQueue();
        if (playerQueue) {
          dispatch(setQueue(playerQueue as TrackType[]));
        }
      } catch { } // ignore player errors
    }

    getQueue();
    // no dispatch
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentTrack]);

  const renderTrack = useCallback(({ item, index }:
    { item: TrackType; index: number }
  ) => {
    return (
      <TrackItem
        item={item}
        index={index}
        bottomSheetRef={bottomSheetRef}
      />
    );
  }, [bottomSheetRef]);

  const renderEmptyTrack = useCallback(() => {
    return (
      <LottieAnimation
        animation="teapot"
        style={styles.noTracks}
        caption="No tracks found"
      />
    );
  }, []);

  return (
    <BottomSheetPaper ref={bottomSheetRef}>
      <BottomSheetFlatList
        style={styles.root}
        showsVerticalScrollIndicator={false}
        keyExtractor={(item) => item.id.toString()}
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
