import { useNavigation } from '@react-navigation/native';
import React, { useCallback } from 'react';
import { StyleSheet, View } from 'react-native';
import { List, Text, useTheme } from 'react-native-paper';
import type { ListLRProps } from '../types/paperListItem';
import type { Playlist } from '../types/searchPlaylist';

export const PlaylistItem = (
  { item }: { item: Playlist }
) => {
  const navigation = useNavigation();
  const appTheme = useTheme();

  const renderImg = useCallback(
    (props: ListLRProps) => (
      <View>
        <List.Image
          {...props}
          style={[props.style, {
            borderTopRightRadius: appTheme.roundness,
            borderBottomRightRadius: appTheme.roundness,
          }]}
          variant="video"
          source={{ uri: item.coverImgUrl }}
        />
        <Text style={[styles.plays, {
          borderRadius: appTheme.roundness,
        }]}>
          ▶️ {item.playCount.toLocaleString()}
        </Text>
      </View>
    ), [appTheme, item]);

  return (
    <List.Item
      title={item.name}
      titleNumberOfLines={2}
      description={item.description}
      left={renderImg}
      onPress={() => {
        //@ts-expect-error
        navigation.push('PlaylistDetail', {
          playlistID: item.id,
          name: item.name,
        });
      }}
    />
  );
};

const styles = StyleSheet.create({
  plays: {
    position: 'absolute',
    top: 0,
    right: 0,
    fontSize: 12,
    backgroundColor: 'rgba(0,0,0,0.5)',
    paddingHorizontal: 3,
    color: 'white',
  },
});
