import BottomSheet, { BottomSheetFlatList } from '@gorhom/bottom-sheet';
import React, { useEffect } from 'react';
import { StyleSheet, View } from 'react-native';
import { ActivityIndicator, Portal } from 'react-native-paper';
import TrackPlayer, { Track, useActiveTrack } from 'react-native-track-player';
import { BottomSheetPaper, TrackItem } from '.';
import { useAppDispatch, useAppSelector } from '../hook';
import { queue, setQueue } from '../redux/slices';
import { TrackType } from '../services';

interface TrackListProps {
  bottomSheetRef: React.RefObject<BottomSheet>;
  navigation: any;
}

function TrackList({
  bottomSheetRef, navigation
}: TrackListProps) {
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

  const renderTrack = ({ item, index }:
    { item: Track; index: number }
  ) => {
    return (
      <TrackItem
        item={item}
        index={index}
        navigation={navigation}
        bottomSheetRef={bottomSheetRef}
      />
    );
  };

  return (
    <BottomSheetFlatList
      style={styles.trackList}
      showsVerticalScrollIndicator={false}
      data={tracks}
      ListEmptyComponent={() => (
        <View>
          <ActivityIndicator size="large" style={styles.loading} />
        </View>
      )}
      renderItem={renderTrack}
    />
  );
}

export function TrackListSheet(props: TrackListProps) {
  return (
    <Portal>
      <BottomSheetPaper
        bottomSheetRef={props.bottomSheetRef}
      >
        <TrackList {...props} />
      </BottomSheetPaper>
    </Portal>
  );
}

const styles = StyleSheet.create({
  loading: {
    marginTop: '20%',
  },
  trackList: {
    height: '100%',
  },
});
