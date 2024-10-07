import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Sentry from '@sentry/react-native';
import fetchRetry from 'fetch-retry';
import { ToastAndroid } from 'react-native';
import TrackPlayer, { Track } from 'react-native-track-player';
import UserAgent from 'user-agents';
import { StorageKeys } from '../App';
import { SongAlbum } from '../types/albumDetail';
import type { Track as TrackData } from '../types/playlist';
import { Artist } from '../types/songDetail';
import { fetchSearchResults, fetchTrackDetails } from '../utils';

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

const randomUserAgent = new UserAgent({ deviceCategory: 'mobile' });
export const fetchPlus = fetchRetry(fetch, { retries: 3, retryDelay: 1000 });

export const requestInit = {
  headers: {
    'User-Agent': randomUserAgent.toString(),
    'Accept':
      'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7',
  },
};

export const getTracks = async (keyword?: string): Promise<Track[]> => {
  try {
    let songs: TrackData[] = [];

    if (!keyword) {
      const storedFavs = await AsyncStorage.getItem(StorageKeys.Favs);
      if (!storedFavs) {
        const storedKeyword = await AsyncStorage.getItem(StorageKeys.Keyword);
        //restore last keyword
        keyword = storedKeyword ? storedKeyword : 'One Republic';
      } else {
        //restore favs
        const favs = JSON.parse(storedFavs) as TrackType[];
        await TrackPlayer.add(favs);
        return favs;
      }
    }
    const data = await fetchSearchResults(keyword);
    songs = data.songs;

    const fetchedDataRaw = await Promise.all(
      songs.map(async (track: TrackData) => {
        return await fetchTrackDetails(track.id.toString());
      }),
    );
    const fetchedData = fetchedDataRaw.filter(
      (track): track is Track => track !== null
    );
    if (fetchedDataRaw.length !== fetchedData.length) {
      ToastAndroid.show(
        `Some tracks failed to fetch ${fetchedData.length}/${fetchedDataRaw.length}`,
        ToastAndroid.SHORT
      );
    }

    await TrackPlayer.reset();
    await TrackPlayer.add(fetchedData);
    return fetchedData;
  }
  catch (e) {
    Sentry.captureException(e);
    return [];
  }
};
