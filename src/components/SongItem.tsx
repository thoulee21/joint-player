import Color from "color";
import { Image } from "expo-image";
import React, { memo, useCallback, useMemo } from "react";
import { ViewStyle } from "react-native";
import HapticFeedback, {
  HapticFeedbackTypes,
} from "react-native-haptic-feedback";
import { IconButton, List, useTheme } from "react-native-paper";
import TrackPlayer from "react-native-track-player";
import { useAppDispatch } from "../hook/reduxHooks";
import { clearAddOneAsync } from "../redux/slices/queue";
import { TrackType } from "../services/GetTracksService";
import type { ListLRProps } from "../types/paperListItem";
import { IndexOfSong } from "./IndexOfSong";

export const SongItem = memo(
  ({
    item,
    index,
    style,
    showAlbum,
    showIndex,
    drag,
    isActive,
  }: {
    item: TrackType;
    index: number;
    style?: ViewStyle;
    showAlbum?: boolean;
    showIndex?: boolean;
    drag?: () => void;
    isActive?: boolean;
  }) => {
    const dispatch = useAppDispatch();
    const appTheme = useTheme();

    const songStyle = useMemo(
      () => [
        {
          backgroundColor: isActive
            ? Color(appTheme.colors.secondaryContainer).fade(0.1).string()
            : appTheme.colors.surface,
        },
        style,
      ],
      [style, isActive, appTheme]
    );

    const play = useCallback(async () => {
      HapticFeedback.trigger(HapticFeedbackTypes.effectHeavyClick);
      await dispatch(clearAddOneAsync(item));
      await TrackPlayer.play();
    }, [dispatch, item]);

    const renderIndex = useCallback(
      (props: ListLRProps) => <IndexOfSong {...props} index={index} />,
      [index]
    );

    const description = useMemo(() => {
      const artists = item.artists.map((ar) => ar.name).join(", ");

      if (showAlbum) {
        return artists.concat("\n", item.album);
      } else {
        return artists;
      }
    }, [item.album, item.artists, showAlbum]);

    const renderMusicImage = useCallback(
      (props: ListLRProps) => (
        <Image
          style={[props.style, { borderRadius: 5, aspectRatio: 1, height: 60 }]}
          source={{ uri: item.artwork }}
        />
      ),
      [item.artwork]
    );

    const renderLeft = useMemo(
      () => (props: ListLRProps) =>
        showIndex ? renderIndex(props) : renderMusicImage(props),
      [renderIndex, renderMusicImage, showIndex]
    );

    const renderDragIndicator = useCallback(
      (props: ListLRProps) =>
        drag && (
          <IconButton
            {...props}
            icon="drag"
            size={24}
            onLongPress={drag}
            testID="drag-handle"
          />
        ),
      [drag]
    );

    return (
      <List.Item
        title={item.title}
        left={renderLeft}
        right={renderDragIndicator}
        description={description}
        descriptionNumberOfLines={2}
        onPress={play}
        style={songStyle}
      />
    );
  }
);

SongItem.displayName = "SongItem";
