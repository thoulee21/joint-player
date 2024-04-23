import Clipboard from '@react-native-clipboard/clipboard';
import React, { useState } from 'react';
import { Share, ToastAndroid } from 'react-native';
import HapticFeedback from 'react-native-haptic-feedback';
import { IconButton, Menu } from 'react-native-paper';

export const MoreBtn = ({ data }: { data: string }) => {
    const [menuVisible, setMenuVisible] = useState(false);

    const onPostPressed = () => {
        HapticFeedback.trigger('effectTick');
        setMenuVisible(false);
    };

    return <Menu
        anchor={
            <IconButton
                icon="dots-vertical"
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
