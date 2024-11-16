import {
  ScrollViewWithHeaders,
  type ScrollHeaderProps,
  type ScrollLargeHeaderProps
} from '@codeherence/react-native-header';
import React, { useCallback, useState } from 'react';
import { useWindowDimensions, View } from 'react-native';
import { List, Portal, Snackbar, useTheme } from 'react-native-paper';
import RNRestart from 'react-native-restart';
import { AboutItem } from '../components/AboutItem';
import {
  HeaderComponent,
  LargeHeaderComponent,
} from '../components/AnimatedHeader';
import { BlurRadiusSlider } from '../components/BlurRadiusSlider';
import { CacheItem } from '../components/CacheItem';
import { DevItem } from '../components/DevItem';
import { ExportDataItem } from '../components/ExportDataItem';
import { ImportDataItem } from '../components/ImportDataItem';
import { RippleEffectSwitch } from '../components/RippleEffectSwitch';
import { ThemeColorIndicator } from '../components/ThemeColorIndicator';

export function Settings() {
  const window = useWindowDimensions();
  const appTheme = useTheme();

  const [
    restartBarVisible,
    setRestartBarVisible,
  ] = useState(false);

  const renderHeader = useCallback((
    props: ScrollHeaderProps
  ) => (
    <HeaderComponent {...props} title="Settings" />
  ), []);

  const renderLargeHeader = useCallback((
    props: ScrollLargeHeaderProps
  ) => (
    <LargeHeaderComponent {...props} title="Settings" />
  ), []);

  return (
    <ScrollViewWithHeaders
      HeaderComponent={renderHeader}
      LargeHeaderComponent={renderLargeHeader}
      disableAutoFixScroll
      overScrollMode="never"
    >
      <List.Section
        title="Appearance"
        titleStyle={{
          color: appTheme.colors.secondary,
        }}
      >
        <ThemeColorIndicator />
        <BlurRadiusSlider />
        <RippleEffectSwitch />
      </List.Section>

      <List.Section
        title="Data Management"
        titleStyle={{ color: appTheme.colors.secondary }}
      >
        <ExportDataItem />
        <ImportDataItem
          setRestartBarVisible={setRestartBarVisible}
        />
        <CacheItem />
      </List.Section>

      <DevItem />
      <AboutItem />

      <View style={{ height: window.height * 0.35 }} />

      <Portal>
        <Snackbar
          visible={restartBarVisible}
          onDismiss={() => setRestartBarVisible(false)}
          onIconPress={() => setRestartBarVisible(false)}
          action={{
            label: 'Restart',
            onPress: () => RNRestart.Restart(),
          }}
        >
          Data imported successfully! Restart the app to apply changes.
        </Snackbar>
      </Portal>
    </ScrollViewWithHeaders>
  );
}
