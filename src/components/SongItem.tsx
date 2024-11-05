import Color from 'color';
import React, { useCallback, useMemo } from 'react';
import { ViewStyle } from 'react-native';
import HapticFeedback, {
  HapticFeedbackTypes,
} from 'react-native-haptic-feedback';
import { IconButton, List, useTheme } from 'react-native-paper';
import TrackPlayer from 'react-native-track-player';
import { useAppDispatch } from '../hook';
import { clearAddOneAsync } from '../redux/slices';
import { TrackType } from '../services/GetTracksService';
import type { ListLRProps } from '../types/paperListItem';
import { IndexOfSong } from './IndexOfSong';

export const SongItem = ({
  item,
  index,
  style,
  showAlbum,
  showIndex,
  drag,
  isActive,
}: {
  item: TrackType,
  index: number,
  style?: ViewStyle,
  showAlbum?: boolean,
  showIndex?: boolean,
  drag?: () => void,
  isActive?: boolean,
}) => {
  const dispatch = useAppDispatch();
  const appTheme = useTheme();

  const songStyle = useMemo(() => ([
    style, {
      backgroundColor: isActive
        ? Color(appTheme.colors.secondaryContainer)
          .fade(0.1).string()
        : appTheme.colors.surface,
    }]
  ), [style, isActive, appTheme]);

  const play = useCallback(async () => {
    HapticFeedback.trigger(
      HapticFeedbackTypes.effectHeavyClick
    );
    await dispatch(clearAddOneAsync(item));
    await TrackPlayer.play();
    //no dispatch
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [item]);

  const renderIndex = useCallback((
    props: ListLRProps
  ) => (
    <IndexOfSong {...props} index={index} />
  ), [index]);

  const description = useMemo(() => {
    const artists = item.artists
      .map(ar => ar.name)
      .join(', ');

    if (showAlbum) {
      return artists.concat('\n', item.album);
    } else {
      return artists;
    }
  }, [item.album, item.artists, showAlbum]);

  const renderMusicImage = useCallback(
    ({ color, style: listStyle }: ListLRProps) => (
      <List.Image
        style={[listStyle, {
          borderRadius: appTheme.roundness,
          backgroundColor: color,
        }]}
        source={{ uri: item.artwork }}
      />
    ), [appTheme.roundness, item.artwork]);

  const renderDragIndicator = useCallback(
    (props: ListLRProps) => (
      drag && <IconButton
        {...props}
        icon="drag"
        size={24}
        onLongPress={drag}
      />
    ), [drag]);

  return (
    <List.Item
      title={item.title}
      left={showIndex ? renderIndex : renderMusicImage}
      right={renderDragIndicator}
      description={description}
      descriptionNumberOfLines={2}
      onPress={play}
      style={songStyle}
    />
  );
};
