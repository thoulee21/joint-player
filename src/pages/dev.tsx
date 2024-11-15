import {
  ScrollViewWithHeaders,
  type ScrollHeaderProps,
  type ScrollLargeHeaderProps,
} from '@codeherence/react-native-header';
import { useNavigation } from '@react-navigation/native';
import React, { useCallback } from 'react';
import { useWindowDimensions, View } from 'react-native';
import { Divider, List, useTheme } from 'react-native-paper';
import { AniGalleryItem } from '../components/AniGalleryItem';
import {
  HeaderComponent,
  LargeHeaderComponent,
} from '../components/AnimatedHeader';
import { ClearAllDataItem } from '../components/ClearAllDataItem';
import { DevSwitchItem } from '../components/DevSwitchItem';
import { RestartItem } from '../components/RestartItem';
import { ViewAppDataItem } from '../components/ViewAppDataItem';
import type { ListLRProps } from '../types/paperListItem';

export function DevScreen() {
  const navigation = useNavigation();
  const { height } = useWindowDimensions();
  const appTheme = useTheme();

  const renderTestIcon = useCallback((props: ListLRProps) => (
    <List.Icon icon="test-tube" {...props} />
  ), []);

  const renderRightIcon = useCallback((props: ListLRProps) => (
    <List.Icon {...props} icon="chevron-right" />
  ), []);

  const renderLargeHeader = useCallback((
    props: ScrollLargeHeaderProps
  ) => (
    <LargeHeaderComponent {...props} title="Developer Options" />
  ), []);

  const renderHeader = useCallback((props: ScrollHeaderProps) => (
    <HeaderComponent {...props} title="Developer Options" />
  ), []);

  const renderLogcatIcon = useCallback((props: ListLRProps) => (
    <List.Icon icon="folder-eye-outline" {...props} />
  ), []);

  return (
    <ScrollViewWithHeaders
      LargeHeaderComponent={renderLargeHeader}
      HeaderComponent={renderHeader}
      overScrollMode="never"
      scrollToOverflowEnabled={false}
    >
      <DevSwitchItem />
      <Divider />

      <List.Section
        title="Developer's View"
        titleStyle={{ color: appTheme.colors.secondary }}
      >
        <ViewAppDataItem />
        <AniGalleryItem />
        <List.Item
          title="Logcat"
          description="View logs"
          left={renderLogcatIcon}
          right={renderRightIcon}
          onPress={() => {
            //@ts-expect-error
            navigation.push('Logcat' as never);
          }}
        />
      </List.Section>

      <List.Item
        title="Experimental Test"
        description="Test the experimental features"
        left={renderTestIcon}
        right={renderRightIcon}
        onPress={() => {
          navigation.navigate('Test' as never);
        }}
      />
      <RestartItem />
      <ClearAllDataItem />

      <View style={{ height: height * 0.35 }} />
    </ScrollViewWithHeaders>
  );
}
