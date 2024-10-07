import { useEffect, useState, useRef } from 'react';
import TrackPlayer from 'react-native-track-player';
import { SetupService, getTracks } from '../services';

/**
 * 自定义 hook 用于设置播放器。
 * @returns 一个布尔值，指示播放器是否准备就绪。
 */
export function useSetupPlayer() {
  const [playerReady, setPlayerReady] = useState(false);
  const unmountedRef = useRef(false);

  useEffect(() => {
    const init = async () => {
      await SetupService();
      if (unmountedRef.current) {return;}

      setPlayerReady(true);

      const queue = await TrackPlayer.getQueue();
      if (unmountedRef.current) {return;}

      if (queue.length <= 0) {
        await getTracks();
      }
    };

    init();

    return () => {
      unmountedRef.current = true;
    };
  }, []);

  return playerReady;
}
