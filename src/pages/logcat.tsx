import { useNavigation } from '@react-navigation/native';
import type { StackNavigationOptions } from '@react-navigation/stack';
import React, { useCallback, useEffect, useLayoutEffect, useState } from 'react';
import { Alert, ScrollView, StyleSheet, View } from 'react-native';
import RNFS from 'react-native-fs';
import { ActivityIndicator, Appbar, Caption, useTheme } from 'react-native-paper';
import { rootLog } from '../utils/logger';

export const Logcat = () => {
  const navigation = useNavigation();
  const appTheme = useTheme();

  const [logContent, setLogContent] = useState('');
  const [isLoaded, setIsLoaded] = useState(false);

  const clearLogs = useCallback(async () => {
    try {
      // Clear log file, but not delete it
      await RNFS.writeFile(
        RNFS.DocumentDirectoryPath + '/log',
        '',
      );
      setLogContent('');
    } catch (e) {
      rootLog.error(e);
    }
  }, []);

  const renderBtns = useCallback((
    { tintColor }: { tintColor?: string }
  ) => (
    <View style={styles.row}>
      <Appbar.Action
        icon="delete-forever-outline"
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
      <Appbar.Action
        icon="refresh"
        iconColor={tintColor}
        onPress={() => {
          setIsLoaded(false);
        }}
      />
    </View>
  ), [appTheme.colors.error, clearLogs]);

  useLayoutEffect(() => {
    navigation.setOptions({
      headerShown: true,
      headerRight: renderBtns,
    } as StackNavigationOptions);
  }, [navigation, renderBtns]);

  useEffect(() => {
    const readeLog = async () => {
      const log = await RNFS.readFile(
        RNFS.DocumentDirectoryPath + '/log',
        'utf8'
      );
      setLogContent(log);
    };

    try {
      if (!isLoaded) {
        readeLog().then(() => {
          setIsLoaded(true);
        });
      }
    } catch (e) {
      rootLog.error(e);
    }
  }, [isLoaded]);

  return (
    <ScrollView
      style={styles.root}
      contentContainerStyle={styles.content}
    >
      {isLoaded ? (
        <Caption selectable>
          {logContent || 'No log content'}
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
  },
  row: {
    flexDirection: 'row',
  }
});
