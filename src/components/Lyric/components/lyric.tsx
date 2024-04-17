import React, { useEffect, useImperativeHandle, useRef } from 'react';
import { FlatList, StyleProp, ViewStyle } from 'react-native';
import { useCurrentIndex, useLocalAutoScroll } from '../hook';
import type { LyricLine } from '../lyric';
import { parseLyric } from '../util';

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
  [key: string]: any;
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
    autoScrollAfterUserScroll = 500,
    onCurrentLineChange,
    style,
    ...props
  }: Props,
  ref,
) {
  const lrcRef = useRef<FlatList | null>(null);
  const lrcLineList = parseLyric(lrc);

  const currentIndex = useCurrentIndex(lrcLineList, currentTime);
  const { localAutoScroll, resetLocalAutoScroll, onScroll } = useLocalAutoScroll(
    autoScroll,
    autoScrollAfterUserScroll,
  );

  const scrollToCurrentIndex = () => {
    try {
      lrcRef.current?.scrollToIndex({
        index: currentIndex,
      });
    } catch (e) {
      // ignore scrollToIndex failed
    }
  };

  // auto scroll
  useEffect(() => {
    if (localAutoScroll) {
      scrollToCurrentIndex();
    }
  }, [currentIndex, localAutoScroll]);

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

  return (
    <FlatList
      {...props}
      ref={lrcRef}
      scrollEventThrottle={30}
      onScroll={onScroll}
      style={style}
      data={lrcLineList}
      renderItem={({ item, index }) => (
        <>
          {lineRenderer({
            lrcLine: item,
            index,
            active: currentIndex === index
          })}
        </>
      )}
      // ignore scrollToIndex failed
      onScrollToIndexFailed={() => { }}
    />
  );
});

export default Lyric;
