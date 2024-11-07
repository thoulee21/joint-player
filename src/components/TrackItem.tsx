import Color from 'color';
import React, { useCallback, useRef } from 'react';
import { TextStyle } from 'react-native';
import * as Animatable from 'react-native-animatable';
import HapticFeedback, { HapticFeedbackTypes } from 'react-native-haptic-feedback';
import { IconButton, List, useTheme } from 'react-native-paper';
import { Style } from 'react-native-paper/lib/typescript/components/List/utils';
import TrackPlayer, { useActiveTrack } from 'react-native-track-player';
import { useAppDispatch } from '../hook';
import { removeFromQueueAsync } from '../redux/slices';
import { TrackType } from '../services/GetTracksService';
import type { ListLRProps } from '../types/paperListItem';

export interface ListRightProps {
  color: string;
  style?: Style;
}

export const TrackItem = ({
  item, index, onLongPress,
}: {
  item: TrackType;
  index: number;
  onLongPress?: () => void;
}) => {
  const dispatch = useAppDispatch();
  const appTheme = useTheme();
  const aniRef = useRef<Animatable.View>(null);
  const currentTrack = useActiveTrack();

  const active = currentTrack?.url === item.url;
  const titleStyle: TextStyle = {
    color: active
      ? appTheme.colors.primary
      : appTheme.colors.onBackground,
    fontWeight: active ? 'bold' : 'normal',
  };

  const chooseTrack = useCallback(async () => {
    if (!active) {
      await TrackPlayer.skip(index);
      await TrackPlayer.play();
    }
  }, [active, index]);

  const remove = useCallback(async () => {
    HapticFeedback.trigger(
      HapticFeedbackTypes.effectDoubleClick
    );
    if (aniRef.current?.fadeOutLeft) {
      const { finished } =
        await aniRef.current.fadeOutLeft(300);
      if (finished) {
        await dispatch(
          removeFromQueueAsync(index)
        );
      }
    }
  }, [dispatch, index]);

  const renderRemoveBtn = useCallback(
    (props: ListRightProps) => (
      active || (
        <IconButton
          {...props}
          icon="close"
          iconColor={appTheme.dark
            ? appTheme.colors.onSurfaceDisabled
            : appTheme.colors.backdrop}
          onPress={remove}
        />
      )
    ), [appTheme, remove, active]);

  const renderIcon = useCallback(
    ({ color, style }: ListLRProps) => (
      <List.Icon
        style={style}
        color={active ? appTheme.colors.primary : color}
        icon={active ? 'music-circle' : 'music-circle-outline'}
      />
    ), [active, appTheme.colors.primary]);

  const listStyle = {
    backgroundColor: active
      ? Color(appTheme.colors.secondaryContainer)
        .fade(appTheme.dark ? 0.4 : 0.6).string()
      : undefined,
  };

  return (
    <Animatable.View
      ref={aniRef}
      animation="fadeIn"
      duration={500}
      delay={index * 100}
      useNativeDriver
    >
      <List.Item
        title={item.title}
        description={item.artist}
        onPress={chooseTrack}
        onLongPress={onLongPress}
        descriptionNumberOfLines={1}
        titleStyle={titleStyle}
        style={listStyle}
        left={renderIcon}
        right={renderRemoveBtn}
      />
    </Animatable.View>
  );
};
