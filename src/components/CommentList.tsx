import { useNetInfoInstance } from '@react-native-community/netinfo';
import React, { useCallback, useMemo, useRef, useState } from 'react';
import { RefreshControl, SectionList, StyleSheet, View } from 'react-native';
import HapticFeedback, { HapticFeedbackTypes } from 'react-native-haptic-feedback';
import { ActivityIndicator, List, Portal, useTheme } from 'react-native-paper';
import useSWRInfinite from 'swr/infinite';
import { useDebounce } from '../hook';
import { Comment, Main as CommentsMain } from '../types/comments';
import type { ListLRProps } from '../types/paperListItem';
import { CommentItem } from './CommentItem';
import { NoCommentsItem, NoInternetItem, RetryItem } from './CommentSpecialItems';
import { ScrollToBtns } from './ScrollToBtns';

export interface Section {
  title: string;
  data: Comment[];
}

const itemPerPage = 10;

export function CommentList(
  { commentThreadId }: { commentThreadId: string }
) {
  const appTheme = useTheme();
  const { netInfo } = useNetInfoInstance();
  const commentsRef = useRef<SectionList>(null);

  const [atTop, setAtTop] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const { data, error, isLoading, mutate, setSize } = useSWRInfinite<CommentsMain>(
    (index) => {
      const offset = index * itemPerPage;
      return (
        `http://music.163.com/api/v1/resource/comments/${commentThreadId}?offset=${offset}&limit=${itemPerPage}`
      );
    }
  );

  const showData = useMemo(() => {
    const sections: Section[] = [];
    if (data) {
      const hotComments = data[0]?.hotComments || [];
      const latestComments = data[0]?.comments || [];

      if (hotComments.length !== 0) {
        sections.push({
          title: 'Hot Comments',
          data: hotComments,
        });
      }

      if (latestComments.length !== 0) {
        sections.push({
          title: 'Latest Comments',
          data: latestComments,
        });
      }

      for (let index = 1; index < data.length; index++) {
        const commentsData = data[index];

        if (
          commentsData?.comments && commentsData.comments.length !== 0
        ) {
          const latestSectionIndex = sections.findIndex(
            section => (
              section.title === 'Latest Comments'
            )
          );

          if (latestSectionIndex !== -1) {
            sections[latestSectionIndex].data =
              sections[latestSectionIndex].data
                .concat(commentsData.comments);
          }
        }
      }
    }
    return sections;
  }, [data]);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    HapticFeedback.trigger(HapticFeedbackTypes.effectClick);

    await mutate();
    setRefreshing(false);
    // no mutate
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const loadMore = useDebounce(() => {
    if (!isLoading) {
      if (data && data[data.length - 1].more) {
        setSize(prev => prev + 1);
      }
    }
  });

  const sectionFooterStyle = useMemo(() => [
    styles.sectionFooter, {
      color: appTheme.dark
        ? appTheme.colors.onSurfaceDisabled
        : appTheme.colors.backdrop,
    }
  ], [appTheme]);

  const renderLoadingIndicator = useCallback(
    (props: ListLRProps) => (
      <ActivityIndicator {...props} size={16} />
    ), []);

  const renderCheckIcon = useCallback(
    (props: ListLRProps) => (
      <List.Icon
        {...props}
        icon="check-all"
        color={appTheme.colors.primary}
      />
    ), [appTheme.colors.primary]);

  const renderSectionFooter = useCallback(
    ({ section }: { section: any }) => {
      if (section.title === 'Latest Comments') {
        if (data && data[data.length - 1].more) {
          return (
            <List.Item
              title="Loading more comments..."
              left={renderLoadingIndicator}
              titleStyle={sectionFooterStyle}
            />
          );
        } else {
          return (
            <List.Item
              title="All comments loaded!"
              titleStyle={sectionFooterStyle}
              left={renderCheckIcon}
            />
          );
        }
      } else { return <View />; }
    }, [
    data, renderCheckIcon, renderLoadingIndicator, sectionFooterStyle
  ]);

  const renderSectionHeader = useCallback(
    ({ section }: { section: any }) => (
      <List.Subheader style={[styles.header, {
        color: appTheme.colors.secondary,
      }]}>
        {section.title}
      </List.Subheader>
    ), [appTheme.colors.secondary]);

  const renderItem = useCallback(
    ({ item }: { item: Comment }) => (
      <CommentItem item={item} />
    ), []);

  const keyExtractor = useCallback(
    (item: Comment) => (
      item.commentId.toString()
    ), []);

  if (isLoading) {
    return (
      <ActivityIndicator style={styles.loading} size="large" />
    );
  }

  if (error) {
    if (!netInfo.isConnected) {
      return <NoInternetItem error={error} />;
    } else {
      return <RetryItem error={error} onRetry={onRefresh} />;
    }
  }

  if (
    (data ?? [])[0]?.total === 0
  ) {
    return <NoCommentsItem />;
  }

  return (
    <Portal.Host>
      <SectionList
        ref={commentsRef}
        sections={showData}
        keyExtractor={keyExtractor}
        initialNumToRender={7}
        fadingEdgeLength={50}
        refreshing={refreshing}
        onRefresh={onRefresh}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={[appTheme.colors.primary]}
            progressBackgroundColor={appTheme.colors.surface}
          />
        }
        renderSectionHeader={renderSectionHeader}
        renderItem={renderItem}
        onEndReached={loadMore}
        onEndReachedThreshold={0.05}
        renderSectionFooter={renderSectionFooter}
        onScroll={e =>
          setAtTop(e.nativeEvent.contentOffset.y < 5)
        }
        onScrollToIndexFailed={
          info => {
            const wait = new Promise(
              resolve =>
                setTimeout(resolve, 700)
            );
            wait.then(() => {
              commentsRef.current?.scrollToLocation({
                sectionIndex: info.index,
                itemIndex: 0,
                viewPosition: 0,
                viewOffset: 0,
                animated: true,
              });
            });
          }}
      />
      <Portal>
        <ScrollToBtns
          showData={showData}
          commentsRef={commentsRef}
          data={data}
          atTop={atTop}
        />
      </Portal>
    </Portal.Host>
  );
}

const styles = StyleSheet.create({
  loading: {
    marginTop: '20%',
  },
  header: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  sectionFooter: {
    fontSize: 14,
  },
});
