import { useNetInfoInstance } from '@react-native-community/netinfo';
import React, { memo, useCallback, useMemo, useRef, useState } from 'react';
import { RefreshControl, SectionList, StyleSheet } from 'react-native';
import HapticFeedback, { HapticFeedbackTypes } from 'react-native-haptic-feedback';
import { ActivityIndicator, List, Portal, Text, useTheme } from 'react-native-paper';
import useSWRInfinite from 'swr/infinite';
import { CommentItem, ScrollToBtns } from '.';
import { useDebounce } from '../hook';
import { Comment, Main as CommentsMain } from '../types/comments';

export interface Section {
    title: string;
    data: Comment[];
}

export function CommentList({ commentThreadId }: { commentThreadId: string }) {
    const appTheme = useTheme();
    const { netInfo } = useNetInfoInstance();
    const [refreshing, setRefreshing] = useState(false);
    const commentsRef = useRef<SectionList>(null);

    const commentsPerPage = 5;
    const { data, error, isLoading, mutate, setSize } = useSWRInfinite<CommentsMain>((index) =>
        `http://music.163.com/api/v1/resource/comments/${commentThreadId}?offset=${index * commentsPerPage}&limit=${commentsPerPage}`
    );

    const showData = useMemo(() => {
        let sections: Section[] = [];
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

                if (commentsData?.comments && commentsData.comments.length !== 0) {
                    const latestSectionIndex = sections.findIndex(
                        section => section.title === 'Latest Comments'
                    );

                    if (latestSectionIndex !== -1) {
                        sections[latestSectionIndex].data =
                            sections[latestSectionIndex].data.concat(commentsData.comments);
                    }
                }
            }
        }
        return sections;
    }, [data]);

    const onRefresh = useCallback(async () => {
        setRefreshing(true);
        HapticFeedback.trigger(
            HapticFeedbackTypes.effectClick
        );
        await mutate();
        setRefreshing(false);
        //no mutate
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const loadMore = useDebounce(() => {
        if (!isLoading) {
            // if there are more comments to load
            if (showData[0].data.length !== (data || [])[0].total) {
                setSize(prev => prev + 1);
            }
        }
    });

    const FooterLoading = memo(({ title }: { title: string }) => {
        if (title === 'Latest Comments') {
            if (showData[0].data.length !== (data || [])[0].total) {
                // loading isn't finished
                return <ActivityIndicator style={styles.footer} />;
            }
        }
    });

    const renderSectionHeader = useCallback(({ section }: { section: any }) => (
        <Text style={styles.header}>
            {section.title}
        </Text>
    ), []);

    const renderSectionFooter = useCallback(({ section }: { section: any }) => (
        <FooterLoading title={section.title} />
    ), [FooterLoading]);

    const renderItem = useCallback(({ item }: { item: Comment }) => (
        <CommentItem item={item} />
    ), []);

    if (isLoading) {
        return (
            <ActivityIndicator
                style={styles.loading}
                size="large"
            />
        );
    } else if (error) {
        if (!netInfo.isConnected) {
            return (
                <List.Item
                    left={props => (
                        <List.Icon
                            {...props}
                            color={appTheme.colors.error}
                            icon="alert-circle-outline"
                        />
                    )}
                    title="No internet connection."
                    description={error.message}
                />
            );
        } else if (netInfo.isConnected) {
            return (
                <List.Item
                    left={props => (
                        <List.Icon
                            {...props}
                            color={appTheme.colors.tertiary}
                            icon="reload"
                        />
                    )}
                    title="Connected! Tap to retry."
                    description={error.message}
                    onPress={() => mutate()}
                />
            );
        }
        return (
            <List.Item
                left={props => (
                    <List.Icon
                        {...props}
                        icon="alert-circle"
                        color={appTheme.colors.error}
                    />
                )}
                title="Failed to load comments. Tap to retry."
                description={error.message}
                onPress={() => mutate()}
            />
        );
    } else if ((data ?? [])[0]?.total === 0) {
        return (
            <List.Item
                left={props => (
                    <List.Icon
                        {...props}
                        icon="comment-outline"
                    />
                )}
                title="No comments"
                description="Be the first to comment!"
            />
        );
    } else {
        return (
            <Portal.Host>
                <SectionList
                    ref={commentsRef}
                    sections={showData}
                    keyExtractor={item => item.commentId.toString()}
                    initialNumToRender={7}
                    fadingEdgeLength={100}
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
                />

                <ScrollToBtns
                    showData={showData}
                    commentsRef={commentsRef}
                    data={data}
                />
            </Portal.Host>
        );
    }
}

const styles = StyleSheet.create({
    loading: {
        marginTop: '20%',
    },
    header: {
        fontSize: 16,
        marginTop: '4%',
        marginLeft: '4%',
        fontWeight: 'bold',
    },
    footer: {
        paddingBottom: '2%',
        justifyContent: 'center',
        alignItems: 'center',
    },
});
