import Clipboard from "@react-native-clipboard/clipboard";
import React, { useCallback, useState } from "react";
import { useTranslation } from "react-i18next";
import { Linking, Share, StatusBar, ToastAndroid } from "react-native";
import HapticFeedback from "react-native-haptic-feedback";
import { Appbar, Menu } from "react-native-paper";
import WebView from "react-native-webview";

export const WebViewMenu = ({
  url,
  title,
  webViewRef,
}: {
  url: string;
  title: string;
  webViewRef: React.RefObject<WebView>;
}) => {
  const { t } = useTranslation();
  const [menuVisible, setMenuVisible] = useState(false);

  const showMenu = useCallback(() => {
    setMenuVisible(true);
    HapticFeedback.trigger("effectHeavyClick");
  }, []);

  const copyLink = useCallback(() => {
    Clipboard.setString(url);

    HapticFeedback.trigger("effectTick");
    setMenuVisible(false);
    ToastAndroid.show(t("webview.menu.copy.toast"), ToastAndroid.SHORT);
  }, [t, url]);

  const shareLink = useCallback(() => {
    Share.share({
      message: url,
      title: title,
    });

    HapticFeedback.trigger("effectTick");
  }, [url, title]);

  const clearCache = useCallback(() => {
    if (webViewRef.current?.clearCache) {
      webViewRef.current.clearCache(true);
    }

    HapticFeedback.trigger("effectTick");
    setMenuVisible(false);
    ToastAndroid.show(t("webview.menu.clear.toast"), ToastAndroid.SHORT);
  }, [t, webViewRef]);

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
        title={t("webview.appbar.openInBrowser")}
        leadingIcon="open-in-new"
        onPress={() => {
          Linking.openURL(url);
          setMenuVisible(false);
        }}
      />
      <Menu.Item
        title={t("webview.menu.copy.title")}
        leadingIcon="link"
        onPress={copyLink}
      />
      <Menu.Item
        title={t("webview.menu.share.title")}
        leadingIcon="share"
        disabled={!url || !title}
        onPress={shareLink}
      />
      <Menu.Item
        title={t("settings.data.cache.title")}
        leadingIcon="delete-outline"
        onPress={clearCache}
      />
    </Menu>
  );
};
