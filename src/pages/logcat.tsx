import { useNavigation } from '@react-navigation/native';
import React, {
  useCallback,
  useEffect,
  useLayoutEffect,
  useMemo,
  useState,
} from 'react';
import {
  Alert,
  Animated,
  RefreshControl,
  StyleSheet,
  ToastAndroid,
  View,
  type NativeSyntheticEvent,
  type TextInputChangeEventData
} from 'react-native';
import RNFS from 'react-native-fs';
import {
  ActivityIndicator,
  Caption,
  Icon,
  IconButton,
  useTheme
} from 'react-native-paper';
import { v7 as uuid } from 'uuid';
import packageData from '../../package.json';
import { logFilePath, rootLog } from '../utils/logger';

export const Logcat = () => {
  const navigation = useNavigation();
  const appTheme = useTheme();

  const [isLoaded, setIsLoaded] = useState(false);
  const [logContent, setLogContent] = useState('');
  const [keyword, setKeyword] = useState('');

  const clearLogs = useCallback(async () => {
    try {
      // Clear log file, but not delete it
      await RNFS.writeFile(logFilePath, '');
      setLogContent('');
    } catch (e) {
      rootLog.error(e);
    }
  }, []);

  const renderDeleteIcon = useCallback(
    (props: any) => (
      <Icon
        {...props}
        source="delete-forever-outline"
        color={appTheme.colors.error}
      />
    ), [appTheme.colors.error]
  );

  const renderHeaderRight = useCallback(() => (
    <View style={styles.row}>
      <IconButton
        icon="content-save-outline"
        disabled={!logContent}
        onPress={async () => {
          const savePath = `${RNFS.DownloadDirectoryPath
            }/${packageData.name}_${uuid().slice(0, 8)}.log`;

          await RNFS.writeFile(savePath, logContent);
          ToastAndroid.showWithGravity(
            `Logs saved successfully to ${RNFS.DownloadDirectoryPath}`,
            ToastAndroid.SHORT,
            ToastAndroid.CENTER
          );
        }}
      />
      <IconButton
        icon={renderDeleteIcon}
        onPress={() => {
          Alert.alert(
            'Clear logs',
            'Are you sure you want to clear logs?',
            [
              { text: 'Cancel', style: 'cancel' },
              { text: 'OK', onPress: clearLogs },
            ],
          );
        }}
      />
    </View>
  ), [clearLogs, logContent, renderDeleteIcon]);

  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: renderHeaderRight,
      headerSearchBarOptions: {
        placeholder: 'Search log',
        onChangeText(
          e: NativeSyntheticEvent<TextInputChangeEventData>
        ) {
          const text = e.nativeEvent.text;
          setKeyword(text);
        },
        onClose: () => {
          setKeyword('');
        },
      }
    });
  }, [navigation, renderHeaderRight]);

  useEffect(() => {
    try {
      const readLog = async () => {
        const log = await RNFS.readFile(
          logFilePath, 'utf8'
        );
        setLogContent(log);
      };

      if (!isLoaded) {
        readLog().then(() => {
          setIsLoaded(true);
        });
      }
    } catch (e) { rootLog.error(e); }
  }, [isLoaded]);

  const renderEmpty = useCallback(() => (
    isLoaded ? (
      <Caption>No logs found</Caption>
    ) : (
      <ActivityIndicator
        style={styles.loading}
        size="large"
      />
    )
  ), [isLoaded]);

  const logLines = useMemo(() => (
    logContent.split('\n')
      .filter((line) => {
        if (!keyword) {
          return Boolean(line);
        } else {
          return line.includes(keyword);
        }
      })
  ), [keyword, logContent]);

  const renderLogLine = useCallback((
    { item }: { item: string }
  ) => (
    <Caption>{item}</Caption>
  ), []);

  return (
    <Animated.FlatList
      data={logLines}
      style={styles.root}
      contentContainerStyle={styles.content}
      renderItem={renderLogLine}
      onRefresh={() => { setIsLoaded(false); }}
      refreshing={!isLoaded}
      initialNumToRender={33}
      refreshControl={
        <RefreshControl
          refreshing={!isLoaded}
          onRefresh={() => { setIsLoaded(false); }}
          colors={[appTheme.colors.primary]}
          progressBackgroundColor={appTheme.colors.elevation.level2}
        />
      }
      ListEmptyComponent={renderEmpty}
      persistentScrollbar
    />
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
