import { useNavigation } from '@react-navigation/native';
import React from 'react';
import { ScrollView, StyleSheet } from 'react-native';
import HapticFeedback, {
  HapticFeedbackTypes
} from 'react-native-haptic-feedback';
import { Appbar, Divider, List } from 'react-native-paper';
import { AboutItem } from '../components/AboutItem';
import { BlurBackground } from '../components/BlurBackground';
import { BlurRadiusSlider } from '../components/BlurRadiusSlider';
import { DevItem } from '../components/DevItem';
import { IssueReportItem } from '../components/IssueReportItem';
import { ThemeColorIndicator } from '../components/ThemeColorIndicator';

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

        <Divider />
        <DevItem />
        <IssueReportItem />
        <AboutItem />
      </ScrollView>
    </BlurBackground>
  );
}

const styles = StyleSheet.create({
  header: {
    backgroundColor: 'transparent',
  },
});
