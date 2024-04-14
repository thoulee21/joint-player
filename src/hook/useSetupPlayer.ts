import {useEffect, useState} from 'react';
import TrackPlayer from 'react-native-track-player';
import {QueueInitialTracksService, SetupService} from '../services';

/**
 * 自定义 hook 用于设置播放器。
 * @returns 一个布尔值，指示播放器是否准备就绪。
 */
export function useSetupPlayer() {
  const [playerReady, setPlayerReady] = useState<boolean>(false);

  useEffect(() => {
    let unmounted = false;
    (async () => {
      await SetupService();
      if (unmounted) {
        return;
      }
      setPlayerReady(true);
      const queue = await TrackPlayer.getQueue();
      if (unmounted) {
        return;
      }
      if (queue.length <= 0) {
        await QueueInitialTracksService();
      }
    })();
    return () => {
      unmounted = true;
    };
  }, []);
  return playerReady;
}
