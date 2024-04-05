import TrackPlayer, { Track } from 'react-native-track-player';

import playlistData from '../assets/data/playlist.json';

// const PlaylistID = 2279582982;

export const QueueInitialTracksService = async (): Promise<void> => {
  // const result = await fetch(
  //   `https://music.163.com/api/playlist/detail?id=${PlaylistID}`,
  //   {
  //     headers: {
  //       'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36 Edg/124.0.0.0',
  //       'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7',
  //     },
  //   },
  // );
  // const data = await result.json();
  // console.log(data.code, data.message);
  // const fetchedPlaylistData = data.result?.tracks.map((track: any) => ({
  //   id: track.id.toString(),
  //   url: `https://music.163.com/song/media/outer/url?id=${track.id}.mp3`,
  //   title: track.name,
  //   artist: track.artists.map((ar: any) => ar.name).join(', '),
  //   artwork: track.album.picUrl,
  // }));

  await TrackPlayer.add([
    // ...fetchedPlaylistData,
    ...playlistData
  ] as Track[]);
};
