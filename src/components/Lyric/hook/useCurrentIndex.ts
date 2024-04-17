import { useEffect, useState } from "react";
import type { LyricLine } from "../lyric";

/**
 * Custom hook that calculates the current index of a lyric line based on the current time.
 * @param lrcLineList - The list of lyric lines.
 * @param currentTime - The current time in milliseconds.
 * @returns The current index of the lyric line.
 */
export function useCurrentIndex(
  lrcLineList: LyricLine[], currentTime: number
) {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    let i = 0;

    for (; i < lrcLineList.length; i += 1) {
      const { millisecond } = lrcLineList[i];

      if (currentTime < millisecond) {
        break;
      }
    }
    setCurrentIndex(i - 1);
  }, [currentTime, lrcLineList]);

  return currentIndex;
};
