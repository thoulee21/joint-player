import fetchRetry from 'fetch-retry';
import { ToastAndroid } from 'react-native';
import TrackPlayer, { Track } from 'react-native-track-player';
import UserAgent from 'user-agents';
import playlistData from '../assets/data/playlist.json';
import type { Track as TrackData } from '../types/playlist';

export const randomUserAgent = new UserAgent({ deviceCategory: 'mobile' });
export const fetchPlus = fetchRetry(fetch, { retries: 3, retryDelay: 1000 });

export const requestInit = {
  headers: {
    'User-Agent': randomUserAgent.toString(),
    'Accept':
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

  const fetchResult = await fetchPlus(
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
  const detail = await fetchPlus(
    `https://music.163.com/api/song/detail/?id=${trackId}&ids=%5B${trackId}%5D`,
    requestInit,
  );
  const detailJson = await detail.json();

  if (detailJson.code !== 200 && __DEV__) {
    ToastAndroid.show(
      `Failed to fetch track details: ${detailJson.code} ${detailJson.msg}`,
      ToastAndroid.SHORT
    );
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

export const addTracks = async (keyword?: string): Promise<void> => {
  try {
    let songs: TrackData[] = [];

    if (keyword) {
      const data = await fetchSearchResults(keyword);
      songs = data.songs;

    } else {
      throw new Error('No keyword provided');
    }

    const fetchedData = await Promise.all(
      songs.map(async (track: TrackData) => {
        return await fetchTrackDetails(track.id.toString());
      }),
    );

    await TrackPlayer.reset();
    await TrackPlayer.add(fetchedData);
  }
  catch {
    // Fallback to local playlist if network request fails
    await TrackPlayer.reset();
    await TrackPlayer.add(playlistData as Track[]);
  }
};