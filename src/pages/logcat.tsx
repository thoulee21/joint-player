import { useNavigation } from '@react-navigation/native';
import React, { useCallback, useEffect, useLayoutEffect, useState } from 'react';
import { ScrollView, StyleSheet } from 'react-native';
import RNFS from 'react-native-fs';
import { ActivityIndicator, Appbar, Caption } from 'react-native-paper';

export const Logcat = () => {
  const navigation = useNavigation();
  const [logContent, setLogContent] = useState('');
  const [isLoaded, setIsLoaded] = useState(false);

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
      headerRight: renderRefreshButton,
    });
  }, [navigation, renderRefreshButton]);

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
