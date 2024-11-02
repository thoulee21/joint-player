import { DrawerActions, useNavigation } from '@react-navigation/native';
import React from 'react';
import { StyleSheet } from 'react-native';
import { Appbar, Divider, List, useTheme } from 'react-native-paper';
import { AboutItem } from '../components/AboutItem';
import { BlurBackground } from '../components/BlurBackground';
import { BlurRadiusSlider } from '../components/BlurRadiusSlider';
import { DevItem } from '../components/DevItem';
import { ListWrapper } from '../components/ListWrapper';
import { ThemeColorIndicator } from '../components/ThemeColorIndicator';

export function Settings() {
  const appTheme = useTheme();
  const navigation = useNavigation();

  return (
    <BlurBackground>
      <Appbar.Header style={styles.header} mode="large">
        <Appbar.Action
          icon="menu"
          isLeading
          onPress={() => {
            navigation.dispatch(DrawerActions.openDrawer());
          }}
        />
        <Appbar.Content title="Settings" />
      </Appbar.Header>

      <ListWrapper>
        <List.Section
          title="Appearance"
          titleStyle={{
            color: appTheme.colors.secondary,
          }}
        >
          <ThemeColorIndicator />
          <BlurRadiusSlider />
        </List.Section>
        <Divider />

        <DevItem />
        <AboutItem />
      </ListWrapper>
    </BlurBackground>
  );
}

const styles = StyleSheet.create({
  header: {
    backgroundColor: 'transparent',
  },
});
