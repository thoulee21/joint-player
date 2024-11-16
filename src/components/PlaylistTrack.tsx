import React, { useCallback, useMemo, useRef } from 'react';
import { useTheme } from 'react-native-paper';
import type { TrackType } from '../services/GetTracksService';
import type { SongAlbum } from '../types/albumDetail';
import type { Track } from '../types/playlistDetail';
import { SwipeableItemWrapper } from './SwipeableItemWrapper';
import { AddToQueueButton } from './QuickActions';
import { SongItem } from './SongItem';
import { SwipeableUnderlay } from './SwipeableUnderlay';

export const raw2TrackType = (track: Track): TrackType => ({
  id: track.id.toString(),
  url: `https://music.163.com/song/media/outer/url?id=${track.id}.mp3`,
  title: track.name,
  artist: track.artists.map(ar => ar.name).join(', '),
  artists: track.artists,
  artwork: track.album.picUrl,
  duration: track.duration / 1000,
  album: track.album.name,
  albumRaw: track.album as unknown as SongAlbum,
  mvid: track.mvid,
});

export const PlaylistTrack = ({ item, index }: {
  item: Track, index: number
}) => {
  const appTheme = useTheme();
  const itemRefs = useRef(new Map());

  const track = useMemo(
    () => raw2TrackType(item), [item]
  );

  const renderUnderlayLeft = useCallback(() => (
    <SwipeableUnderlay
      mode="left"
      backgroundColor={appTheme.colors.surfaceVariant}
    >
      <AddToQueueButton />
    </SwipeableUnderlay>
  ), [appTheme]);

  return (
    <SwipeableItemWrapper
      item={track}
      itemRefs={itemRefs}
      renderUnderlayLeft={renderUnderlayLeft}
    >
      <SongItem
        item={track}
        index={index}
        showAlbum
      />
    </SwipeableItemWrapper>
  );
};
