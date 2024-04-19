import { ToastAndroid } from 'react-native';
import TrackPlayer, { Track } from 'react-native-track-player';
import playlistData from '../assets/data/playlist.json';

export const requestInit = {
  headers: {
    'User-Agent':
      'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36 Edg/124.0.0.0',
    Accept:
      'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7',
  },
};

const fetchSearchResults = async (keyword: string): Promise<any> => {
  const { Type, Limit, Offset, Total } = {
    Type: 1,
    Limit: 20,
    Offset: 0,
    Total: true,
  };

  const fetchResult = await fetch(
    `https://music.163.com/api/search/get/web?csrf_token=hlpretag=&hlposttag=&s=${keyword}&type=${Type}&offset=${Offset}&total=${Total}&limit=${Limit}`,
    requestInit,
  );
  const { result } = await fetchResult.json();

  if (fetchResult.status !== 200) {
    ToastAndroid.show(
      `Failed to fetch search results: ${fetchResult.status} ${fetchResult.statusText}`,
      ToastAndroid.SHORT
    );
  }

  return result;
};

const fetchTrackDetails = async (trackId: string): Promise<Track> => {
  const detail = await fetch(
    `https://music.163.com/api/song/detail/?id=${trackId}&ids=%5B${trackId}%5D`,
    requestInit,
  );
  const detailJson = await detail.json();

  if (detailJson.code !== 200 && __DEV__) {
    ToastAndroid.show(
      `Failed to fetch track details: ${detailJson.code} ${detailJson.msg}`,
      ToastAndroid.SHORT
    )
  }

  const track = detailJson.songs[0];

  return {
    id: track.id.toString(),
    url: `https://music.163.com/song/media/outer/url?id=${track.id}.mp3`,
    title: track.name,
    artist: track.artists.map((ar: any) => ar.name).join(', '),
    artwork: track.album.picUrl,
    duration: track.duration / 1000,
    album: track.album.name,
    mvid: track.mvid,
  };
};

export const QueueInitialTracksService = async (
  keyword?: string,
): Promise<void> => {
  let data: any;

  if (keyword) {
    data = await fetchSearchResults(keyword);
  } else {
    // Startup with a predefined playlist
    await TrackPlayer.add(playlistData as Track[]);

    ToastAndroid.show(
      'Local playlist loaded',
      ToastAndroid.SHORT
    );
    return;
  }

  const fetchedData: Track[] = await Promise.all(
    data.songs.map(async (track: any) => {
      return await fetchTrackDetails(track.id.toString());
    }),
  );

  await TrackPlayer.reset();
  await TrackPlayer.add(fetchedData);
};
