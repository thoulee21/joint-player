import React, { useCallback, useMemo } from 'react';
import { ViewStyle } from 'react-native';
import HapticFeedback, {
  HapticFeedbackTypes,
} from 'react-native-haptic-feedback';
import { List, useTheme } from 'react-native-paper';
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
  onLongPress,
  isActive,
}: {
  item: TrackType,
  index: number,
  style?: ViewStyle,
  showAlbum?: boolean,
  showIndex?: boolean,
  onLongPress?: () => void,
  isActive?: boolean,
}) => {
  const dispatch = useAppDispatch();
  const appTheme = useTheme();

  const songStyle = useMemo(() => ([
    style, {
      backgroundColor: isActive
        ? appTheme.colors.primaryContainer
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

  const renderIndex = useCallback((props: ListLRProps) => (
    showIndex && <IndexOfSong {...props} index={index} />
  ), [index, showIndex]);

  const description = useMemo(() => {
    const artists = item.artists
      .map(ar => ar.name)
      .join(', ');

    if (showAlbum) {
      return artists.concat(' - ', item.album);
    } else {
      return artists;
    }
  }, [item.album, item.artists, showAlbum]);

  return (
    <List.Item
      left={renderIndex}
      title={item.title}
      description={description}
      descriptionNumberOfLines={1}
      onPress={play}
      onLongPress={onLongPress}
      style={songStyle}
    />
  );
};
