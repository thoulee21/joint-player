import React from 'react';
import { List, useTheme } from 'react-native-paper';

export const NoInternetItem = ({ error }: { error: any }) => {
    const appTheme = useTheme();
    return (
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
    );
};

export const RetryItem = ({ error, onRetry }: { error: any, onRetry: () => void }) => {
    const appTheme = useTheme();
    return (
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
    );
};

export const NoCommentsItem = () => {
    return (
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
    );
};
