import { FlashList } from '@shopify/flash-list';
import React, { useCallback, useMemo, useState } from 'react';
import { Dimensions, RefreshControl, StyleSheet, View } from 'react-native';
import { ActivityIndicator, Text, useTheme } from 'react-native-paper';
import useSWRInfinite from 'swr/infinite';
import type { Main, Song } from '../types/searchSongs';
import { LottieAnimation } from './LottieAnimation';
import { SearchSongItem } from './SearchSongItem';

const Type = 1;
const itemsPerPage = 15;

export const SearchSongList = ({ keyword }: { keyword: string }) => {
  const appTheme = useTheme();
  const [refreshing, setRefreshing] = useState(false);

  const {
    data, error, isLoading, mutate, setSize,
  } = useSWRInfinite<Main>((index) => {
    const Offset = index * itemsPerPage;
    const Limit = itemsPerPage;
    return (
      `https://music.163.com/api/search/get/web?csrf_token=hlpretag=&hlposttag=&s=${keyword}&type=${Type}&offset=${Offset}&total=true&limit=${Limit}`
    );
  });

  const showData = useMemo(() => {
    const notFound = data?.map(
      (item) => item.result.songCount
    ).reduce(
      (a, b) => a + b, 0
    ) === 0;

    if (!notFound) {
      return data?.flatMap(
        (item) => item.result.songs
      ) || [];
    } else { return []; }
  }, [data]);

  const loadMore = useCallback(() => {
    setSize((prev) => prev + 1);
  }, [setSize]);

  const keyExtractor = useCallback(
    (item: Song) => item.id.toString(), []
  );

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await mutate();
    setRefreshing(false);
    // no mutate
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const renderItem = useCallback((
    props: { index: number, item: Song }
  ) => (
    <SearchSongItem {...props} />
  ), []);

  const renderEmpty = useCallback(() => (
    <View style={styles.root}>
      {isLoading
        ? <ActivityIndicator size="large" style={styles.loading} />
        : <LottieAnimation caption="No songs found" animation="teapot" />}
    </View>
  ), [isLoading]);

  return (
    !error ? (
      <FlashList
        data={showData}
        keyExtractor={keyExtractor}
        renderItem={renderItem}
        onEndReachedThreshold={0.1}
        onEndReached={loadMore}
        refreshing={refreshing}
        onRefresh={onRefresh}
        fadingEdgeLength={100}
        estimatedItemSize={84}
        ListEmptyComponent={renderEmpty}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={[appTheme.colors.primary]}
            progressBackgroundColor={appTheme.colors.surface}
          />
        }
      />
    ) : (
      <LottieAnimation
        caption={error.message}
        animation="breathe"
      >
        <Text
          variant="bodyLarge"
          style={[styles.errTxt, {
            color: appTheme.colors.error,
          }]}
        >
          Failed to load songs
        </Text>
      </LottieAnimation>
    )
  );
};

const styles = StyleSheet.create({
  root: {
    height: Dimensions.get('window').height - 84,
    width: Dimensions.get('window').width,
  },
  loading: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errTxt: {
    textAlign: 'center',
  },
});