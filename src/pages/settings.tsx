import { useNavigation } from '@react-navigation/native';
import { BlurView } from 'expo-blur';
import React, { useContext } from 'react';
import { ImageBackground, Platform, ScrollView, StyleSheet } from 'react-native';
import { Appbar, List, useTheme } from 'react-native-paper';
import { useActiveTrack } from 'react-native-track-player';
import { version as appVersion } from '../../package.json';
import { PreferencesContext } from '../App';
import {
  BlurRadiusSlider,
  ExperimentalBlurSwitch,
  InitKeywordItem,
  ThemeColorIndicator,
  placeholderImg,
} from '../components';

export const upperFirst = (str: string) =>
  str.slice(0, 1).toUpperCase() + str.slice(1);

const VersionIcon = (props: any) => {
  return (
    <List.Icon {...props}
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
  return (
    <List.Item
      title="Version"
      description={`${upperFirst(Platform.OS)} v${appVersion}`}
      left={VersionIcon}
    />
  );
};

export function Settings() {
  const navigation = useNavigation();
  const appTheme = useTheme();
  const preferences = useContext(PreferencesContext);
  const track = useActiveTrack();

  return (
    <ImageBackground
      style={styles.root}
      source={{ uri: track?.artwork || placeholderImg }}
      blurRadius={preferences?.blurRadius}
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
