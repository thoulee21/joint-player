import Color from 'color';
import React, { memo, useCallback } from 'react';
import { FlatList, StyleSheet } from 'react-native';
import { Avatar, List, useTheme } from 'react-native-paper';
import { BeReplied, Comment } from '../types/comments';
import { MoreBtn } from './MoreButton';

export const BeRepliedComment = memo(({ reply }:
    { reply: BeReplied }
) => {
    const appTheme = useTheme();

    const beRepliedStyle = [
        styles.beReplied,
        {
            borderTopStartRadius: appTheme.roundness * 3,
            borderBottomLeftRadius: appTheme.roundness * 3,
            backgroundColor:
                Color(appTheme.colors.surface)
                    .fade(0.8).string(),
        }];

    const renderLeft = useCallback((props: any) => (
        <Avatar.Image
            {...props}
            size={30}
            source={{ uri: reply.user.avatarUrl }}
        />
    ), [reply.user.avatarUrl]);

    return (
        <List.Item
            style={beRepliedStyle}
            title={reply.user.nickname}
            titleStyle={{ color: appTheme.colors.secondary }}
            description={reply.content}
            descriptionStyle={{ color: appTheme.colors.onSurfaceVariant }}
            descriptionNumberOfLines={20}
            left={renderLeft}
            right={() => <MoreBtn data={reply.content} />}
        />
    );
});

export const CommentItem = memo(({ item }:
    { item: Comment }
) => {
    const appTheme = useTheme();

    const commentContent = item.content.concat(
        '\n\n❤️ ',
        item.likedCount.toString(),
        '  •  ',
        item.timeStr,
    );

    const renderItem = useCallback(({ item: reply }: { item: BeReplied }) =>
        <BeRepliedComment reply={reply} />, []);

    const renderLeft = useCallback((props: any) => (
        <Avatar.Image
            {...props}
            size={40}
            source={{ uri: item.user.avatarUrl }}
        />
    ), [item.user.avatarUrl]);

    return (
        <List.Section>
            <List.Item
                title={item.user.nickname}
                titleStyle={{ color: appTheme.colors.primary }}
                description={commentContent}
                descriptionStyle={{ color: appTheme.colors.onBackground }}
                descriptionNumberOfLines={20}
                left={renderLeft}
                right={() => <MoreBtn data={item.content} />}
            />

            <FlatList
                data={item.beReplied}
                keyExtractor={(reply) => reply.beRepliedCommentId.toString()}
                renderItem={renderItem}
            />
        </List.Section>
    );
});

const styles = StyleSheet.create({
    beReplied: {
        marginLeft: '10%',
    },
});
