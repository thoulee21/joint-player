import React, { PropsWithChildren } from "react";
import { StyleSheet } from "react-native";
import { useAnimatedStyle } from "react-native-reanimated";
import { useSwipeableItemParams } from "react-native-swipeable-item";
import { TrackType } from "../services/GetTracksService";
import { QuickActionsWrapper } from "./QuickActions";

/**
 * SwipeableUnderlay component provides an animated underlay for swipeable items.
 * It fades in when the item is swiped open.
 *
 * @param {object} props - The properties object.
 * @param {React.ReactNode} props.children - The child components to be rendered inside the underlay.
 * @param {'left' | 'right'} props.mode - The mode indicating slide direction.
 * @param {string} props.backgroundColor - The background color of the underlay.
 *
 * @returns {JSX.Element} The rendered SwipeableUnderlay component.
 */
export const SwipeableUnderlay = ({
  children,
  mode,
  backgroundColor,
}: PropsWithChildren<{
  mode: "left" | "right";
  backgroundColor: string;
}>): JSX.Element => {
  const { percentOpen } = useSwipeableItemParams<TrackType>();

  // Fade in on open
  const animStyle = useAnimatedStyle(
    () => ({ opacity: percentOpen.value }),
    [percentOpen],
  );

  const underlayStyle =
    mode === "right" ? styles.underlayRight : styles.underlayLeft;

  return (
    <QuickActionsWrapper
      style={[styles.row, underlayStyle, animStyle, { backgroundColor }]}
    >
      {children}
    </QuickActionsWrapper>
  );
};

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 15,
  },
  underlayRight: {
    flex: 1,
    justifyContent: "flex-start",
  },
  underlayLeft: {
    flex: 1,
    justifyContent: "flex-end",
  },
});
