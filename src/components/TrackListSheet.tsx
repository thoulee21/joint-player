import BottomSheet, { BottomSheetFlatList } from '@gorhom/bottom-sheet';
import Color from 'color';
import React, { useEffect, useState } from 'react';
import { StyleSheet, TextStyle, View } from 'react-native';
import { ActivityIndicator, List, useTheme } from 'react-native-paper';
import TrackPlayer, { Track, useActiveTrack } from 'react-native-track-player';
import { BottomSheetPaper } from '.';
import playlistData from '../assets/data/playlist.json';

function TrackList({ bottomSheetRef }:
  { bottomSheetRef: React.RefObject<BottomSheet> }
) {
  const appTheme = useTheme();
  const currentTrack = useActiveTrack();

  const [tracks, setTracks] = useState<Track[]>([]);

  useEffect(() => {
    async function getQueue() {
      const queue = await TrackPlayer.getQueue();
      if (queue) {
        setTracks(queue);
      }
    }

    getQueue();
  }, [currentTrack]);

  const renderTrack = ({ item, index }: { item: Track; index: number }) => {
    const active = currentTrack?.url === item.url;
    const titleStyle: TextStyle = {
      color: active
        ? appTheme.colors.primary
        : appTheme.colors.onBackground,
      fontWeight: active ? 'bold' : 'normal',
    };

    return (
      <List.Item
        title={item.title}
        description={item.artist}
        titleStyle={titleStyle}
        style={{
          backgroundColor:
            active
              ? Color(appTheme.colors.secondaryContainer)
                .fade(appTheme.dark ? 0.4 : 0.6).string()
              : undefined,
        }}
        left={props => (
          <List.Icon
            {...props}
            color={active ? appTheme.colors.primary : undefined}
            icon={active ? 'music-circle' : 'music-circle-outline'}
          />
        )}
        onPress={async () => {
          await TrackPlayer.skip(index);
          await TrackPlayer.play();
          bottomSheetRef.current?.close();
        }}
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

export function TrackListSheet({
  bottomSheetRef,
}: {
  bottomSheetRef: React.RefObject<BottomSheet>;
}) {
  return (
    <BottomSheetPaper
      bottomSheetRef={bottomSheetRef}
    >
      <TrackList bottomSheetRef={bottomSheetRef} />
    </BottomSheetPaper>
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
