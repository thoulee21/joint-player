import { useNavigation } from '@react-navigation/native';
import React from 'react';
import { ScrollView, StyleSheet } from 'react-native';
import HapticFeedback, {
  HapticFeedbackTypes
} from 'react-native-haptic-feedback';
import { Appbar, List } from 'react-native-paper';
import {
  BlurBackground,
  BlurRadiusSlider,
  ThemeColorIndicator,
  VersionItem,
} from '../components';

export function Settings() {
  const navigation = useNavigation();

  return (
    <BlurBackground>
      <Appbar.Header style={styles.header}>
        <Appbar.Action icon="menu"
          onPress={() => {
            //@ts-ignore
            navigation.openDrawer();
            HapticFeedback.trigger(
              HapticFeedbackTypes.effectHeavyClick
            );
          }}
        />
        <Appbar.Content title="Settings" />
      </Appbar.Header>

      <ScrollView>
        <List.Section title="Appearance">
          <ThemeColorIndicator />
          <BlurRadiusSlider />
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
