import BottomSheet, {
  BottomSheetFlatList
} from '@gorhom/bottom-sheet';
import React from 'react';
import { StyleSheet, View } from 'react-native';
import { ActivityIndicator, Portal } from 'react-native-paper';
import { Track } from 'react-native-track-player';
import { BottomSheetPaper, TrackItem } from '.';
import { useAppSelector } from '../hook';
import { queue } from '../redux/slices';

interface TrackListProps {
  bottomSheetRef: React.RefObject<BottomSheet>;
  navigation: any;
}

function TrackList({
  bottomSheetRef, navigation
}: TrackListProps) {
  const tracks = useAppSelector(queue);

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
      keyExtractor={(item) => item.id.toString()}
      data={tracks}
      ListEmptyComponent={() => (
        <View>
          <ActivityIndicator
            size="large"
            style={styles.loading}
          />
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
