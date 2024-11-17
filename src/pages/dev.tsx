import {
  ScrollViewWithHeaders,
  type ScrollHeaderProps,
  type ScrollLargeHeaderProps,
} from '@codeherence/react-native-header';
import { useNavigation } from '@react-navigation/native';
import type { LocalAuthenticationResult } from 'expo-local-authentication';
import * as LocalAuthentication from 'expo-local-authentication';
import React, { useCallback, useEffect, useState } from 'react';
import { useWindowDimensions, View } from 'react-native';
import { Divider, List, useTheme } from 'react-native-paper';
import { AniGalleryItem } from '../components/AniGalleryItem';
import {
  HeaderComponent,
  LargeHeaderComponent,
} from '../components/AnimatedHeader';
import { ClearAllDataItem } from '../components/ClearAllDataItem';
import { DevSwitchItem } from '../components/DevSwitchItem';
import { LottieAnimation } from '../components/LottieAnimation';
import { RestartItem } from '../components/RestartItem';
import { ViewAppDataItem } from '../components/ViewAppDataItem';
import type { ListLRProps } from '../types/paperListItem';
import { rootLog } from '../utils/logger';

export function DevScreen() {
  const navigation = useNavigation();
  const { height } = useWindowDimensions();
  const appTheme = useTheme();

  const [isLoaded, setIsLoaded] = useState(false);
  const [authResult, setAuthResult] = useState<LocalAuthenticationResult>();

  useEffect(() => {
    const init = async () => {
      const hasHardware = await LocalAuthentication.hasHardwareAsync();
      rootLog.debug('hasHardware', hasHardware);

      const supported = await LocalAuthentication.supportedAuthenticationTypesAsync();
      rootLog.debug('supported', supported);

      const enrolled = await LocalAuthentication.isEnrolledAsync();
      rootLog.info('enrolled', enrolled);

      const result = await LocalAuthentication.authenticateAsync();
      rootLog.info('result', result);
      setAuthResult(result);

      if (result.success) {
        rootLog.info('Authenticated!');
      } else {
        rootLog.warn('Not authenticated!');
        navigation.goBack();
      }
    };

    if (!isLoaded) {
      init().then(() => {
        setIsLoaded(true);
      });
    }
  }, [isLoaded, navigation]);

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

  if (!authResult || !authResult.success) {
    return (
      <LottieAnimation animation="rocket" />
    );
  }

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
        <List.Item
          title="Experimental Test"
          description="Test the experimental features"
          left={renderTestIcon}
          right={renderRightIcon}
          onPress={() => {
            navigation.navigate('Test' as never);
          }}
        />
      </List.Section>

      <RestartItem />
      <ClearAllDataItem />

      <View style={{ height: height * 0.35 }} />
    </ScrollViewWithHeaders>
  );
}
