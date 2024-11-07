import React, { useCallback, useMemo, useRef, useState } from 'react';
import { RefreshControl, StyleSheet } from 'react-native';
import * as Animatable from 'react-native-animatable';
import DraggableFlatList, {
  type RenderItemParams,
} from 'react-native-draggable-flatlist';
import {
  ActivityIndicator,
  Divider,
  Text,
  useTheme,
} from 'react-native-paper';
import useSWRInfinite from 'swr/infinite';
import { useDebounce } from '../hook';
import { HotAlbum } from '../types/albumArtist';
import { Main, Song } from '../types/albumDetail';
import { songToTrack } from '../utils';
import { DraggableItem } from './DraggableSongItem';
import { LottieAnimation } from './LottieAnimation';
import { AddToQueueButton } from './QuickActions';
import { SongItem } from './SongItem';
import { SwipeableUnderlay } from './SwipeableUnderlay';

export function AlbumContent({ album }: { album: HotAlbum }) {
  const appTheme = useTheme();
  const itemRefs = useRef(new Map<string, Song>());

  const [refreshing, setRefreshing] = useState(false);

  const { data, error, setSize, mutate } = useSWRInfinite<Main>((index) =>
    `http://music.163.com/api/album/${album.id}?ext=true&offset=${index * 10}&total=true&limit=10`,
  );

  const hasMore = useMemo(() =>
    data && data[0].album.size !== data.flatMap(
      (d) => d.album.songs
    ).length,
    [data]
  );

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await mutate();
    setRefreshing(false);
    // no mutate
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const loadMore = useDebounce(() => {
    if (hasMore) {
      setSize(prev => prev + 1);
    }
  });

  const renderUnderlayLeft = useCallback(() => (
    <SwipeableUnderlay
      mode="left"
      backgroundColor={appTheme.colors.surfaceVariant}
    >
      <AddToQueueButton />
    </SwipeableUnderlay>
  ), [appTheme]);

  const showData = useMemo(() => (
    data?.flatMap((d) => d.album.songs) || []
  ), [data]);

  const renderItem = useCallback((
    { getIndex, item }: RenderItemParams<Song>
  ) => {
    const songItem = songToTrack(item);
    const index = getIndex() || 0;

    return (
      <Animatable.View
        animation={
          showData.length < 20
            ? 'fadeIn' : undefined
        }
        duration={500}
        delay={index * 100}
        useNativeDriver
      >
        <DraggableItem
          item={songItem}
          itemRefs={itemRefs}
          renderUnderlayLeft={renderUnderlayLeft}
        >
          <SongItem
            index={index}
            item={songItem}
            showIndex
          />
        </DraggableItem>
      </Animatable.View>
    );
  }, [renderUnderlayLeft, showData.length]);

  const keyExtractor = useCallback(
    (item: Song) => item.id.toString(), []
  );

  if (error) {
    return (
      <LottieAnimation
        animation="breathe"
        caption="Try to refresh later"
      >
        <Text style={[
          styles.error,
          { color: appTheme.colors.error },
        ]}>
          Error: {error.message}
        </Text>
      </LottieAnimation>
    );
  }

  return (
    <DraggableFlatList
      data={showData}
      keyExtractor={keyExtractor}
      initialNumToRender={10}
      containerStyle={[styles.container, {
        backgroundColor: appTheme.colors.surface,
      }]}
      renderItem={renderItem}
      onEndReached={loadMore}
      ListFooterComponent={
        !error && hasMore ? (
          <ActivityIndicator style={styles.moreLoading} />
        ) : null
      }
      refreshing={refreshing}
      onRefresh={onRefresh}
      refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={onRefresh}
          colors={[appTheme.colors.primary]}
          progressBackgroundColor={appTheme.colors.surface}
        />
      }
      ItemSeparatorComponent={Divider}
      ListEmptyComponent={
        <ActivityIndicator
          size="large"
          style={styles.loading}
        />
      }
      activationDistance={20}
    />
  );
}

const styles = StyleSheet.create({
  loading: {
    marginTop: '40%',
  },
  moreLoading: {
    marginVertical: '2%',
  },
  container: {
    flex: 1,
  },
  error: {
    textAlign: 'center',
  },
});
