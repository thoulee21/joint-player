import { useNavigation, useRoute } from '@react-navigation/native';
import React, { useCallback, useRef, useState } from 'react';
import { StyleSheet, ToastAndroid, View } from 'react-native';
import { Appbar, ProgressBar, useTheme } from 'react-native-paper';
import { WebView } from 'react-native-webview';
import {
  WebViewErrorEvent,
  WebViewHttpErrorEvent,
  WebViewProgressEvent,
} from 'react-native-webview/lib/WebViewTypes';
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

  const updateProgress = useCallback((
    { nativeEvent }: WebViewProgressEvent,
  ) => {
    setLoadProgress(nativeEvent.progress);
  }, []);

  const toastHttpError = useCallback((event: WebViewHttpErrorEvent) => {
    ToastAndroid.show(
      `${event.nativeEvent.statusCode.toString()}: ${event.nativeEvent.description}`,
      ToastAndroid.LONG,
    );
  }, []);

  const toastError = useCallback((event: WebViewErrorEvent) => {
    ToastAndroid.show(
      `${event.nativeEvent.code}: ${event.nativeEvent.description}`,
      ToastAndroid.LONG,
    );
  }, []);

  return (
    <View style={styles.container}>
      <Appbar>
        <Appbar.BackAction
          onPress={() => navigation.goBack()}
        />
        <Appbar.Action
          icon="reload"
          onPress={() => {
            webViewRef.current?.reload();
          }}
        />
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

      <WebView
        ref={webViewRef}
        style={{
          backgroundColor: appTheme.colors.background,
        }}
        source={{ uri: url }}
        onLoadProgress={updateProgress}
        onHttpError={toastHttpError}
        onError={toastError}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
