import { useNavigation } from '@react-navigation/native';
import type { StackNavigationOptions } from '@react-navigation/stack';
import React, { useCallback, useEffect, useLayoutEffect, useState } from 'react';
import { Alert, ScrollView, StyleSheet } from 'react-native';
import RNFS from 'react-native-fs';
import { ActivityIndicator, Appbar, Caption, useTheme } from 'react-native-paper';

export const Logcat = () => {
  const navigation = useNavigation();
  const appTheme = useTheme();

  const [logContent, setLogContent] = useState('');
  const [isLoaded, setIsLoaded] = useState(false);

  const clearLogs = useCallback(async () => {
    setIsLoaded(false);
    await RNFS.unlink(
      RNFS.DocumentDirectoryPath + '/log'
    );
    setLogContent('');

    setIsLoaded(true);
  }, []);

  const renderClearButton = useCallback(() => (
    <Appbar.Action
      icon="delete"
      iconColor={appTheme.colors.error}
      onPress={() => {
        Alert.alert(
          'Clear logs',
          'Are you sure you want to clear logs?',
          [
            { text: 'Cancel', style: 'cancel' },
            { text: 'OK', onPress: clearLogs },
          ],
          { cancelable: true }
        );
      }}
    />
  ), [appTheme.colors.error, clearLogs]);

  const renderRefreshButton = useCallback((
    { tintColor }: { tintColor?: string }
  ) => (
    <Appbar.Action
      icon="refresh"
      iconColor={tintColor}
      onPress={() => {
        setIsLoaded(false);
      }}
    />
  ), []);

  useLayoutEffect(() => {
    navigation.setOptions({
      headerShown: true,
      headerLeft: renderClearButton,
      headerRight: renderRefreshButton,
    } as StackNavigationOptions);
  }, [navigation, renderClearButton, renderRefreshButton]);

  useEffect(() => {
    const readeLog = async () => {
      const log = await RNFS.readFile(
        RNFS.DocumentDirectoryPath + '/log',
        'utf8'
      );
      setLogContent(log);
    };

    if (!isLoaded) {
      readeLog().then(() => {
        setIsLoaded(true);
      });
    }
  }, [isLoaded]);

  return (
    <ScrollView
      style={styles.root}
      contentContainerStyle={styles.content}
    >
      {isLoaded ? (
        <Caption selectable>
          {logContent ?? 'No log content'}
        </Caption>
      ) : (
        <ActivityIndicator
          size="large"
          style={styles.loading}
        />
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
  content: {
    paddingHorizontal: '4%',
  },
  loading: {
    marginTop: '50%',
  }
});
