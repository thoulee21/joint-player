import { useNavigation } from '@react-navigation/native';
import React from 'react';
import { ScrollView, StyleSheet } from 'react-native';
import { Appbar, List } from 'react-native-paper';
import {
  BlurBackground,
  BlurRadiusSlider,
  ExperimentalBlurSwitch,
  ThemeColorIndicator,
  VersionItem,
} from '../components';

export function Settings() {
  const navigation = useNavigation();

  return (
    <BlurBackground>
      <Appbar.Header style={styles.header}>
        <Appbar.BackAction onPress={navigation.goBack} />
        <Appbar.Content title="Settings" />
      </Appbar.Header>

      <ScrollView>
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
