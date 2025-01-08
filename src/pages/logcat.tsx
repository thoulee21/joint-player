import { useNavigation } from '@react-navigation/native';
import React, {
  useCallback,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState
} from 'react';
import {
  Animated,
  RefreshControl,
  StyleSheet,
  ToastAndroid,
  View,
  type NativeSyntheticEvent,
  type TextInputChangeEventData
} from 'react-native';
import RNFS from 'react-native-fs';
import HapticFeedback, {
  HapticFeedbackTypes
} from 'react-native-haptic-feedback';
import {
  ActivityIndicator,
  Button,
  Caption,
  Dialog,
  FAB,
  IconButton,
  Portal,
  Text,
  useTheme
} from 'react-native-paper';
import { v7 as uuid } from 'uuid';
import packageData from '../../package.json';
import { logFilePath, rootLog } from '../utils/logger';

export const Logcat = () => {
  const navigation = useNavigation();
  const logsRef = useRef<Animated.FlatList>(null);
  const appTheme = useTheme();

  const [isLoaded, setIsLoaded] = useState(false);
  const [dialogVisible, setDialogVisible] = useState(false);
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
        icon="delete-forever-outline"
        iconColor={appTheme.colors.error}
        disabled={!logContent}
        onPress={() => {
          HapticFeedback.trigger(
            HapticFeedbackTypes.notificationWarning
          );
          setDialogVisible(true);
        }}
      />
    </View>
  ), [appTheme.colors.error, logContent]);

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
    logContent
      .split('\n')
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
    <>
      <Animated.FlatList
        ref={logsRef}
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

      <Portal>
        <FAB
          icon="arrow-down"
          style={styles.fab}
          onPress={() => {
            if (logsRef.current) {
              logsRef.current.scrollToEnd();
            }
          }}
        />
      </Portal>

      <Portal>
        <Dialog
          visible={dialogVisible}
          onDismiss={() => setDialogVisible(false)}
        >
          <Dialog.Icon
            icon="alert"
            color={appTheme.colors.error}
            size={40}
          />
          <Dialog.Title>Clear logs</Dialog.Title>
          <Dialog.Content>
            <Text>
              Are you sure you want to clear logs?
            </Text>
          </Dialog.Content>

          <Dialog.Actions>
            <Button
              textColor={appTheme.colors.outline}
              onPress={() => setDialogVisible(false)}
            >Cancel</Button>
            <Button
              textColor={appTheme.colors.error}
              onPress={() => {
                clearLogs();
                setDialogVisible(false);
              }}
            >OK</Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>
    </>
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
  },
  fab: {
    position: 'absolute',
    margin: 16,
    right: 0,
    bottom: 0
  }
});
