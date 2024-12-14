import React, { memo, useCallback } from 'react';
import { StyleSheet } from 'react-native';
import { Avatar, List, useTheme } from 'react-native-paper';
import { BeReplied } from '../types/comments';
import type { ListLRProps } from '../types/paperListItem';
import { MoreBtn } from './MoreButton';

export const BeRepliedComment = memo((
  { reply }: { reply: BeReplied }
) => {
  const appTheme = useTheme();

  const beRepliedStyle = [
    styles.beReplied, {
      borderTopStartRadius: appTheme.roundness * 3,
      borderBottomLeftRadius: appTheme.roundness * 3,
      backgroundColor: appTheme.colors.surfaceDisabled,
    }
  ];

  const renderLeft = useCallback((props: any) => (
    <Avatar.Image
      {...props}
      size={40}
      source={{ uri: reply.user.avatarUrl }}
    />
  ), [reply.user.avatarUrl]);

  const renderMoreButton = useCallback(
    (props: ListLRProps) => (
      <MoreBtn {...props} data={reply.content} />
    ), [reply.content]);

  return (
    <List.Item
      style={beRepliedStyle}
      title={reply.user.nickname}
      titleStyle={{ color: appTheme.colors.secondary }}
      description={reply.content}
      descriptionStyle={{
        color: appTheme.colors.onSurfaceVariant
      }}
      descriptionNumberOfLines={20}
      left={renderLeft}
      right={renderMoreButton}
    />
  );
});

const styles = StyleSheet.create({
  beReplied: {
    marginLeft: '10%',
  },
});
