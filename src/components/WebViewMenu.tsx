import Clipboard from '@react-native-clipboard/clipboard';
import React, { useCallback, useState } from 'react';
import { Linking, Share, StatusBar, ToastAndroid } from 'react-native';
import HapticFeedback from 'react-native-haptic-feedback';
import { Appbar, Menu } from 'react-native-paper';
import WebView from 'react-native-webview';

export const WebViewMenu = ({ url, title, webViewRef }: {
    url: string;
    title: string;
    webViewRef: React.RefObject<WebView>;
}) => {
    const [menuVisible, setMenuVisible] = useState(false);

    const showMenu = useCallback(() => {
        setMenuVisible(true);
        HapticFeedback.trigger('effectHeavyClick');
    }, []);

    const copyLink = useCallback(() => {
        Clipboard.setString(url);
        HapticFeedback.trigger('effectTick');
        setMenuVisible(false);
        ToastAndroid.show('Link copied!', ToastAndroid.SHORT);
    }, [url]);

    const shareLink = useCallback(() => {
        HapticFeedback.trigger('effectTick');
        Share.share({
            message: url,
            title: title,
        });
    }, [url, title]);

    const openLinkInBrowser = useCallback(() => {
        HapticFeedback.trigger('effectTick');
        setMenuVisible(false);
        Linking.openURL(url);
    }, [url]);

    const clearCache = useCallback(() => {
        if (webViewRef.current?.clearCache) {
            webViewRef.current.clearCache(true);
        }

        HapticFeedback.trigger('effectTick');
        setMenuVisible(false);
        ToastAndroid.show('Cache cleared!', ToastAndroid.SHORT);
    }, [webViewRef]);

    return (
        <Menu
            visible={menuVisible}
            onDismiss={() => setMenuVisible(false)}
            statusBarHeight={StatusBar.currentHeight}
            anchor={
                <Appbar.Action
                    icon="dots-vertical"
                    onPress={showMenu}
                    onLongPress={showMenu}
                />
            }
        >
            <Menu.Item
                title="Copy Link"
                leadingIcon="link"
                onPress={copyLink}
            />
            <Menu.Item
                title="Share Link"
                leadingIcon="share"
                disabled={!url || !title}
                onPress={shareLink}
            />
            <Menu.Item
                title="Open in Browser"
                leadingIcon="open-in-app"
                onPress={openLinkInBrowser}
            />
            <Menu.Item
                title="Clear Cache"
                leadingIcon="delete-outline"
                onPress={clearCache}
            />
        </Menu>
    );
};
