import Clipboard from '@react-native-clipboard/clipboard';
import React, { memo, useCallback, useState } from 'react';
import { Share, StyleSheet, ToastAndroid, TouchableOpacity, View } from 'react-native';
import HapticFeedback, { HapticFeedbackTypes } from 'react-native-haptic-feedback';
import { Avatar, Button, Caption, List, Text, useTheme } from 'react-native-paper';
import type { EllipsizeProp } from 'react-native-paper/src/types';
import { Comment } from '../types/comments';
import type { ListLRProps } from '../types/paperListItem';
import { BeRepliedComment } from './BeRepliedComment';

export const CommentItem = memo((
  { item }: { item: Comment }
) => {
  const appTheme = useTheme();
  const [liked, setLiked] = useState(false);

  const commentContent = ({
    ellipsizeMode,
    color: descriptionColor,
    fontSize,
  }: {
    selectable: boolean;
    ellipsizeMode: EllipsizeProp | undefined;
    color: string;
    fontSize: number;
  }) => (
    <View style={[styles.container, styles.column]}>
      <TouchableOpacity
        onLongPress={() => {
          HapticFeedback.trigger(
            HapticFeedbackTypes.effectHeavyClick
          );
          Clipboard.setString(item.content);
          ToastAndroid.show(
            'Copied to clipboard!',
            ToastAndroid.SHORT
          );
        }}
      >
        <Text
          ellipsizeMode={ellipsizeMode}
          style={{ color: descriptionColor, fontSize }}
        >
          {item.content}
        </Text>
      </TouchableOpacity>

      <View
        style={[
          styles.container,
          styles.row,
          styles.additionalPadding
        ]}
      >
        <Button
          icon={liked ? 'thumb-up' : 'thumb-up-outline'}
          textColor={!liked
            ? appTheme.colors.onSurfaceVariant
            : undefined}
          compact
          onPress={() => {
            HapticFeedback.trigger(
              HapticFeedbackTypes.effectClick
            );
            setLiked(prev => {
              const newLiked = !prev;
              if (newLiked) {
                ToastAndroid.show(
                  'Thanks for showing your support!',
                  ToastAndroid.SHORT
                );
              } else {
                ToastAndroid.show(
                  'Feedback received!',
                  ToastAndroid.SHORT
                );
              }
              return newLiked;
            });
          }}
        >
          {liked ? item.likedCount + 1 : item.likedCount}
        </Button>
        <Button
          icon="share-outline"
          textColor={appTheme.colors.onSurfaceVariant}
          compact
          onPress={() => {
            Share.share({ message: item.content });
          }}
        >
          Share
        </Button>
      </View>
    </View>
  );

  const renderTitle = useCallback(({
    ellipsizeMode, color: titleColor, fontSize
  }: {
    selectable: boolean;
    ellipsizeMode: EllipsizeProp | undefined;
    color: string;
    fontSize: number;
  }) => (
    <View style={[
      styles.container,
      styles.row,
      styles.customTitle
    ]}>
      <Text
        ellipsizeMode={ellipsizeMode}
        style={{ color: titleColor, fontSize }}
      >
        {item.user.nickname}
      </Text>
      <Caption>
        {item.timeStr}
        {item.ipLocation.location && ` · ${item.ipLocation.location}`}
      </Caption>
    </View>
  ), [item]);

  const renderLeft = useCallback(
    ({ color, style }: ListLRProps) => (
      <Avatar.Image
        style={[style, styles.avatar, {
          backgroundColor: color
        }]}
        source={{ uri: item.user.avatarUrl }}
        size={50}
      />
    ), [item.user.avatarUrl]);

  return (
    <>
      <List.Item
        title={renderTitle}
        titleStyle={{ color: appTheme.colors.primary }}
        description={commentContent}
        descriptionStyle={{
          color: appTheme.colors.onBackground
        }}
        descriptionNumberOfLines={20}
        left={renderLeft}
      />
      {item.beReplied.length === 1 && (
        <BeRepliedComment reply={item.beReplied[0]} />
      )}
    </>
  );
});

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  avatar: {
    alignSelf: 'flex-start',
  },
  row: {
    flexDirection: 'row',
  },
  column: {
    flexDirection: 'column',
  },
  customTitle: {
    alignItems: 'center',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
  },
  additionalPadding: {
    paddingTop: 8,
  },
});
