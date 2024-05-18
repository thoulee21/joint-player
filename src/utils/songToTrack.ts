import { TrackType } from '../services';
import { Song } from '../types/albumDetail';

export function songToTrack(song: Song): TrackType {
    return {
        id: song.id.toString(),
        url: `https://music.163.com/song/media/outer/url?id=${song.id}.mp3`,
        title: song.name,
        artist: song.artists.map((ar) => ar.name).join(', '),
        artists: song.artists,
        artwork: song.album.picUrl,
        duration: song.duration / 1000,
        album: song.album.name,
        albumRaw: song.album,
        mvid: song.mvid
    };
}
