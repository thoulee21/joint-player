import {
  BottomSheetFlashList,
  BottomSheetFooter,
  type BottomSheetFooterProps,
  type BottomSheetModal,
} from "@gorhom/bottom-sheet";
import React, { useCallback, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { DeviceEventEmitter, StyleSheet, View } from "react-native";
import HapticFeedback, {
  HapticFeedbackTypes,
} from "react-native-haptic-feedback";
import { FAB, List, Tooltip } from "react-native-paper";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import TrackPlayer from "react-native-track-player";
import { useAppDispatch, useAppSelector } from "../hook";
import { queue, setQueue, setQueueAsync } from "../redux/slices";
import { TrackType } from "../services/GetTracksService";
import type { ListLRProps } from "../types/paperListItem";
import { BottomSheetPaper } from "./BottomSheetPaper";
import { TrackItem } from "./TrackItem";

export function TrackListSheet({
  bottomSheetRef,
}: {
  bottomSheetRef: React.RefObject<BottomSheetModal>;
}) {
  const dispatch = useAppDispatch();
  const { t } = useTranslation();
  const insets = useSafeAreaInsets();
  const tracks = useAppSelector(queue);

  const initQueue = useCallback(async () => {
    try {
      const playerQueue = await TrackPlayer.getQueue();

      if (playerQueue) {
        dispatch(setQueue(playerQueue as TrackType[]));
      }
    } catch {} // ignore player errors
  }, [dispatch]);

  useEffect(() => {
    const subscription = DeviceEventEmitter.addListener("loadEnd", initQueue);

    return () => {
      subscription.remove();
    };
  }, [initQueue]);

  const renderTrack = useCallback(
    ({ item, index }: { item: TrackType; index: number }) => {
      return <TrackItem item={item} index={index} />;
    },
    [],
  );

  const renderEmptyIcon = useCallback(
    (props: ListLRProps) => <List.Icon {...props} icon="information-outline" />,
    [],
  );

  const renderEmptyTrack = useCallback(() => {
    return (
      <List.Item
        title={t("tracklist.empty.title")}
        description={t("tracklist.empty.description")}
        left={renderEmptyIcon}
        style={styles.noTrack}
      />
    );
  }, [renderEmptyIcon, t]);

  const keyExtractor = useCallback((item: TrackType) => item.id.toString(), []);

  const renderFooter = useCallback(
    ({ animatedFooterPosition }: BottomSheetFooterProps) => (
      <BottomSheetFooter
        animatedFooterPosition={animatedFooterPosition}
        bottomInset={insets.bottom}
      >
        <View style={styles.footer}>
          <Tooltip title={t("tracklist.shuffle")}>
            <FAB
              icon="shuffle"
              visible={tracks.length >= 2}
              variant="surface"
              animated
              onPress={() => {
                HapticFeedback.trigger(HapticFeedbackTypes.effectClick);

                const shuffledQueue = [...tracks].sort(
                  () => 0.5 - Math.random(),
                );
                dispatch(setQueueAsync(shuffledQueue));
              }}
            />
          </Tooltip>
        </View>
      </BottomSheetFooter>
    ),
    [insets.bottom, t, tracks, dispatch],
  );

  return (
    <BottomSheetPaper ref={bottomSheetRef} footer={renderFooter}>
      <BottomSheetFlashList
        showsVerticalScrollIndicator={false}
        keyExtractor={keyExtractor}
        data={tracks}
        fadingEdgeLength={30}
        ListEmptyComponent={renderEmptyTrack}
        estimatedItemSize={96}
        renderItem={renderTrack}
      />
    </BottomSheetPaper>
  );
}

const styles = StyleSheet.create({
  noTrack: {
    marginHorizontal: "4%",
  },
  footer: {
    flexDirection: "row",
    flex: 1,
    justifyContent: "flex-end",
    margin: "4%",
  },
});
