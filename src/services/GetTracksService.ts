import * as Sentry from "@sentry/react-native";
import { ToastAndroid } from "react-native";
import TrackPlayer, { Track } from "react-native-track-player";
import { SongAlbum } from "../types/albumDetail";
import type { Track as TrackData } from "../types/playlist";
import { Artist } from "../types/songDetail";
import { fetchSearchResults } from "../utils/fetchSearchResults";
import { fetchTrackDetails } from "../utils/fetchTrackDetails";
import { rootLog } from "../utils/logger";
import { storage } from "../utils/reduxPersistMMKV";

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

export const getTracks = async (keyword: string): Promise<Track[]> => {
  try {
    let songs: TrackData[] = [];

    const storedRoot = JSON.parse(storage.getString("persist:root") || "");
    const storedQueue = JSON.parse(storedRoot.queue).value;

    if (storedQueue.length) {
      //if queue exist, add them to the queue
      const queue = storedQueue as TrackType[];
      await TrackPlayer.add(queue);
      rootLog.info("Restored queue from storage");
      return queue;
    } else {
      //if queue isn't exist, fetch the search results
      const data = await fetchSearchResults(keyword as string);
      songs = data.songs;

      const fetchedDataRaw = await Promise.all(
        songs.map(async (track: TrackData) => {
          return await fetchTrackDetails(track.id.toString());
        }),
      );
      const fetchedData = fetchedDataRaw.filter(
        (track): track is Track => track !== null,
      );
      if (fetchedDataRaw.length !== fetchedData.length) {
        ToastAndroid.show(
          `Some tracks failed to fetch ${fetchedData.length}/${fetchedDataRaw.length}`,
          ToastAndroid.SHORT,
        );
      }

      await TrackPlayer.setQueue(fetchedData);
      rootLog.info("Restored queue from search results", keyword);
      return fetchedData;
    }
  } catch (e) {
    Sentry.captureException(e);
    return [];
  }
};
