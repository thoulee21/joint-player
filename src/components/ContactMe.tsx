import React, { useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { Linking } from 'react-native';
import { List, useTheme } from 'react-native-paper';
import packageData from '../../package.json';
import { IssueReportItem } from './IssueReportItem';

export const ContactMe = () => {
  const { t } = useTranslation();
  const appTheme = useTheme();

  const OpenIcon = useCallback((props: any) => (
    <List.Icon {...props} icon="open-in-new" />
  ), []);

  const EmailIcon = useCallback((props: any) => (
    <List.Icon {...props} icon="email-outline" />
  ), []);

  const GithubIcon = useCallback((props: any) => (
    <List.Icon {...props} icon="github" />
  ), []);

  return (
    <List.Section
      title={t('about.contact.section')}
      titleStyle={{ color: appTheme.colors.secondary }}
    >
      <List.Item
        title={t('about.contact.email.title')}
        description={packageData.author.email}
        onPress={() => {
          Linking.openURL(`mailto:${packageData.author.email}`);
        }}
        left={EmailIcon}
        right={OpenIcon}
      />
      <List.Item
        title={t('about.contact.homepage.title')}
        description={packageData.homepage}
        onPress={() => Linking.openURL(packageData.homepage)}
        left={GithubIcon}
        right={OpenIcon}
      />

      <IssueReportItem />
    </List.Section>
  );
};
