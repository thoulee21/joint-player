import React from 'react';
import { List, useTheme } from 'react-native-paper';
import { LottieAnimation } from './LottieAnimation';

export const NoInternetItem = ({ error }: { error: any }) => {
    const appTheme = useTheme();
    return (
        <LottieAnimation animation="sushi">
            <List.Item
                left={props => (
                    <List.Icon
                        {...props}
                        color={appTheme.colors.error}
                        icon="alert-circle-outline"
                    />
                )}
                title="No internet connection"
                description={error.message}
            />
        </LottieAnimation>
    );
};

export const RetryItem = ({ error, onRetry }: { error: any, onRetry: () => void }) => {
    const appTheme = useTheme();
    return (
        <LottieAnimation animation="sushi">
            <List.Item
                left={props => (
                    <List.Icon
                        {...props}
                        color={appTheme.colors.error}
                        icon="alert-circle-outline"
                    />
                )}
                title="Failed to load comments. Tap to retry."
                description={error.message}
                onPress={onRetry}
            />
        </LottieAnimation>
    );
};

export const NoCommentsItem = () => {
    return (
        <LottieAnimation animation="watermelon">
            <List.Item
                left={props => (
                    <List.Icon
                        {...props}
                        icon="comment-outline"
                    />
                )}
                title="No comments"
                description="Be the first to comment!"
            />
        </LottieAnimation>
    );
};
