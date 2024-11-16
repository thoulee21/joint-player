import { useEffect, useRef, useState } from 'react';
import TrackPlayer from 'react-native-track-player';
import { getTracks } from '../services/GetTracksService';
import { SetupService } from '../services/SetupService';
import { storage } from '../utils/reduxPersistMMKV';
import { StateKeys } from '../utils/storageKeys';

/**
 * 自定义 hook 用于设置播放器。
 * @returns 一个布尔值，指示播放器是否准备就绪。
 */
export function useSetupPlayer() {
  const unmountedRef = useRef(false);
  const [playerReady, setPlayerReady] = useState(false);

  useEffect(() => {
    const init = async () => {
      await SetupService();
      if (unmountedRef.current) { return; }

      setPlayerReady(true);

      const queue = await TrackPlayer.getQueue();
      if (unmountedRef.current) { return; }

      if (queue.length <= 0) {
        const searchHistoryRaw = storage.getString(
          `persist:${StateKeys.SearchHistory}`
        );
        const searchHistory = JSON.parse(
          JSON.parse(searchHistoryRaw || '').value
        );

        if (searchHistory.length) {
          await getTracks(
            searchHistory[searchHistory.length - 1]
          );
        } else { await getTracks('Maroon 5'); }
      }
    };

    init();

    return () => { unmountedRef.current = true; };
  }, []);

  return playerReady;
}
