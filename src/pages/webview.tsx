import Clipboard from '@react-native-clipboard/clipboard';
import { useNavigation, useRoute } from '@react-navigation/native';
import React, { useRef, useState } from 'react';
import {
  Linking,
  SafeAreaView,
  Share,
  StatusBar,
  StyleSheet,
  ToastAndroid,
  View,
} from 'react-native';
import HapticFeedback, {
  HapticFeedbackTypes,
} from 'react-native-haptic-feedback';
import {
  Appbar,
  Menu,
  ProgressBar,
  Tooltip,
  useTheme,
} from 'react-native-paper';
import { WebView } from 'react-native-webview';

export interface WebViewParams {
  url: string;
  title: string;
}

export const WebViewScreen = () => {
  const route = useRoute();
  const navigation = useNavigation();
  const appTheme = useTheme();

  const [loadProgress, setLoadProgress] = useState(0);
  const [menuVisible, setMenuVisible] = useState(false);
  const webViewRef = useRef<WebView>(null);

  const { url, title } = route.params as WebViewParams;

  const showMenu = () => {
    HapticFeedback.trigger(
      HapticFeedbackTypes.effectHeavyClick
    );
    setMenuVisible(true);
  };

  return (
    <SafeAreaView style={styles.webview}>
      <View style={{ marginTop: StatusBar.currentHeight }}>
        <Appbar>
          <Appbar.BackAction onPress={() => navigation.goBack()} />
          <Tooltip title="Reload">
            <Appbar.Action
              icon="reload"
              onPress={() => {
                webViewRef.current?.reload();
              }}
            />
          </Tooltip>
          <Appbar.Content title={title} />

          <Menu
            elevation={1}
            visible={menuVisible}
            onDismiss={() => setMenuVisible(false)}
            statusBarHeight={StatusBar.currentHeight}
            anchor={
              <Appbar.Action
                icon="dots-vertical"
                onPress={showMenu}
                onLongPress={showMenu}
              />
            }>
            <Menu.Item
              title="Copy Link"
              leadingIcon="link"
              onPress={() => {
                Clipboard.setString(url);
                setMenuVisible(false);
                ToastAndroid.show('Link copied!', ToastAndroid.SHORT);
              }}
            />

            <Menu.Item
              title="Share Link"
              leadingIcon="share"
              disabled={!url || !title}
              onPress={() => {
                Share.share({
                  message: url,
                  title: title,
                });
              }}
            />

            <Menu.Item
              title="Open in Browser"
              leadingIcon="open-in-app"
              onPress={() => {
                setMenuVisible(false);
                Linking.openURL(url);
              }}
            />

            <Menu.Item
              title="Clear Cache"
              leadingIcon="delete-outline"
              onPress={() => {
                if (webViewRef.current?.clearCache) {
                  webViewRef.current.clearCache(true);
                }
                setMenuVisible(false);
                ToastAndroid.show('Cache cleared!', ToastAndroid.SHORT);
              }}
            />
          </Menu>
        </Appbar>
        <ProgressBar
          animatedValue={loadProgress}
          visible={loadProgress !== 1}
        />
      </View>

      <WebView
        ref={webViewRef}
        style={{ backgroundColor: appTheme.colors.background }}
        source={{ uri: url }}
        onLoadProgress={({ nativeEvent }) => {
          setLoadProgress(nativeEvent.progress);
        }}
        onHttpError={(event) => {
          ToastAndroid.show(
            `${event.nativeEvent.statusCode.toString()}: ${event.nativeEvent.description}`,
            ToastAndroid.LONG,
          );
        }}
        onError={(event) => {
          ToastAndroid.show(
            `${event.nativeEvent.code}: ${event.nativeEvent.description}`,
            ToastAndroid.LONG,
          );
        }}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  webview: {
    flex: 1,
  },
});
