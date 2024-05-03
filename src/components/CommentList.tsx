import { useNetInfoInstance } from '@react-native-community/netinfo';
import React, { memo, useCallback, useMemo, useState } from 'react';
import { RefreshControl, SectionList, StyleSheet } from 'react-native';
import { ActivityIndicator, List, Text, useTheme } from 'react-native-paper';
import useSWRInfinite from 'swr/infinite';
import { CommentItem } from '.';
import { useDebounce } from '../hook';
import { Main as CommentsMain } from '../types/comments';

export function CommentList({ commentThreadId }: { commentThreadId: string }) {
    const appTheme = useTheme();
    const { netInfo } = useNetInfoInstance();
    const [refreshing, setRefreshing] = useState(false);

    const commentsPerPage = 5;
    const { data, error, isLoading, mutate, setSize } = useSWRInfinite<CommentsMain>((index) =>
        `http://music.163.com/api/v1/resource/comments/${commentThreadId}?offset=${index * commentsPerPage}&limit=${commentsPerPage}`
    );

    const showData = useMemo(() => {
        let sections = [];
        if (data) {
            for (let index = 0; index < data.length; index++) {
                const commentsData = data[index];
                if (index === 0) {
                    if (commentsData?.hotComments && commentsData?.hotComments.length !== 0) {
                        sections.push({
                            title: 'Hot Comments',
                            data: commentsData.hotComments,
                        });
                    }
                    if (commentsData?.comments && commentsData?.comments.length !== 0) {
                        sections.push({
                            title: 'Latest Comments',
                            data: commentsData.comments,
                        });
                    }
                } else {
                    if (commentsData?.comments && commentsData?.comments.length !== 0) {
                        sections[1].data.push(...commentsData.comments);
                    }
                }
            }
        }
        return sections;
    }, [data]);

    const onRefresh = useCallback(async () => {
        setRefreshing(true);
        await mutate();
        setRefreshing(false);
        //no mutate
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const loadMore = useDebounce(() => {
        if (!isLoading) {
            // if there are more comments to load
            if (showData[0].data.length !== (data || [])[0].comments.length) {
                setSize(prev => prev + 1);
            }
        }
    }, 1500);

    const FooterLoading = memo(({ section }:
        { section: { title: string } }
    ) => {
        if (section.title === 'Latest Comments') {
            if (showData[0].data.length !== (data || [])[0].comments.length) {
                // loading isn't finished
                return <ActivityIndicator style={styles.footer} />;
            }
        }
    });

    if (isLoading) {
        return <ActivityIndicator
            style={styles.loading}
            size="large"
        />;
    } else if (error) {
        // network error
        if (!netInfo.isConnected) {
            return <List.Item
                left={props => <List.Icon {...props}
                    color={appTheme.colors.error}
                    icon="alert-circle-outline"
                />}
                title="No internet connection."
                description={error.message}
            />;
        } else if (netInfo.isConnected) {
            return <List.Item
                left={props => <List.Icon {...props}
                    color={appTheme.colors.tertiary}
                    icon="reload"
                />}
                title="Connected! Tap to retry."
                description={error.message}
                onPress={() => mutate()}
            />;
        }

        // other errors
        return <List.Item
            left={props => <List.Icon {...props}
                icon="alert-circle"
                color={appTheme.colors.error} />}
            title="Failed to load comments. Tap to retry."
            titleStyle={styles.emptyContent}
            description={error.message}
            onPress={() => mutate()}
        />;
    } else if ((data ?? [])[0]?.total === 0) {
        return <List.Item
            title="No comments"
            titleStyle={styles.emptyContent}
        />;
    } else {
        return (
            <SectionList
                sections={showData}
                keyExtractor={(item) => item.commentId.toString()}
                initialNumToRender={10}
                scrollEventThrottle={16}
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
                renderSectionHeader={({ section }) => (
                    <Text style={styles.header}>
                        {section.title}
                    </Text>
                )}
                renderItem={({ item }) => <CommentItem item={item} />}
                onEndReached={loadMore}
                onEndReachedThreshold={0.05}
                renderSectionFooter={(props) => <FooterLoading {...props} />}
            />
        );
    }
}

const styles = StyleSheet.create({
    emptyContent: {
        alignSelf: 'center',
    },
    loading: {
        marginTop: '20%',
    },
    header: {
        fontSize: 16,
        marginLeft: '4%',
        fontWeight: 'bold',
    },
    footer: {
        paddingBottom: '4%',
        justifyContent: 'center',
        alignItems: 'center',
    },
});
