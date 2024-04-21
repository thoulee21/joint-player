import { useNavigation } from '@react-navigation/native';
import Color from 'color';
import { BlurView } from 'expo-blur';
import React, { useContext, useEffect, useState } from 'react';
import {
    FlatList,
    ImageBackground,
    StyleSheet,
    ToastAndroid,
} from 'react-native';
import {
    ActivityIndicator,
    Appbar,
    Avatar,
    List,
    useTheme,
} from 'react-native-paper';
import { useActiveTrack } from 'react-native-track-player';
import { PreferencesContext } from '../App';
import { MoreBtn, placeholderImg } from '../components';
import { useDebounce } from '../hook';
import { requestInit } from '../services';
import { BeReplied, Comment, Main } from '../types/comments';

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

function CommentList() {
    const track = useActiveTrack();

    const [comments, setComments] = useState<Comment[]>([]);
    const [isEmpty, setIsEmpty] = useState(false);

    const fetchComments = useDebounce(async () => {
        const response = await fetch(
            `http://music.163.com/api/v1/resource/comments/R_SO_4_${track?.id}`,
            requestInit
        );

        if (response.status === 200) {
            const data: Main = await response.json();

            setIsEmpty(data.total === 0);
            setComments(data.hotComments);
        } else {
            ToastAndroid.show(
                `Failed to fetch comments: ${response.status} ${response.statusText}`,
                ToastAndroid.SHORT,
            );
        }
    });

    useEffect(() => {
        fetchComments();
        // no fetchComments in deps to avoid infinite loop
    }, [track?.id]);

    if (isEmpty) {
        return (
            <List.Item
                title="No comments"
                titleStyle={styles.emptyContent}
            />
        );
    } else {
        return (
            <FlatList
                data={comments}
                keyExtractor={(item) => item.commentId.toString()}
                renderItem={({ item }) => <CommentItem item={item} />}
                // Component to render when loading data
                ListEmptyComponent={() =>
                    <ActivityIndicator size="large" style={styles.loading} />
                }
            />
        );
    }
}

export function Comments(): React.JSX.Element {
    const navigation = useNavigation();
    const appTheme = useTheme();
    const preferences = useContext(PreferencesContext);
    const track = useActiveTrack();

    return (
        <ImageBackground
            style={styles.rootView}
            source={{ uri: track?.artwork || placeholderImg }}
            blurRadius={preferences?.blurRadius}
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
