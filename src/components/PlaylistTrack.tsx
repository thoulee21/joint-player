import React, { useCallback, useMemo, useRef } from 'react';
import type {
  RenderItemParams,
} from 'react-native-draggable-flatlist';
import { useTheme } from 'react-native-paper';
import type { TrackType } from '../services/GetTracksService';
import type { SongAlbum } from '../types/albumDetail';
import type { Track } from '../types/playlistDetail';
import { DraggableItem } from './DraggableSongItem';
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

export const PlaylistTrack = ({
  item, getIndex, isActive,
}: RenderItemParams<Track>
) => {
  const appTheme = useTheme();
  const itemRefs = useRef(new Map());

  const index = useMemo(
    () => getIndex() || 0, [getIndex]
  );
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
    <DraggableItem
      item={track}
      itemRefs={itemRefs}
      renderUnderlayLeft={renderUnderlayLeft}
    >
      <SongItem
        item={track}
        index={index}
        showAlbum
        isActive={isActive}
      />
    </DraggableItem>
  );
};
