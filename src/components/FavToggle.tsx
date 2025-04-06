import React, { useCallback, useMemo } from "react";
import type { StyleProp, ViewStyle } from "react-native";
import HapticFeedback, {
  HapticFeedbackTypes,
} from "react-native-haptic-feedback";
import { IconButton, useTheme } from "react-native-paper";
import { useActiveTrack } from "react-native-track-player";
import { useAppDispatch, useAppSelector } from "../hook";
import { addFav, favs, removeFav } from "../redux/slices";
import { TrackType } from "../services/GetTracksService";

export const FavToggle = ({ style }: { style?: StyleProp<ViewStyle> }) => {
  const dispatch = useAppDispatch();
  const appTheme = useTheme();

  const favorites = useAppSelector(favs);
  const track = useActiveTrack();

  const isFav = useMemo(() => {
    return favorites.some((fav) => fav.id === track?.id);
  }, [favorites, track?.id]);

  const toggleFav = useCallback(() => {
    if (track) {
      HapticFeedback.trigger(HapticFeedbackTypes.effectHeavyClick);

      if (isFav) {
        dispatch(removeFav(track as TrackType));
      } else {
        dispatch(addFav(track as TrackType));
      }
    }
  }, [isFav, track, dispatch]);

  return (
    <IconButton
      icon={isFav ? "heart" : "heart-outline"}
      size={24}
      iconColor={isFav ? appTheme.colors.tertiary : undefined}
      animated
      style={style}
      onPress={toggleFav}
    />
  );
};
