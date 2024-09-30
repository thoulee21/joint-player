import { useNavigation } from '@react-navigation/native';
import React, { useState } from 'react';
import { ScrollView, StyleSheet } from 'react-native';
import HapticFeedback, {
  HapticFeedbackTypes
} from 'react-native-haptic-feedback';
import { Appbar, List } from 'react-native-paper';
import {
  AboutDialog,
  BlurBackground,
  BlurRadiusSlider,
  IssueReportItem,
  ThemeColorIndicator,
  VersionItem
} from '../components';

export function Settings() {
  const navigation = useNavigation();

  const [dialogVisible, setDialogVisible] = useState(false);
  const showDialog = () => setDialogVisible(true);
  const hideDialog = () => setDialogVisible(false);

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
          <IssueReportItem />

          <VersionItem />
          <List.Item title="About This App" onPress={showDialog} />
        </List.Section>
      </ScrollView>

      <AboutDialog visible={dialogVisible} hideDialog={hideDialog} />
    </BlurBackground>
  );
}

const styles = StyleSheet.create({
  header: {
    backgroundColor: 'transparent',
  },
});
