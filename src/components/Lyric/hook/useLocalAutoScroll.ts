import { useCallback, useState } from "react";
import { useDebounce } from "../../../hook/useDebounce";
import { useThrottle } from "../../../hook/useThrottle";

/**
 * Custom hook that manages local auto-scroll behavior.
 * @param autoScroll - A boolean indicating whether auto-scroll is enabled.
 * @param autoScrollAfterUserScroll - The duration (in milliseconds) after which auto-scroll is reset after user scroll.
 * @returns An object containing the following properties:
 *   - localAutoScroll: A boolean indicating the current state of local auto-scroll.
 *   - resetLocalAutoScroll: A function to reset the local auto-scroll state to the initial value.
 *   - onScroll: A function to handle the scroll event and update the local auto-scroll state.
 */
export function useLocalAutoScroll(
  autoScroll: boolean,
  autoScrollAfterUserScroll: number,
) {
  const [localAutoScroll, setLocalAutoScroll] = useState(autoScroll);

  const resetLocalAutoScroll = useCallback(
    () => setLocalAutoScroll(autoScroll),
    [autoScroll],
  );

  const resetAutoScrollAfterUserScroll = useDebounce(
    () => setLocalAutoScroll(autoScroll),
    autoScrollAfterUserScroll,
  );

  const onScroll = useThrottle(() => {
    setLocalAutoScroll(false);
    resetAutoScrollAfterUserScroll();
  });

  return { localAutoScroll, resetLocalAutoScroll, onScroll };
}
