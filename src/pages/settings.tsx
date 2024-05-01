import { useNavigation } from '@react-navigation/native';
import React, { useEffect, useState } from 'react';
import { Platform, ScrollView, StyleSheet, ToastAndroid } from 'react-native';
import HapticFeedback, { HapticFeedbackTypes } from 'react-native-haptic-feedback';
import { Appbar, List, useTheme } from 'react-native-paper';
import { version as appVersion } from '../../package.json';
import {
  BlurBackground,
  BlurRadiusSlider,
  ExperimentalBlurSwitch,
  InitKeywordItem,
  ThemeColorIndicator
} from '../components';
import { useAppDispatch, useAppSelector } from '../hook/reduxHooks';
import { selectDevModeEnabled, setDevModeValue } from '../redux/slices';

export const upperFirst = (str: string) =>
  str.slice(0, 1).toUpperCase() + str.slice(1);

const VersionIcon = (props: any) => {
  const appTheme = useTheme();
  const devModeEnabled = useAppSelector(selectDevModeEnabled);

  return (
    <List.Icon {...props}
      color={devModeEnabled
        ? appTheme.colors.primary
        : undefined}
      icon={Platform.select({
        android: 'android',
        ios: 'apple-ios',
        macos: 'desktop-mac',
        windows: 'microsoft-windows',
        web: 'web',
        native: 'information',
      })}
    />
  );
};

const VersionItem = () => {
  const dispatch = useAppDispatch();

  const [hitCount, setHitCount] = useState(0);
  const devModeEnabled = useAppSelector(selectDevModeEnabled);

  useEffect(() => {
    if (hitCount >= 5) {
      dispatch(setDevModeValue(true));
      HapticFeedback.trigger(HapticFeedbackTypes.effectClick);
      ToastAndroid.show('Developer mode enabled', ToastAndroid.SHORT);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hitCount]);

  return (
    <List.Item
      title="Version"
      description={`${upperFirst(Platform.OS)} v${appVersion}`}
      left={VersionIcon}
      onPress={() => {
        if (hitCount < 5 && !devModeEnabled) {
          setHitCount(hitCount + 1);
        }
      }}
    />
  );
};

export function Settings() {
  const navigation = useNavigation();
  return (
    <BlurBackground>
      <Appbar.Header style={styles.header}>
        <Appbar.BackAction onPress={navigation.goBack} />
        <Appbar.Content title="Settings" />
      </Appbar.Header>

      <ScrollView>
        <List.Section title="Startup">
          <InitKeywordItem />
        </List.Section>

        <List.Section title="Appearance">
          <ThemeColorIndicator />
          <BlurRadiusSlider />
          <ExperimentalBlurSwitch />
        </List.Section>

        <List.Section title="General">
          <VersionItem />
        </List.Section>
      </ScrollView>
    </BlurBackground>
  );
}

const styles = StyleSheet.create({
  header: {
    backgroundColor: 'transparent',
  },
});
