import Clipboard from '@react-native-clipboard/clipboard';
import React from 'react';
import { ToastAndroid } from 'react-native';
import HapticFeedback, {
    HapticFeedbackTypes,
} from 'react-native-haptic-feedback';
import { List, useTheme } from 'react-native-paper';

export function ThemeColorIndicator() {
    const appTheme = useTheme();
    return (
        <List.Item
            title="Theme Color"
            description={appTheme.colors.primary}
            left={props => <List.Icon {...props} icon="palette-outline" />}
            right={() => (
                <List.Icon
                    icon="square-rounded"
                    color={appTheme.colors.primary}
                />
            )}
            onLongPress={() => {
                Clipboard.setString(appTheme.colors.primary);
                HapticFeedback.trigger(HapticFeedbackTypes.effectTick);
                ToastAndroid.show('Color copied to clipboard', ToastAndroid.SHORT);
            }}
        />
    );
}
