import BottomSheet, { BottomSheetFlatList } from '@gorhom/bottom-sheet';
import React, { useCallback, useEffect } from 'react';
import { StyleSheet, View } from 'react-native';
import { Portal, Text } from 'react-native-paper';
import TrackPlayer, { useActiveTrack } from 'react-native-track-player';
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

  const renderTrack = useCallback(({ item, index }:
    { item: TrackType; index: number }
  ) => {
    return (
      <TrackItem
        item={item}
        index={index}
        navigation={navigation}
        bottomSheetRef={bottomSheetRef}
      />
    );
  }, [bottomSheetRef, navigation]);

  return (
    <BottomSheetFlatList
      style={styles.root}
      showsVerticalScrollIndicator={false}
      keyExtractor={(item) => item.id.toString()}
      data={tracks}
      ListEmptyComponent={() => (
        <View style={styles.noTracks}>
          <Text variant="headlineSmall">
            No tracks
          </Text>
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
  root: {
    flex: 1,
  },
  noTracks: {
    flex: 1,
    alignItems: 'center',
    marginTop: '20%'
  },
});
