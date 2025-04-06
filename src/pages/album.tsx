import { useRoute } from "@react-navigation/native";
import React from "react";
import { StyleSheet } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import TrackPlayer from "react-native-track-player";
import useSWRInfinite from "swr/infinite";
import { AlbumContent } from "../components/AlbumContent";
import { AlbumDescription } from "../components/AlbumDescription";
import { BlurBackground } from "../components/BlurBackground";
import { AlbumHeaderCard } from "../components/HeaderCard";
import { TracksHeader } from "../components/TracksHeader";
import { useAppDispatch } from "../hook/reduxHooks";
import { setQueueAsync } from "../redux/slices/queue";
import { TrackType } from "../services/GetTracksService";
import { HotAlbum } from "../types/albumArtist";
import { Main } from "../types/albumDetail";
import { songToTrack } from "../utils/songToTrack";

export function AlbumDetail() {
  const insets = useSafeAreaInsets();
  const dispatch = useAppDispatch();
  const { album } = useRoute().params as { album: HotAlbum };

  const { data, error } = useSWRInfinite<Main>(
    (index) =>
      `http://music.163.com/api/album/${album.id}?ext=true&offset=${index * 10}&total=true&limit=10`,
  );

  const playAll = async () => {
    const tracksData = data
      ?.flatMap((d) => d.album.songs)
      .map(songToTrack) as TrackType[];
    await dispatch(setQueueAsync(tracksData));
    await TrackPlayer.play();
  };

  return (
    <BlurBackground style={[styles.container, { paddingTop: insets.top }]}>
      <AlbumHeaderCard album={album} />
      {data && data[0].album && <AlbumDescription album={data[0].album} />}

      {!error && (
        <TracksHeader
          onPress={playAll}
          length={data?.flatMap((d) => d.album.songs).length || 0}
        />
      )}
      <AlbumContent album={album} />
    </BlurBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignContent: "center",
  },
});
