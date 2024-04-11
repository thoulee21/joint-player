import TrackPlayer, { Track } from 'react-native-track-player';
import playlistData from "../assets/data/playlist.json";

export const RequestInit = {
  headers: {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36 Edg/124.0.0.0',
    'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7',
  },
}

export const QueueInitialTracksService = async (Keyword: string | undefined = undefined): Promise<void> => {
  if (Keyword) {
    const Type = 1;
    const Limit = 20;
    const Offset = 0;
    const Total = true;

    const result = await fetch(
      `http://music.163.com/api/search/get/web?csrf_token=hlpretag=&hlposttag=&s=${Keyword}&type=${Type}&offset=${Offset}&total=${Total}&limit=${Limit}`,
      RequestInit,
    );
    const data = await result.json();
    if (data.code !== 200) {
      console.error('Failed to fetch data');
      return;
    }

    const fetchedData: Track[] = [];
    for (const track of data.result?.songs) {
      const detail = await fetch(
        `http://music.163.com/api/song/detail/?id=${track.id}&ids=%5B${track.id}%5D`,
        RequestInit,
      );
      const detailData = await detail.json();

      fetchedData.push({
        id: track.id.toString(),
        url: `https://music.163.com/song/media/outer/url?id=${track.id}.mp3`,
        title: track.name,
        artist: track.artists.map((ar: any) => ar.name).join(', '),
        artwork: detailData.songs[0].album.picUrl,
        duration: track.duration / 1000,
        album: track.album.name,
        mvid: track.mvid,
      });
    }
    await TrackPlayer.reset();
    await TrackPlayer.add(fetchedData);
  } else {
    await TrackPlayer.add(playlistData as Track[]);
  };
}

