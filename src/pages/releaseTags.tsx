import Clipboard from '@react-native-clipboard/clipboard';
import { useNavigation } from '@react-navigation/native';
import React, { useCallback, useLayoutEffect, useState } from 'react';
import { Animated, RefreshControl, StyleSheet, ToastAndroid } from 'react-native';
import HapticFeedback, { HapticFeedbackTypes } from 'react-native-haptic-feedback';
import { ActivityIndicator, IconButton, List, useTheme } from 'react-native-paper';
import useSWR from 'swr';
import packageData from '../../package.json';
import type { ListLRProps } from '../types/paperListItem';
import type { Main } from '../types/releaseTags';

export const ReleaseTags = () => {
  const navigation = useNavigation();
  const appTheme = useTheme();

  const userRepo = packageData.homepage.split('/').slice(-2).join('/');
  const {
    data, error, isLoading, mutate
  } = useSWR<Main[]>(`https://api.github.com/repos/${userRepo}/tags`);

  const [refreshing, setRefreshing] = useState(false);

  const renderHeaderRight = useCallback((props: any) => (
    <IconButton
      {...props}
      icon="refresh"
      onPress={() => mutate()}
    />
  ), [mutate]);

  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: renderHeaderRight
    });
  }, [navigation, renderHeaderRight]);

  const renderReleaseTagIcon = useCallback((
    props: ListLRProps
  ) => (
    <List.Icon {...props} icon="tag-outline" />
  ), []);

  const renderRight = useCallback((
    props: ListLRProps
  ) => (
    <List.Icon {...props} icon="chevron-right" />
  ), []);

  const renderTag = useCallback((
    { item }: { item: Main }
  ) => {
    return (
      <List.Item
        title={item.name}
        left={renderReleaseTagIcon}
        right={renderRight}
        description={item.commit.sha.slice(0, 15)}
        onPress={() => {
          //@ts-expect-error
          navigation.push(
            'ChangeLog',
            { version: item.name }
          );
        }}
        onLongPress={() => {
          HapticFeedback.trigger(HapticFeedbackTypes.effectTick);
          Clipboard.setString(item.commit.sha);
          ToastAndroid.show(
            'SHA copied to clipboard',
            ToastAndroid.SHORT
          );
        }}
      />
    );
  }, [navigation, renderReleaseTagIcon, renderRight]);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await mutate();
    setRefreshing(false);
  }, [mutate]);

  if (error) {
    return (
      <List.Item
        title="Error fetching data"
        description={error.message}
        onPress={() => mutate()}
      />
    );
  }

  return (
    <Animated.FlatList
      data={data || []}
      keyExtractor={(item) => item.node_id}
      renderItem={renderTag}
      initialNumToRender={12}
      refreshing={refreshing}
      onRefresh={onRefresh}
      refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={onRefresh}
          colors={[appTheme.colors.primary]}
          progressBackgroundColor={appTheme.colors.surface}
        />
      }
      ListEmptyComponent={isLoading ? (
        <ActivityIndicator
          size="large"
          style={styles.loading}
        />
      ) : (
        <List.Item
          title="No data"
          description="No data available"
        />
      )}
    />
  );
};

const styles = StyleSheet.create({
  loading: {
    marginTop: '50%',
  }
});
