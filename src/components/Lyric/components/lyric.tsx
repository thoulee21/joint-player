import React, {
  useCallback,
  useEffect,
  useImperativeHandle,
  useMemo,
  useRef,
  useState,
} from "react";
import {
  FlatList,
  StyleProp,
  useWindowDimensions,
  View,
  ViewStyle,
} from "react-native";
import { useCurrentIndex } from "../hook/useCurrentIndex";
import { useLocalAutoScroll } from "../hook/useLocalAutoScroll";
import type { LyricLine } from "../lyric";
import { parseLyric } from "../util";

interface Props {
  /** lrc string */
  lrc: string;
  /** lrc line render */
  lineRenderer: ({
    lrcLine,
    index,
    active,
  }: {
    lrcLine: LyricLine;
    index: number;
    active: boolean;
  }) => React.ReactNode;
  /** audio currentTime, millisecond */
  currentTime?: number;
  /** whether auto scroll @default true */
  autoScroll?: boolean;
  /** auto scroll after user scroll */
  autoScrollAfterUserScroll?: number;
  /** when current line change */
  onCurrentLineChange?: ({
    index,
    lrcLine,
  }: {
    index: number;
    lrcLine: LyricLine | null;
  }) => void;
  style: StyleProp<ViewStyle>;
}

const Lyric = React.forwardRef<
  {
    scrollToCurrentLine: () => void;
    getCurrentLine: () => {
      index: number;
      lrcLine: LyricLine | null;
    };
  },
  Props
>(function Lrc(
  {
    lrc,
    lineRenderer,
    currentTime = 0,
    autoScroll = true,
    autoScrollAfterUserScroll = 1000,
    onCurrentLineChange,
    style,
    ...props
  }: Props,
  ref,
) {
  const lrcRef = useRef<FlatList | null>(null);
  const window = useWindowDimensions();
  const [firstRun, setFirstRun] = useState(true);

  const lrcLineList = useMemo(() => parseLyric(lrc), [lrc]);
  const currentIndex = useCurrentIndex(lrcLineList, currentTime);

  const { localAutoScroll, resetLocalAutoScroll, onScroll } =
    useLocalAutoScroll(autoScroll, autoScrollAfterUserScroll);

  const scrollToCurrentIndex = useCallback(() => {
    try {
      lrcRef.current?.scrollToIndex({
        index: currentIndex,
        viewPosition: 0.2,
      });
    } catch {}
  }, [currentIndex]);

  // auto scroll
  useEffect(() => {
    if (localAutoScroll) {
      scrollToCurrentIndex();
    }
  }, [currentIndex, localAutoScroll, scrollToCurrentIndex]);

  // on current line change
  useEffect(() => {
    onCurrentLineChange &&
      onCurrentLineChange({
        index: currentIndex,
        lrcLine: lrcLineList[currentIndex] || null,
      });
  }, [lrcLineList, currentIndex, onCurrentLineChange]);

  useImperativeHandle(ref, () => ({
    getCurrentLine: () => ({
      index: currentIndex,
      lrcLine: lrcLineList[currentIndex] || null,
    }),

    scrollToCurrentLine: () => {
      resetLocalAutoScroll();
      scrollToCurrentIndex();
    },
  }));

  const renderItem = useCallback(
    ({ item, index }: { item: LyricLine; index: number }) => (
      <>
        {lineRenderer({
          lrcLine: item,
          index,
          active: currentIndex === index,
        })}
      </>
    ),
    [currentIndex, lineRenderer],
  );

  return (
    <FlatList
      {...props}
      ref={lrcRef}
      scrollEventThrottle={30}
      onScroll={onScroll}
      style={style}
      fadingEdgeLength={100}
      data={lrcLineList}
      renderItem={renderItem}
      // ignore scrollToIndex failed
      onScrollToIndexFailed={() => {}}
      // to make lyric at the center of the screen
      ListHeaderComponent={<View style={{ height: window.height / 10 }} />}
      ListFooterComponent={<View style={{ height: window.height / 4.5 }} />}
      onStartReached={() => {
        setTimeout(() => {
          setFirstRun(false);
        }, 2000);

        if (firstRun) {
          scrollToCurrentIndex();
        }
      }}
      onStartReachedThreshold={0.1}
      showsVerticalScrollIndicator={false}
    />
  );
});

export default Lyric;
