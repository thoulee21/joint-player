import React, { useState } from 'react';
import { View } from 'react-native';
import { List, Portal, Snackbar, useTheme } from 'react-native-paper';
import RNRestart from 'react-native-restart';
import { AboutItem } from '../components/AboutItem';
import { BlurRadiusSlider } from '../components/BlurRadiusSlider';
import { CacheItem } from '../components/CacheItem';
import { DevItem } from '../components/DevItem';
import { ExportDataItem } from '../components/ExportDataItem';
import { ImportDataItem } from '../components/ImportDataItem';
import { ListWrapper } from '../components/ListWrapper';
import { RippleEffectSwitch } from '../components/RippleEffectSwitch';
import { ThemeColorIndicator } from '../components/ThemeColorIndicator';

export function Settings() {
  const appTheme = useTheme();

  const [
    restartBarVisible,
    setRestartBarVisible,
  ] = useState(false);

  return (
    <View>
      <ListWrapper>
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
        </List.Section>
        <CacheItem />

        <DevItem />
        <AboutItem />
      </ListWrapper>

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
    </View>
  );
}
