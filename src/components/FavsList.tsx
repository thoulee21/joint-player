import React, { useCallback, useRef } from "react";
import {
  Dimensions,
  StyleSheet,
  useWindowDimensions,
  View,
} from "react-native";
import DraggableFlatList, {
  ScaleDecorator,
  type RenderItemParams,
} from "react-native-draggable-flatlist";
import HapticFeedback, {
  HapticFeedbackTypes,
} from "react-native-haptic-feedback";
import { Divider, Text, useTheme } from "react-native-paper";
import { useAppDispatch, useAppSelector } from "../hook";
import { favs, setFavs } from "../redux/slices";
import { TrackType } from "../services/GetTracksService";
import { LottieAnimation } from "./LottieAnimation";
import { PoweredBy } from "./PoweredBy";
import { AddToQueueButton, DeleteFavButton } from "./QuickActions";
import { SongItem } from "./SongItem";
import { SwipeableItemWrapper } from "./SwipeableItemWrapper";
import { SwipeableUnderlay } from "./SwipeableUnderlay";

const NoFavs = () => (
  <LottieAnimation
    animation="teapot"
    caption="Add some songs to your favorites"
    style={{
      height: Dimensions.get("window").height / 1.2,
      width: Dimensions.get("window").width,
    }}
  >
    <Text style={styles.noFavs} variant="titleLarge">
      No favorites yet
    </Text>
  </LottieAnimation>
);

export const FavsList = () => {
  const dispatch = useAppDispatch();
  const appTheme = useTheme();

  const { height } = useWindowDimensions();
  const favorites = useAppSelector(favs);
  const itemRefs = useRef(new Map());

  const renderUnderlayRight = useCallback(
    () => (
      <SwipeableUnderlay
        mode="right"
        backgroundColor={appTheme.colors.errorContainer}
      >
        <DeleteFavButton />
      </SwipeableUnderlay>
    ),
    [appTheme],
  );

  const renderUnderlayLeft = useCallback(
    () => (
      <SwipeableUnderlay
        mode="left"
        backgroundColor={appTheme.colors.surfaceVariant}
      >
        <AddToQueueButton />
      </SwipeableUnderlay>
    ),
    [appTheme],
  );

  const renderItem = useCallback(
    ({ getIndex, drag, item, isActive }: RenderItemParams<TrackType>) => {
      const index = getIndex() || 0;

      const performDrag = () => {
        HapticFeedback.trigger(HapticFeedbackTypes.effectTick);
        drag();
      };

      return (
        <ScaleDecorator>
          <SwipeableItemWrapper
            item={item}
            itemRefs={itemRefs}
            renderUnderlayLeft={renderUnderlayLeft}
            renderUnderlayRight={renderUnderlayRight}
          >
            <SongItem
              item={item}
              index={index}
              drag={performDrag}
              showAlbum
              isActive={isActive}
            />
          </SwipeableItemWrapper>
        </ScaleDecorator>
      );
    },
    [renderUnderlayLeft, renderUnderlayRight],
  );

  const keyExtractor = useCallback((item: TrackType) => item.id.toString(), []);

  const updateFavs = useCallback(
    ({ data: draggedData }: { data: TrackType[] }) => {
      dispatch(setFavs(draggedData));
    },
    [dispatch],
  );

  return (
    <DraggableFlatList
      data={favorites}
      renderItem={renderItem}
      keyExtractor={keyExtractor}
      containerStyle={[
        styles.favs,
        {
          backgroundColor: appTheme.colors.surface,
        },
      ]}
      ListEmptyComponent={<NoFavs />}
      ItemSeparatorComponent={Divider}
      onDragEnd={updateFavs}
      activationDistance={20}
      ListFooterComponent={
        <>
          <PoweredBy />
          <View style={{ height: height / 10 }} />
        </>
      }
    />
  );
};

const styles = StyleSheet.create({
  favs: {
    flex: 1,
  },
  noFavs: {
    textAlign: "center",
  },
});
