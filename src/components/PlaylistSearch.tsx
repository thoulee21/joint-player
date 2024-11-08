import { FlashList, type ListRenderItemInfo } from '@shopify/flash-list';
import React, { useCallback, useMemo, useState } from 'react';
import { RefreshControl, StyleSheet, useWindowDimensions } from 'react-native';
import { ActivityIndicator, List, Tooltip, useTheme } from 'react-native-paper';
import useSWRInfinite from 'swr/infinite';
import type { Main, Playlist } from '../types/searchPlaylist';
import { LottieAnimation } from './LottieAnimation';
import { PlaylistItem } from './SearchPlaylistItem';

export const PlaylistSearch = ({ keyword }: { keyword: string }) => {
  const appTheme = useTheme();
  const window = useWindowDimensions();
  const [refreshing, setRefreshing] = useState(false);

  const {
    data, isLoading, error, mutate, setSize,
  } = useSWRInfinite<Main>((index) => {
    const limit = 20;
    const offset = index * limit;

    return (
      `http://music.163.com/api/search/get/web?csrf_token=hlpretag=&hlposttag=&s=${keyword}&type=1000&offset=${offset}&total=true&limit=${limit}`
    );
  }
  );

  const showData = useMemo(() => (
    data?.flatMap(
      (d) => d.result.playlists || []
    ) || []
  ), [data]);

  const renderItem = useCallback((
    props: ListRenderItemInfo<Playlist>
  ) => (
    <Tooltip title={props.item.id.toString()}>
      <PlaylistItem {...props} />
    </Tooltip>
  ), []);

  const onEndReached = useCallback(() => {
    setSize(prev => prev + 1);
  }, [setSize]);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await mutate();
    setRefreshing(false);
  }, [mutate]);

  if (isLoading) {
    return (
      <ActivityIndicator
        style={styles.loading}
        size="large"
      />
    );
  }

  if (error) {
    return (
      <LottieAnimation
        animation="breathe"
      >
        <List.Item
          title="Failed to load"
          description={error.message}
        />
      </LottieAnimation>
    );
  }

  return (
    <FlashList
      data={showData}
      renderItem={renderItem}
      estimatedItemSize={92}
      onEndReachedThreshold={0.1}
      onEndReached={onEndReached}
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
      fadingEdgeLength={100}
      ListEmptyComponent={
        !isLoading ? (
          <LottieAnimation
            animation="teapot"
            caption="No playlist found"
            style={{
              height: window.height / 1.1,
              width: window.width,
            }}
          />
        ) : null
      }
      ListFooterComponent={
        showData.length !== (
          data?.[data.length - 1]?.result.playlistCount ?? 0
        ) ? (
          <ActivityIndicator
            style={showData?.length
              ? styles.footerLoading
              : styles.loading}
            size={showData?.length
              ? 'small' : 'large'}
          />
        ) : null
      }
    />
  );
};

const styles = StyleSheet.create({
  footerLoading: {
    margin: '5%',
  },
  loading: {
    marginTop: '50%',
  },
});
