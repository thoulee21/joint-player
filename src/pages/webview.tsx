import { useNavigation, useRoute } from '@react-navigation/native';
import React, { useRef, useState } from 'react';
import { SafeAreaView, StatusBar, StyleSheet, ToastAndroid, View } from 'react-native';
import { Appbar, ProgressBar, Tooltip, useTheme } from 'react-native-paper';
import { WebView } from 'react-native-webview';
import { WebViewMenu } from '../components/WebViewMenu';

export interface WebViewParams {
  url: string;
  title: string;
}

export const WebViewScreen = () => {
  const route = useRoute();
  const navigation = useNavigation();
  const appTheme = useTheme();

  const [loadProgress, setLoadProgress] = useState(0);
  const webViewRef = useRef<WebView>(null);
  const { url, title } = route.params as WebViewParams;

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
          <WebViewMenu
            url={url}
            title={title}
            webViewRef={webViewRef}
          />
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
