import { useNavigation } from '@react-navigation/native';
import React from 'react';
import { ScrollView, StyleSheet } from 'react-native';
import HapticFeedback, { HapticFeedbackTypes } from 'react-native-haptic-feedback';
import { Appbar, List } from 'react-native-paper';
import {
  AboutAppItem,
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
          <List.Item
            title="Report Issue"
            left={(props) => <List.Icon {...props} icon="message-text-outline" />}
            onPress={() => {
              //@ts-expect-error
              navigation.push('IssueReport');
              HapticFeedback.trigger(
                HapticFeedbackTypes.effectClick
              );
            }}
            description="Report an issue or send feedback"
          />

          <VersionItem />
          <AboutAppItem />
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
