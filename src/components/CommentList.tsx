import { useNetInfoInstance } from '@react-native-community/netinfo';
import React from 'react';
import { FlatList, StyleSheet } from 'react-native';
import { ActivityIndicator, List, useTheme } from 'react-native-paper';
import useSWR from 'swr';
import { CommentItem } from '.';
import { Comment, Main as CommentsMain } from '../types/comments';

function CommentsView({ comments }: { comments: Comment[] }) {
    return (
        <FlatList
            data={comments}
            keyExtractor={(item) => item.commentId.toString()}
            renderItem={({ item }) => <CommentItem item={item} />}
        />
    );
}

export function CommentList({ commentThreadId }: { commentThreadId: string }) {
    const appTheme = useTheme();
    const { netInfo } = useNetInfoInstance();

    const { data: commentsData, error, isLoading, mutate } = useSWR<CommentsMain>(
        `http://music.163.com/api/v1/resource/comments/${commentThreadId}`,
    );

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
    } else if (!commentsData?.hotComments || commentsData?.hotComments.length === 0) {
        // show all comments if there are no hot comments
        return <CommentsView comments={commentsData?.comments || []} />;
    } else {
        return <CommentsView comments={commentsData.hotComments} />;
    }
}

const styles = StyleSheet.create({
    emptyContent: {
        alignSelf: 'center',
    },
    loading: {
        marginTop: '20%',
    },
});
