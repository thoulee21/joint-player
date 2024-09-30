import React, {
  useCallback,
  useEffect,
  useImperativeHandle,
  useRef,
} from 'react';
import {
  Dimensions,
  FlatList,
  StyleProp,
  View,
  ViewStyle,
} from 'react-native';
import { useDebounce } from '../../../hook';
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

const MarginTopView = () => {
  return (
    <View
      style={{ height: Dimensions.get('window').height / 10 }}
    />
  );
};

const MarginBottomView = () => {
  return (
    <View
      style={{ height: Dimensions.get('window').height / 4.5 }}
    />
  );
};

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

  const scrollToCurrentIndex = useDebounce(() => {
    try {
      lrcRef.current?.scrollToIndex({
        index: currentIndex,
        viewPosition: 0.1,
      });
    } catch (e) {
      // ignore scrollToIndex failed
    }
  });

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

  const renderItem = useCallback(({ item, index }: {
    item: LyricLine;
    index: number;
  }) => (
    <>
      {lineRenderer({
        lrcLine: item,
        index,
        active: currentIndex === index,
      })}
    </>
  ), [currentIndex, lineRenderer]);

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
      onScrollToIndexFailed={() => { }}
      ListHeaderComponent={MarginTopView}
      ListFooterComponent={MarginBottomView}
      onStartReached={scrollToCurrentIndex}
      onStartReachedThreshold={0.1}
      showsVerticalScrollIndicator={false}
    />
  );
});

export default Lyric;
