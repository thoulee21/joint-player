import TrackPlayer, {
  AppKilledPlaybackBehavior,
  Capability,
} from "react-native-track-player";
import { storage } from "../utils/reduxPersistMMKV";

export const DefaultAudioServiceBehaviour =
  AppKilledPlaybackBehavior.StopPlaybackAndRemoveNotification;

/**
 * 使用指定的选项设置播放器。
 * @param options - 配置播放器的选项。
 */
const setupPlayer = async (
  options: Parameters<typeof TrackPlayer.setupPlayer>[0],
) => {
  const setup = async () => {
    try {
      await TrackPlayer.setupPlayer(options);
    } catch (error) {
      return (error as Error & { code?: string }).code;
    }
  };
  while ((await setup()) === "android_cannot_setup_player_in_background") {
    // A timeout will mostly only execute when the app is in the foreground,
    // and even if we were in the background still, it will reject the promise
    // and we'll try again:
    await new Promise<void>((resolve) => setTimeout(resolve, 1));
  }
};

export const SetupService = async () => {
  await setupPlayer({
    autoHandleInterruptions: true,
  });
  await TrackPlayer.updateOptions({
    android: {
      appKilledPlaybackBehavior: DefaultAudioServiceBehaviour,
    },
    capabilities: [
      Capability.Play,
      Capability.Pause,
      Capability.SkipToNext,
      Capability.SkipToPrevious,
      Capability.SeekTo,
    ],
    compactCapabilities: [
      Capability.Play,
      Capability.Pause,
      Capability.SkipToNext,
    ],
    progressUpdateEventInterval: 2,
  });

  const storedRoot = JSON.parse(storage.getString("persist:root") || "");
  const storedRepeatMode = JSON.parse(storedRoot.repeatMode).value;

  await TrackPlayer.setRepeatMode(storedRepeatMode);
};
