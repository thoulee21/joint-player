import { useNetInfoInstance } from '@react-native-community/netinfo';
import React, { useCallback, useMemo, useState } from 'react';
import { RefreshControl, SectionList, StyleSheet } from 'react-native';
import { ActivityIndicator, List, Text, useTheme } from 'react-native-paper';
import useSWR from 'swr';
import { CommentItem } from '.';
import { Main as CommentsMain } from '../types/comments';

export function CommentList({ commentThreadId }: { commentThreadId: string }) {
    const appTheme = useTheme();
    const { netInfo } = useNetInfoInstance();
    const [refreshing, setRefreshing] = useState(false);

    const { data: commentsData, error, isLoading, mutate } = useSWR<CommentsMain>(
        `http://music.163.com/api/v1/resource/comments/${commentThreadId}`,
    );
    const showData = useMemo(() => {
        let sections = [];
        if (commentsData?.hotComments && commentsData?.hotComments.length !== 0) {
            sections.push({
                title: 'Hot Comments',
                data: commentsData.hotComments.slice(0, 14),
            });
        }
        if (commentsData?.comments && commentsData?.comments.length !== 0) {
            sections.push({
                title: 'Latest Comments',
                data: commentsData.comments.slice(0, 5),
            });
        }
        return sections;
    }, [commentsData]);

    const onRefresh = useCallback(async () => {
        setRefreshing(true);
        await mutate();
        setRefreshing(false);
        //no mutate
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

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
    } else if (commentsData?.total === 0) {
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
        marginVertical: 5,
        fontSize: 16,
        marginLeft: '4%',
        fontWeight: 'bold',
    }
});
