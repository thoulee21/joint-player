import React, { useCallback } from 'react';
import { List, useTheme } from 'react-native-paper';
import type { ListLRProps } from '../types/paperListItem';
import { LottieAnimation } from './LottieAnimation';

const AlertIcon = (props: ListLRProps) => {
    const appTheme = useTheme();
    return (
        <List.Icon
            {...props}
            color={appTheme.colors.error}
            icon="alert-circle-outline"
        />
    );
};
export const NoInternetItem = ({ error }: { error: any }) => {
    return (
        <LottieAnimation animation="breathe">
            <List.Item
                left={AlertIcon}
                title="No internet connection"
                description={error.message}
            />
        </LottieAnimation>
    );
};

export const RetryItem = ({ error, onRetry }: { error: any, onRetry: () => void }) => {
    return (
        <LottieAnimation animation="breathe">
            <List.Item
                left={AlertIcon}
                title="Failed to load comments. Tap to retry."
                description={error.message}
                onPress={onRetry}
            />
        </LottieAnimation>
    );
};

export const NoCommentsItem = () => {
    const renderCommentIcon = useCallback((props: ListLRProps) => (
        <List.Icon
            {...props}
            icon="comment-outline"
        />
    ), []);

    return (
        <LottieAnimation animation="teapot">
            <List.Item
                left={renderCommentIcon}
                title="No comments"
                description="Be the first to comment!"
            />
        </LottieAnimation>
    );
};
