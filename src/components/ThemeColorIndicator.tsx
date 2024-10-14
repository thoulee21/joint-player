import Clipboard from '@react-native-clipboard/clipboard';
import React, { useCallback } from 'react';
import { ToastAndroid } from 'react-native';
import HapticFeedback, { HapticFeedbackTypes } from 'react-native-haptic-feedback';
import { List, useTheme } from 'react-native-paper';
import type { ListLRProps } from '../types/paperListItem';

export function ThemeColorIndicator() {
    const appTheme = useTheme();

    const renderIcon = useCallback((props: ListLRProps) => (
        <List.Icon {...props} icon="palette-outline" />
    ), []);

    const renderIndicator = useCallback((props: ListLRProps) => (
        <List.Icon
            {...props}
            icon="square-rounded"
            color={appTheme.colors.primary}
        />
    ), [appTheme.colors.primary]);

    const copyColor = useCallback(() => {
        Clipboard.setString(appTheme.colors.primary);

        HapticFeedback.trigger(HapticFeedbackTypes.impactLight);
        ToastAndroid.show('Color copied to clipboard', ToastAndroid.SHORT);
    }, [appTheme.colors.primary]);

    return (
        <List.Item
            title="Theme Color"
            description={appTheme.colors.primary}
            left={renderIcon}
            right={renderIndicator}
            onLongPress={copyColor}
        />
    );
}
