import React from 'react';
import { Platform } from 'react-native';
import { Appbar, Divider, List } from 'react-native-paper';
import { version as appVersion } from '../../package.json';
import {
  InitKeywordItem,
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

export function Settings({ navigation }: { navigation: any }) {
  return (
    <>
      <Appbar.Header>
        <Appbar.Action
          icon="menu"
          onPress={() => navigation.openDrawer()}
        />
        <Appbar.Content title="Settings" />
      </Appbar.Header>
      <ScreenWrapper>
        <InitKeywordItem />
        <List.Section title="General">
          <ThemeColorIndicator />
          <Divider />
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
