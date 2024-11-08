import type { ListRenderItemInfo } from '@shopify/flash-list';
import React, { useCallback } from 'react';
import { View, StyleSheet } from 'react-native';
import { List, Text, useTheme } from 'react-native-paper';
import type { ListLRProps } from '../types/paperListItem';
import type { Playlist } from '../types/searchPlaylist';

export const PlaylistItem = ({ item }:
  ListRenderItemInfo<Playlist>
) => {
  const appTheme = useTheme();

  const renderImg = useCallback(
    (props: ListLRProps) => (
      <View {...props}>
        <List.Image
          {...props}
          style={{ borderRadius: appTheme.roundness }}
          variant="video"
          source={{ uri: item.coverImgUrl }}
        />
        <Text style={[styles.plays, {
          borderRadius: appTheme.roundness,
        }]}>
          {item.playCount.toLocaleString()} plays
        </Text>
      </View>
    ), [appTheme, item]);

  const renderCount = useCallback(
    (props: ListLRProps) => (
      <Text {...props}>
        {item.trackCount.toLocaleString()}
      </Text>
    ), [item]);

  return (
    <List.Item
      title={item.name}
      description={
        `by ${item.creator.nickname}\n${item.description || ''}`
      }
      descriptionNumberOfLines={2}
      left={renderImg}
      right={renderCount}
    />
  );
};

const styles = StyleSheet.create({
  plays: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    fontSize: 12,
    backgroundColor: 'rgba(0,0,0,0.5)',
    paddingHorizontal: 3,
  },
});
