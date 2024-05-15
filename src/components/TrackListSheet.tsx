import BottomSheet, { BottomSheetFlatList } from '@gorhom/bottom-sheet';
import React, { useEffect, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { ActivityIndicator, Portal } from 'react-native-paper';
import TrackPlayer, { Track, useActiveTrack } from 'react-native-track-player';
import { BottomSheetPaper, TrackItem } from '.';
import playlistData from '../assets/data/playlist.json';

interface TrackListProps {
  bottomSheetRef: React.RefObject<BottomSheet>;
  navigation: any;
}

function TrackList({
  bottomSheetRef, navigation
}: TrackListProps) {
  const currentTrack = useActiveTrack();
  const [tracks, setTracks] = useState<Track[]>([]);

  useEffect(() => {
    async function getQueue() {
      try {
        const queue = await TrackPlayer.getQueue();
        if (queue) {
          setTracks(queue);
        }
      } catch { } // ignore player errors
    }
    getQueue();
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
      // Use playlistData as a fallback
      data={tracks.length > 0 ? tracks : (playlistData as Track[])}
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
