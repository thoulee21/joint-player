import React, { useCallback, useMemo, useState } from 'react';
import { FlatList, RefreshControl, StyleSheet } from 'react-native';
import { ActivityIndicator, Text, useTheme } from 'react-native-paper';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import useSWRInfinite from 'swr/infinite';
import { useDebounce } from '../hook';
import { HotAlbum, Main } from '../types/albumArtist';
import { Album } from './AlbumItem';

export function Albums({ artistID }: { artistID: number }) {
  const insets = useSafeAreaInsets();
  const appTheme = useTheme();
  const [refreshing, setRefreshing] = useState(false);

  const {
    data, error, isLoading, setSize, size, mutate
  } = useSWRInfinite<Main>(
    (index) =>
      `http://music.163.com/api/artist/albums/${artistID}?offset=${index * 10}&limit=10&total=true`,
  );

  const loadMore = useDebounce(() => setSize(size + 1));

  const onRefresh = async () => {
    setRefreshing(true);
    await mutate();
    setRefreshing(false);
  };

  const renderItem = useCallback((
    { item }: { item: HotAlbum }
  ) => (
    <Album item={item} />
  ), []);

  const renderLoading = useCallback(() => {
    if (!isLoading && !error && data && data[data.length - 1].more) {
      return <ActivityIndicator style={styles.moreLoading} />;
    }
  }, [isLoading, error, data]);

  const showData = useMemo(() => (
    data?.flatMap((page) => page.hotAlbums)
  ), [data]);

  const keyExtractor = useCallback(
    (item: HotAlbum) => item.id.toString(), []
  );

  if (error) {
    return (
      <Text style={{
        color: appTheme.colors.error
      }}>
        Error: {error.message}
      </Text>
    );
  }

  return (
    <FlatList
      data={showData}
      numColumns={2}
      fadingEdgeLength={10}
      keyExtractor={keyExtractor}
      renderItem={renderItem}
      onEndReached={loadMore}
      ListFooterComponent={renderLoading}
      refreshing={refreshing}
      onRefresh={onRefresh}
      refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={onRefresh}
          progressViewOffset={insets.top}
          colors={[appTheme.colors.primary]}
          progressBackgroundColor={appTheme.colors.surface}
        />
      }
    />
  );
}

const styles = StyleSheet.create({
  moreLoading: {
    marginVertical: '2%',
  },
});
