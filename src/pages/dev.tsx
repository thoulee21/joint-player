import { useNavigation } from '@react-navigation/native';
import React, { useCallback } from 'react';
import { StyleSheet } from 'react-native';
import { Appbar, Divider, List, Tooltip, useTheme } from 'react-native-paper';
import { AniGalleryItem } from '../components/AniGalleryItem';
import { BlurBackground } from '../components/BlurBackground';
import { ClearAllDataItem } from '../components/ClearAllDataItem';
import { DevSwitchItem } from '../components/DevSwitchItem';
import { ListWrapper } from '../components/ListWrapper';
import { RestartItem } from '../components/RestartItem';
import { ViewAppDataItem } from '../components/ViewAppDataItem';
import type { ListLRProps } from '../types/paperListItem';
import { rootLog } from '../utils/logger';

export function DevScreen() {
  const navigation = useNavigation();
  const appTheme = useTheme();

  const renderTestIcon = useCallback((props: ListLRProps) => (
    <List.Icon icon="test-tube" {...props} />
  ), []);

  const renderRightIcon = useCallback((props: ListLRProps) => (
    <List.Icon {...props} icon="chevron-right" />
  ), []);

  return (
    <BlurBackground>
      <Appbar.Header mode="large" style={styles.header}>
        <Appbar.BackAction onPress={navigation.goBack} />
        <Appbar.Content title="Developer Options" />

        <Tooltip title="View Logs">
          <Appbar.Action
            icon="folder-eye-outline"
            onPress={() => {
              rootLog.info('Navigating to Logcat screen');
              //@ts-expect-error
              navigation.push('Logcat' as never);
            }}
          />
        </Tooltip>
      </Appbar.Header>

      <ListWrapper bottomViewHeight={100}>
        <DevSwitchItem />
        <Divider />

        <List.Section
          title="Developer's View"
          titleStyle={{ color: appTheme.colors.secondary }}
        >
          <ViewAppDataItem />
          <AniGalleryItem />
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
      </ListWrapper>
    </BlurBackground>
  );
}

const styles = StyleSheet.create({
  header: {
    backgroundColor: 'transparent',
  },
});
