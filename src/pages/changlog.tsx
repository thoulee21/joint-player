import { useNavigation, useRoute } from '@react-navigation/native';
import React, { useCallback, useLayoutEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { StyleSheet, View } from 'react-native';
import Markdown from 'react-native-marked';
import { IconButton, Tooltip, useTheme } from 'react-native-paper';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import useSWR from 'swr';
import packageData from '../../package.json';
import type { Main } from '../types/latestRelease';

export const ChangeLog = () => {
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();
  const { t } = useTranslation();
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
        loading={isLoading}
        onPress={() => {
          // @ts-expect-error
          navigation.navigate('WebView', {
            url: data?.html_url || packageData.homepage,
            title: data?.tag_name || t('about.changelog.title'),
          });
        }}
      />
      <Tooltip title={t('changeLog.appbar.releaseTags')}>
        <IconButton
          icon="tag-outline"
          onPress={() => {
            // @ts-expect-error
            navigation.push('ReleaseTags');
          }}
        />
      </Tooltip>
      {error && (
        <IconButton
          icon="refresh"
          loading={isLoading}
          onPress={() => mutate()}
        />
      )}
    </View>
  ), [data?.html_url, data?.tag_name, error, isLoading, mutate, navigation, t]);

  useLayoutEffect(() => {
    navigation.setOptions({
      title: showVersion,
      headerRight: renderRight,
    });
  }, [data, navigation, renderRight, showVersion]);

  return (
    <Markdown
      value={data?.body
        || error?.message
        || (isLoading && 'Loading...')
        || t('changeLog.notFound')}
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
  },
  loading: {
    marginTop: '50%',
  }
});
