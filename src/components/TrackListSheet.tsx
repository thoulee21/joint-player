import BottomSheet, { BottomSheetFlatList } from '@gorhom/bottom-sheet';
import Color from 'color';
import { BlurView } from 'expo-blur';
import React, { useEffect, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { ActivityIndicator, List, useTheme } from 'react-native-paper';
import TrackPlayer, { Track, useActiveTrack } from 'react-native-track-player';
import { BottomSheetPaper } from '.';
import playlistData from '../assets/data/playlist.json';

function TrackList() {
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
    return (
      <List.Item
        title={item.title}
        description={item.artist}
        titleStyle={{
          color: active
            ? appTheme.colors.secondary
            : appTheme.colors.onBackground,
        }}
        style={{
          backgroundColor:
            active
              ? Color(appTheme.colors.secondaryContainer)
                .fade(0.5).string()
              : undefined
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
  const appTheme = useTheme();

  return (
    <BottomSheetPaper bottomSheetRef={bottomSheetRef}>
      <BlurView
        style={styles.trackList}
        tint={appTheme.dark ? 'dark' : 'light'}
        experimentalBlurMethod="dimezisBlurView"
      >
        <TrackList />
      </BlurView>
    </BottomSheetPaper>
  );
}

const styles = StyleSheet.create({
  loading: {
    marginTop: '20%',
  },
  trackList: {
    height: '100%',
  }
});
