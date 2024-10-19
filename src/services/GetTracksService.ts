import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Sentry from '@sentry/react-native';
import { ToastAndroid } from 'react-native';
import TrackPlayer, { Track } from 'react-native-track-player';
import { SongAlbum } from '../types/albumDetail';
import type { Track as TrackData } from '../types/playlist';
import { Artist } from '../types/songDetail';
import { fetchSearchResults } from '../utils/fetchSearchResults';
import { fetchTrackDetails } from '../utils/fetchTrackDetails';
import { StorageKeys } from '../utils/storageKeys';

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

export const getTracks = async (keyword?: string): Promise<Track[]> => {
  try {
    let songs: TrackData[] = [];

    if (!keyword) {
      const storedFavs = await AsyncStorage.getItem(StorageKeys.Favs);
      if (!storedFavs) {
        const storedKeyword = await AsyncStorage.getItem(StorageKeys.Keyword);
        keyword = storedKeyword ? storedKeyword : 'One Republic';
      } else {
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
