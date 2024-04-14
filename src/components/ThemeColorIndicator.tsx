import Clipboard from '@react-native-clipboard/clipboard';
import React from 'react';
import { ToastAndroid } from 'react-native';
import { List, useTheme } from 'react-native-paper';

export function ThemeColorIndicator() {
    const appTheme = useTheme();
    return (
        <List.Item
            title="Theme Color"
            description={appTheme.colors.primary}
            left={props => <List.Icon {...props} icon="palette" />}
            right={() => (
                <List.Icon
                    icon="square-rounded"
                    color={appTheme.colors.primary}
                />
            )}
            onLongPress={() => {
                Clipboard.setString(appTheme.colors.primary);
                ToastAndroid.show('Color copied to clipboard', ToastAndroid.SHORT);
            }}
        />
    );
}
