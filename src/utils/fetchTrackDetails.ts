import * as Sentry from '@sentry/react-native';
import { Track } from 'react-native-track-player';
import { fetchPlus, requestInit } from '../services';
import { Main as SongDetail } from '../types/songDetail';

export const fetchTrackDetails = async (trackId: string): Promise<Track | null> => {
    const detail = await fetchPlus(
        `https://music.163.com/api/song/detail/?id=${trackId}&ids=%5B${trackId}%5D`,
        requestInit,
    );
    const detailJson: SongDetail = await detail.json();

    if (detailJson.code !== 200) {
        const errMsg = `Failed to fetch track(${trackId}) details: ${detailJson.code} ${detailJson.msg}`;
        Sentry.captureMessage(errMsg, 'log');

        return null;
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
