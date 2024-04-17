import { useNavigation } from '@react-navigation/native';
import React from 'react';
import { Platform } from 'react-native';
import { Appbar, Divider, List } from 'react-native-paper';
import { version as appVersion } from '../../package.json';
import {
  BlurRadiusSlider,
  InitKeywordItem,
  PlayAtStartupSwitch,
  ScreenWrapper,
  ThemeColorIndicator,
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
  )
}

export function Settings() {
  const navigation = useNavigation();
  return (
    <>
      <Appbar.Header>
        <Appbar.Action
          icon="menu"
          // @ts-ignore
          onPress={() => navigation.openDrawer()}
        />
        <Appbar.Content title="Settings" />
      </Appbar.Header>

      <ScreenWrapper>
        <List.Section title="Startup">
          <List.Section>
            <InitKeywordItem />
          </List.Section>
          <PlayAtStartupSwitch />
          <Divider />
        </List.Section>

        <List.Section title='Appearance'>
          <ThemeColorIndicator />
          <Divider />
          <BlurRadiusSlider />
        </List.Section>
        <Divider />

        <List.Section title="General">
          <List.Item
            title="Version"
            description={`${upperFirst(Platform.OS)} v${appVersion}`}
            left={VersionIcon}
          />
        </List.Section>
      </ScreenWrapper>
    </>
  );
}
