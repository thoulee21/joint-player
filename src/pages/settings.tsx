import { useNavigation } from '@react-navigation/native';
import { BlurView } from 'expo-blur';
import React, { useEffect, useState } from 'react';
import {
  ImageBackground,
  Platform,
  ScrollView,
  StyleSheet,
  ToastAndroid,
} from 'react-native';
import HapticFeedback, {
  HapticFeedbackTypes,
} from 'react-native-haptic-feedback';
import { Appbar, List, useTheme } from 'react-native-paper';
import { useActiveTrack } from 'react-native-track-player';
import { version as appVersion } from '../../package.json';
import {
  BlurRadiusSlider,
  ExperimentalBlurSwitch,
  InitKeywordItem,
  ThemeColorIndicator,
  placeholderImg,
} from '../components';
import {
  useAppDispatch,
  useAppSelector,
} from '../hook/reduxHooks';
import {
  blurRadius,
  selectDevModeEnabled,
  setDevModeValue,
} from '../redux/slices';

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
  const appTheme = useTheme();
  const track = useActiveTrack();
  const blurRadiusValue = useAppSelector(blurRadius);

  return (
    <ImageBackground
      style={styles.root}
      source={{ uri: track?.artwork || placeholderImg }}
      blurRadius={blurRadiusValue}
    >
      <BlurView
        tint={appTheme.dark ? 'dark' : 'light'}
        style={styles.root}
      >
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
      </BlurView>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
  header: {
    backgroundColor: 'transparent',
  },
});
