import Clipboard from '@react-native-clipboard/clipboard';
import React, { useState } from 'react';
import { Share, StatusBar, ToastAndroid } from 'react-native';
import HapticFeedback from 'react-native-haptic-feedback';
import { IconButton, Menu } from 'react-native-paper';
import type { Style } from 'react-native-paper/lib/typescript/components/List/utils';

export const MoreBtn = ({ data, color, style }: {
    data: string, color: string, style?: Style
}) => {
    const [menuVisible, setMenuVisible] = useState(false);

    const onPostPressed = () => {
        HapticFeedback.trigger('effectTick');
        setMenuVisible(false);
    };

    return <Menu
        elevation={1}
        statusBarHeight={StatusBar.currentHeight}
        anchor={
            <IconButton
                icon="dots-vertical"
                iconColor={color}
                style={style}
                onPress={() => {
                    HapticFeedback.trigger('effectHeavyClick');
                    setMenuVisible(true);
                }}
            />}
        visible={menuVisible}
        onDismiss={() => setMenuVisible(false)}
    >
        <Menu.Item
            leadingIcon="clipboard-outline"
            title="Copy"
            onPress={() => {
                Clipboard.setString(data);
                ToastAndroid.show('Copied to clipboard', ToastAndroid.SHORT);
                onPostPressed();
            }}
        />
        <Menu.Item
            leadingIcon="share-outline"
            title="Share"
            disabled={typeof data === 'undefined' || data === ''}
            onPress={() => {
                Share.share({ message: data });
                onPostPressed();
            }}
        />
    </Menu>;
};
