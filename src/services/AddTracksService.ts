import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Sentry from '@sentry/react-native';
import fetchRetry from 'fetch-retry';
import { ToastAndroid } from 'react-native';
import TrackPlayer, { Track } from 'react-native-track-player';
import UserAgent from 'user-agents';
import { StorageKeys } from '../App';
import { SongAlbum } from '../types/albumDetail';
import type { Track as TrackData } from '../types/playlist';
import { Artist, Main as SongDetail } from '../types/songDetail';

export interface TrackType {
  id: string;
  url: string;
  title: string;
  artist: string;
  artists: Artist[];
  artwork: string;
  duration: number;
  album: string;
  albumRaw: SongAlbum;
  mvid: number;
}

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
  const detailJson: SongDetail = await detail.json();

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
    artist: track.artists.map(ar => ar.name).join(', '),
    artists: track.artists,
    artwork: track.album.picUrl,
    duration: track.duration / 1000,
    album: track.album.name,
    albumRaw: track.album,
    mvid: track.mvid,
  };
};

export const addTracks = async (keyword?: string): Promise<Track[] | void> => {
  try {
    let songs: TrackData[] = [];

    if (!keyword) {
      const storedKeyword = await AsyncStorage.getItem(StorageKeys.Keyword);
      if (storedKeyword) {
        ToastAndroid.show('Restored keyword', ToastAndroid.SHORT);
      }
      keyword = storedKeyword ? storedKeyword : 'One Republic';
    }
    const data = await fetchSearchResults(keyword);
    songs = data.songs;

    const fetchedData = await Promise.all(
      songs.map(async (track: TrackData) => {
        return await fetchTrackDetails(track.id.toString());
      }),
    );

    await TrackPlayer.reset();
    await TrackPlayer.add(fetchedData);
    return fetchedData;
  }
  catch (e) {
    Sentry.captureException(e);
  }
};
