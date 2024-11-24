import { useNavigation, useRoute } from '@react-navigation/native';
import React, { useCallback, useLayoutEffect } from 'react';
import { StyleSheet, View } from 'react-native';
import Markdown from 'react-native-marked';
import { IconButton, useTheme } from 'react-native-paper';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import useSWR from 'swr';
import packageData from '../../package.json';
import type { Main } from '../types/latestRelease';

export const ChangeLog = () => {
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();
  const appTheme = useTheme();

  const params = useRoute().params as { version?: string };
  const showVersion = params?.version || `v${packageData.version}`;

  const userRepo = packageData.homepage
    .split('/').slice(-2).join('/');
  const {
    data, error, isLoading, mutate
  } = useSWR<Main>(`https://api.github.com/repos/${userRepo}/releases/tags/${showVersion}`);

  const renderRight = useCallback(() => (
    <View style={styles.row}>
      <IconButton
        icon="open-in-app"
        onPress={() => {
          // @ts-expect-error
          navigation.navigate('WebView', {
            url: data?.html_url || packageData.homepage,
            title: data?.tag_name || 'Changelog',
          });
        }}
      />
      <IconButton
        icon="refresh"
        loading={isLoading}
        onPress={() => mutate()}
      />
    </View>
  ), [data?.html_url, data?.tag_name, isLoading, mutate, navigation]);

  useLayoutEffect(() => {
    navigation.setOptions({
      title: `Changelog: ${data?.tag_name || 'Loading...'}`,
      headerRight: renderRight,
    });
  }, [data?.tag_name, navigation, renderRight]);

  return (
    <Markdown
      value={data?.body || error?.message || 'Loading...'}
      flatListProps={{
        contentContainerStyle: [styles.md, {
          backgroundColor: appTheme.colors.surface,
        }],
        style: styles.root,
        overScrollMode: 'never',
        scrollToOverflowEnabled: false,
        contentInset: insets,
      }}
      theme={{
        colors: {
          text: appTheme.colors.onSurface,
          background: appTheme.colors.surface,
          border: appTheme.colors.outline,
          code: appTheme.colors.tertiary,
          link: appTheme.colors.primary,
        }
      }}
    />
  );
};

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
  md: {
    paddingHorizontal: 24,
  },
  row: {
    flexDirection: 'row',
  }
});
