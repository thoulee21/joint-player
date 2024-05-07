import React, { memo, useCallback, useMemo, useState } from 'react';
import { SectionList } from 'react-native';
import HapticFeedback, { HapticFeedbackTypes } from 'react-native-haptic-feedback';
import { FAB, Portal } from 'react-native-paper';
import type { Section } from '.';
import { Main as CommentsMain } from '../types/comments';

export const ScrollToBtns = memo(({ showData, commentsRef, data }:
    {
        showData: Section[],
        commentsRef: React.RefObject<SectionList>,
        data: CommentsMain[] | undefined
    }
) => {
    const [expended, setExpended] = useState(false);

    const actions = useMemo(() => showData.map((section, index) => ({
        icon: section.title === 'Hot Comments'
            ? 'fire' : 'comment-text-outline',
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
        // no commentsRef
        // eslint-disable-next-line react-hooks/exhaustive-deps
    })), [showData]);

    const onStateChange = useCallback(({ open }: { open: boolean }) => {
        HapticFeedback.trigger(HapticFeedbackTypes.effectHeavyClick);
        setExpended(open);
    }, []);

    const scrollToTop = useCallback(() => {
        HapticFeedback.trigger(
            HapticFeedbackTypes.effectClick
        );
        commentsRef.current?.scrollToLocation({
            sectionIndex: 0,
            itemIndex: 0,
            viewPosition: 0,
            viewOffset: 0,
            animated: true,
        });
        // no commentsRef
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <Portal>
            <FAB.Group
                icon={expended
                    ? 'chevron-down' :
                    'comment-arrow-right-outline'}
                variant="surface"
                visible={(data ?? [])[0]?.total > 10}
                open={expended}
                onStateChange={onStateChange}
                actions={actions}
                onLongPress={scrollToTop}
            />
        </Portal>
    );
});
