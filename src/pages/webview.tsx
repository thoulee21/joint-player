import Clipboard from '@react-native-clipboard/clipboard';
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

export const WebViewScreen = ({
  route,
  navigation,
}: {
  route: any;
  navigation: any;
}) => {
  const [loadProgress, setLoadProgress] = useState(0);
  const [menuVisible, setMenuVisible] = useState(false);

  const webViewRef = useRef<WebView>(null);

  const appTheme = useTheme();

  const { url, title } = route.params;

  const showMenu = () => {
    HapticFeedback.trigger(HapticFeedbackTypes.effectTick);
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
              title="Copy link"
              leadingIcon="link"
              onPress={() => {
                Clipboard.setString(url);
                setMenuVisible(false);
                ToastAndroid.show('Link copied!', ToastAndroid.SHORT);
              }}
            />

            <Menu.Item
              title="Share link"
              leadingIcon="share"
              onPress={() => {
                Share.share({
                  message: url,
                  title: title,
                });
              }}
            />

            <Menu.Item
              title="Open in browser"
              leadingIcon="open-in-app"
              onPress={() => {
                setMenuVisible(false);
                Linking.openURL(url);
              }}
            />

            <Menu.Item
              title="Clear cache"
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
        onLoadProgress={({ nativeEvent }: { nativeEvent: any }) => {
          setLoadProgress(nativeEvent.progress);
        }}
        onHttpError={(event: any) => {
          ToastAndroid.show(
            `${event.nativeEvent.statusCode.toString()}: ${event.nativeEvent.description
            }`,
            ToastAndroid.LONG,
          );
        }}
        onError={(event: any) => {
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
