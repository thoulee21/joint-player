import React from 'react';
import { Platform } from 'react-native';
import { Appbar, Divider, List } from 'react-native-paper';
import { version as appVersion } from '../../package.json';
import {
  InitKeywordItem,
  ScreenWrapper,
  ThemeColorIndicator,
} from '../components';

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
            description={`${Platform.OS} v${appVersion}`}
            left={props => <List.Icon {...props} icon="information-outline" />}
          />
        </List.Section>
      </ScreenWrapper>
    </>
  );
}
