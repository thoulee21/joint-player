import React, {
  useCallback,
  type MutableRefObject,
  type PropsWithChildren,
} from "react";
import SwipeableItem, {
  type OpenDirection,
  type SwipeableItemImperativeRef,
} from "react-native-swipeable-item";
import { TrackType } from "../services/GetTracksService";

export const SwipeableItemWrapper = ({
  item,
  itemRefs,
  children,
  renderUnderlayLeft,
  renderUnderlayRight,
}: PropsWithChildren<{
  item: TrackType;
  itemRefs: MutableRefObject<Map<any, any>>;
  renderUnderlayLeft?: () => JSX.Element;
  renderUnderlayRight?: () => JSX.Element;
}>) => {
  const onChange = useCallback(
    ({ openDirection }: { openDirection: OpenDirection }) => {
      if (openDirection) {
        // Close all other open items
        [...itemRefs.current.entries()].forEach(([key, ref]) => {
          if (key !== item.id && ref) {
            ref.close();
          }
        });
      }
    },
    [item.id, itemRefs],
  );

  const ref = useCallback(
    (swipeRef: SwipeableItemImperativeRef | null) => {
      if (swipeRef && !itemRefs.current.get(item.id)) {
        itemRefs.current.set(item.id, swipeRef);
      }
    },
    [item.id, itemRefs],
  );

  return (
    <SwipeableItem
      key={item.id}
      item={item}
      ref={ref}
      onChange={onChange}
      overSwipe={50}
      renderUnderlayRight={renderUnderlayRight}
      renderUnderlayLeft={renderUnderlayLeft}
      snapPointsLeft={renderUnderlayLeft && [100]}
      snapPointsRight={renderUnderlayRight && [100]}
    >
      {children}
    </SwipeableItem>
  );
};
