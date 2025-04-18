import React, { memo, useCallback, useMemo, useState } from "react";
import { SectionList } from "react-native";
import HapticFeedback, {
  HapticFeedbackTypes,
} from "react-native-haptic-feedback";
import { FAB } from "react-native-paper";
import { Main as CommentsMain } from "../types/comments";
import { Section } from "./CommentList";

export const ScrollToBtns = memo(
  ({
    showData,
    commentsRef,
    data,
    atTop,
  }: {
    showData: Section[];
    commentsRef: React.RefObject<SectionList>;
    data: CommentsMain[] | undefined;
    atTop: boolean;
  }) => {
    const [expended, setExpended] = useState(false);

    const actions = useMemo(
      () =>
        showData.map((section, index) => ({
          icon:
            section.title === "Hot Comments" ? "fire" : "comment-text-outline",
          label: section.title,
          onPress: () => {
            commentsRef.current?.scrollToLocation({
              sectionIndex: index,
              itemIndex: 0,
              viewPosition: 0,
              viewOffset: 0,
              animated: true,
            });
          },
        })),
      [commentsRef, showData],
    );

    const onStateChange = useCallback(({ open }: { open: boolean }) => {
      HapticFeedback.trigger(HapticFeedbackTypes.effectHeavyClick);
      setExpended(open);
    }, []);

    const scrollToTop = useCallback(() => {
      HapticFeedback.trigger(HapticFeedbackTypes.effectClick);
      commentsRef.current?.scrollToLocation({
        sectionIndex: 0,
        itemIndex: 0,
        viewPosition: 0,
        viewOffset: 0,
        animated: true,
      });
    }, [commentsRef]);

    ScrollToBtns.displayName = "ScrollToBtns";

    return (
      <FAB.Group
        icon={expended ? "chevron-down" : "comment-arrow-right-outline"}
        variant="surface"
        visible={(data ?? [])[0]?.total > 10 && !atTop}
        open={expended}
        onStateChange={onStateChange}
        actions={actions}
        onLongPress={scrollToTop}
      />
    );
  },
);
