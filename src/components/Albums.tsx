import {
  FlatListWithHeaders,
  LargeHeader,
  ScalingView,
  type ScrollHeaderProps,
  type ScrollLargeHeaderProps,
} from '@codeherence/react-native-header';
import React, { useCallback, useMemo, useState } from 'react';
import { RefreshControl, StyleSheet, View } from 'react-native';
import { ActivityIndicator, Chip, Text, useTheme } from 'react-native-paper';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import useSWRInfinite from 'swr/infinite';
import { useDebounce } from '../hook';
import { HotAlbum, Main } from '../types/albumArtist';
import { Album } from './AlbumItem';
import { HeaderComponent } from './AnimatedHeader';
import { ArtistHeader } from './ArtistHeader';
import { HeaderSurface } from './HeaderSurface';

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

  const renderHeader = useCallback((
    props: ScrollHeaderProps
  ) => (
    <HeaderComponent
      {...props}
      title={data?.[0].artist.name || 'Artist'}
      SurfaceComponent={HeaderSurface}
      noBottomBorder
      headerStyle={[
        styles.elevated,
        { height: 64 + insets.top }
      ]}
    />
  ), [data, insets.top]);

  const renderLargeHeader = useCallback((
    { scrollY }: ScrollLargeHeaderProps
  ) => (
    <LargeHeader>
      <ScalingView scrollY={scrollY}>
        <ArtistHeader artist={data?.[0].artist} />

        <View style={styles.chips}>
          <Chip style={styles.chip} selected>Albums</Chip>
          <View style={styles.attrs}>
            <Chip icon="album" compact>
              {data?.[0].artist.albumSize}
            </Chip>
            <Chip icon="music" compact>
              {data?.[0].artist.musicSize}
            </Chip>
          </View>
        </View>
      </ScalingView>
    </LargeHeader>
  ), [data]);

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
    <FlatListWithHeaders
      LargeHeaderComponent={renderLargeHeader}
      HeaderComponent={renderHeader}
      disableAutoFixScroll
      absoluteHeader
      data={showData}
      numColumns={2}
      columnWrapperStyle={styles.columnWrapper}
      contentInset={insets}
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
  chips: {
    flexDirection: 'row',
    width: '100%',
    justifyContent: 'space-between',
  },
  chip: {
    marginVertical: '1%',
  },
  attrs: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '40%',
    justifyContent: 'space-between',
  },
  elevated: {
    elevation: 5,
  },
  columnWrapper: {
    justifyContent: 'space-evenly',
  }
});
