import { useNetInfoInstance } from '@react-native-community/netinfo';
import { useNavigation } from '@react-navigation/native';
import Color from 'color';
import { BlurView } from 'expo-blur';
import React from 'react';
import { FlatList, ImageBackground, StyleSheet } from 'react-native';
import {
    ActivityIndicator,
    Appbar,
    Avatar,
    List,
    useTheme,
} from 'react-native-paper';
import { useActiveTrack } from 'react-native-track-player';
import useSWR from 'swr';
import { MoreBtn, placeholderImg } from '../components';
import { useAppSelector } from '../hook/reduxHooks';
import { blurRadius } from '../redux/slices';
import { BeReplied, Comment, Main as CommentsMain } from '../types/comments';

const BeRepliedComment = ({ reply }: { reply: BeReplied }) => {
    const appTheme = useTheme();

    const beRepliedStyle = [
        styles.beReplied,
        {
            borderTopStartRadius: appTheme.roundness,
            borderBottomLeftRadius: appTheme.roundness,
            backgroundColor:
                Color(appTheme.colors.surface)
                    .fade(0.8).string(),
        }];

    return (
        <List.Item
            style={beRepliedStyle}
            title={reply.user.nickname}
            titleStyle={{ color: appTheme.colors.secondary }}
            description={reply.content}
            descriptionStyle={{ color: appTheme.colors.onSurfaceVariant }}
            descriptionNumberOfLines={20}
            left={props =>
                <Avatar.Image
                    {...props}
                    size={30}
                    source={{ uri: reply.user.avatarUrl }}
                />
            }
            right={() => <MoreBtn data={reply.content} />}
        />
    );
};

const CommentItem = ({ item }: { item: Comment }) => {
    const appTheme = useTheme();

    const commentContent = item.content.concat(
        '\n\n❤️ ',
        item.likedCount.toString(),
        '  •  ',
        item.timeStr,
    );

    return (
        <List.Section>
            <List.Item
                title={item.user.nickname}
                titleStyle={{ color: appTheme.colors.primary }}
                description={commentContent}
                descriptionStyle={{ color: appTheme.colors.onBackground }}
                descriptionNumberOfLines={20}
                left={props =>
                    <Avatar.Image
                        {...props}
                        size={40}
                        source={{ uri: item.user.avatarUrl }}
                    />
                }
                right={() => <MoreBtn data={item.content} />}
            />

            <FlatList
                data={item.beReplied}
                keyExtractor={(reply) => reply.beRepliedCommentId.toString()}
                renderItem={({ item: reply }) => <BeRepliedComment reply={reply} />}
            />
        </List.Section>
    );
};

function CommentsView({ comments }: { comments: Comment[] }) {
    return (
        <FlatList
            data={comments}
            keyExtractor={(item) => item.commentId.toString()}
            renderItem={({ item }) => <CommentItem item={item} />}
            ListEmptyComponent={
                <List.Item
                    title="No comments"
                    titleStyle={styles.emptyContent}
                />
            }
        />
    );
}

function CommentList() {
    const appTheme = useTheme();
    const { netInfo } = useNetInfoInstance();

    const track = useActiveTrack();
    const { data: commentsData, error, isLoading, mutate } = useSWR<CommentsMain>(
        `http://music.163.com/api/v1/resource/comments/R_SO_4_${track?.id}`,
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
    } else if (!commentsData?.hotComments || commentsData?.hotComments.length === 0) {
        // show all comments if there are no hot comments
        return <CommentsView comments={commentsData?.comments || []} />;
    } else {
        return <CommentsView comments={commentsData.hotComments} />;
    }
}

export function Comments(): React.JSX.Element {
    const navigation = useNavigation();
    const appTheme = useTheme();

    const track = useActiveTrack();
    const blurRadiusValue = useAppSelector(blurRadius);

    return (
        <ImageBackground
            style={styles.rootView}
            source={{ uri: track?.artwork || placeholderImg }}
            blurRadius={blurRadiusValue}
        >
            <BlurView
                tint={appTheme.dark ? 'dark' : 'light'}
                style={styles.rootView}
            >
                <Appbar.Header style={styles.header}>
                    <Appbar.BackAction onPress={navigation.goBack} />
                    <Appbar.Content title="Comments" />
                </Appbar.Header>

                <CommentList />
            </BlurView>
        </ImageBackground>
    );
}

const styles = StyleSheet.create({
    rootView: {
        flex: 1,
        display: 'flex',
    },
    header: {
        backgroundColor: 'transparent',
    },
    emptyContent: {
        alignSelf: 'center',
    },
    loading: {
        marginTop: '20%',
    },
    beReplied: {
        marginLeft: '10%',
    },
});
