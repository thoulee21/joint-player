import RNBackgroundDownloader, {
  checkForExistingDownloads,
  completeHandler,
  setConfig,
  type DownloadTask,
} from "@kesha-antonov/react-native-background-downloader";
import React, { useCallback, useEffect, useState } from "react";
import { ToastAndroid } from "react-native";
import RNFS from "react-native-fs";
import { Menu } from "react-native-paper";
import { useActiveTrack } from "react-native-track-player";
import { rootLog } from "../utils/logger";
import { useMenuContext } from "./TrackMenu";

export const DownloadMenu = () => {
  const track = useActiveTrack();
  const { onPostPressed } = useMenuContext();

  const [downloading, setDownloading] = useState(false);

  useEffect(() => {
    setConfig({ isLogsEnabled: __DEV__ });
  }, []);

  const processDownload = useCallback((task: DownloadTask) => {
    task
      .begin(() => {
        setDownloading(true);
        rootLog.debug(`Download started: ${task?.id}`);
        ToastAndroid.show("Download started", ToastAndroid.SHORT);
      })
      .progress((percent) => {
        rootLog.debug("Downloaded: ", percent);
      })
      .done(() => {
        setDownloading(false);
        completeHandler(task?.id as string);

        rootLog.info(`Download completed: ${task?.id}`);
        ToastAndroid.show(
          "Download completed to download directory",
          ToastAndroid.SHORT,
        );
      })
      .error((error) => {
        setDownloading(false);
        completeHandler(task?.id as string);

        rootLog.error("Download canceled due to error: ", error);
        ToastAndroid.show("Download canceled due to error", ToastAndroid.SHORT);
      });
  }, []);

  useEffect(() => {
    const restoreDownloads = async () => {
      const tasks = await checkForExistingDownloads();

      if (tasks.length > 0) {
        ToastAndroid.show("Restoring downloads", ToastAndroid.SHORT);
        tasks.forEach(processDownload);
      }
    };

    restoreDownloads();
  }, [processDownload]);

  return (
    <Menu.Item
      title="Download"
      leadingIcon="download"
      disabled={!track || !track.url || !track.id || downloading}
      onPress={() => {
        const task = RNBackgroundDownloader.download({
          id: track?.id,
          url: track?.url as string,
          destination: `${RNFS.DownloadDirectoryPath}/${track?.id}.mp3`,
          isNotificationVisible: true,
          isAllowedOverMetered: true,
          isAllowedOverRoaming: true,
        });

        processDownload(task);
        onPostPressed();
      }}
    />
  );
};
