import { useNavigation } from '@react-navigation/native';
import React, { useCallback, useEffect, useState } from 'react';
import { Alert, ScrollView, StatusBar, StyleSheet, ToastAndroid } from 'react-native';
import RNFS from 'react-native-fs';
import { ActivityIndicator, Appbar, Caption, Icon, Menu, useTheme } from 'react-native-paper';
import { v7 as uuid } from 'uuid';
import packageData from '../../package.json';
import { logFilePath, rootLog } from '../utils/logger';

export const Logcat = () => {
  const navigation = useNavigation();
  const appTheme = useTheme();

  const [menuVisible, setMenuVisible] = useState(false);
  const [logContent, setLogContent] = useState('');
  const [isLoaded, setIsLoaded] = useState(false);

  const clearLogs = useCallback(async () => {
    try {
      // Clear log file, but not delete it
      await RNFS.writeFile(logFilePath, '');
      setLogContent('');
    } catch (e) {
      rootLog.error(e);
    }
  }, []);

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
    } catch (e) {
      rootLog.error(e);
    }
  }, [isLoaded]);

  const renderDeleteIcon = useCallback(
    (props: any) => (
      <Icon
        {...props}
        source="delete-forever-outline"
        color={appTheme.colors.error}
      />
    ), [appTheme.colors.error]
  );

  return (
    <>
      <Appbar.Header>
        <Appbar.BackAction onPress={navigation.goBack} />
        <Appbar.Action
          icon="refresh"
          onPress={() => { setIsLoaded(false); }}
        />
        <Appbar.Content title="Logcat" />

        <Menu
          visible={menuVisible}
          onDismiss={() => { setMenuVisible(false); }}
          statusBarHeight={StatusBar.currentHeight}
          anchor={
            <Appbar.Action
              icon="dots-vertical"
              onPress={() => { setMenuVisible(true); }}
            />
          }
        >
          <Menu.Item
            title="Save logs"
            leadingIcon="content-save-outline"
            disabled={!logContent}
            onPress={async () => {
              setMenuVisible(false);
              const savePath = `${RNFS.DownloadDirectoryPath}/${packageData.name}_${uuid().slice(0, 8)}.log`;
              await RNFS.writeFile(savePath, logContent);

              ToastAndroid.showWithGravity(
                `Logs saved successfully to ${RNFS.DownloadDirectoryPath}`,
                ToastAndroid.SHORT,
                ToastAndroid.CENTER
              );
            }}
          />
          <Menu.Item
            title="Clear logs"
            leadingIcon={renderDeleteIcon}
            disabled={!logContent}
            onPress={() => {
              setMenuVisible(false);
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
        </Menu>
      </Appbar.Header>

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
});
