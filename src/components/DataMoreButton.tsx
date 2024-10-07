import Clipboard from '@react-native-clipboard/clipboard';
import React, { useState } from 'react';
import { Share, ToastAndroid } from 'react-native';
import HapticFeedback from 'react-native-haptic-feedback';
import { IconButton, Menu } from 'react-native-paper';

export const DataMoreBtn = ({ data, props }: {
    data: any, props: { size: number }
}) => {
    const [menuVisible, setMenuVisible] = useState(false);
    return <Menu
        anchor={
            <IconButton
                {...props}
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
                Clipboard.setString(JSON.stringify(data));

                HapticFeedback.trigger('effectTick');
                ToastAndroid.show('Copied to clipboard', ToastAndroid.SHORT);
                setMenuVisible(false);
            }}
        />
        <Menu.Item
            leadingIcon="share-outline"
            title="Share"
            disabled={typeof data === 'undefined' || data === ''}
            onPress={() => {
                Share.share({ message: JSON.stringify(data) });

                HapticFeedback.trigger('effectTick');
                setMenuVisible(false);
            }}
        />
    </Menu>;
};
