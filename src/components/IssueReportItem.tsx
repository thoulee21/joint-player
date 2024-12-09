import { useNavigation } from '@react-navigation/native';
import React, { useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { List } from 'react-native-paper';
import type { ListLRProps } from '../types/paperListItem';

export const IssueReportItem = () => {
  const { t } = useTranslation();
  const navigation = useNavigation();

  const IssueReportIcon = useCallback((props: ListLRProps) => (
    <List.Icon {...props} icon="message-text-outline" />
  ), []);

  const ChevronRight = useCallback((props: ListLRProps) => (
    <List.Icon {...props} icon="chevron-right" />
  ), []);

  return (
    <List.Item
      title={t('about.contact.issueReport.title')}
      description={t('about.contact.issueReport.description')}
      left={IssueReportIcon}
      right={ChevronRight}
      onPress={() => {
        //@ts-expect-error
        navigation.push('IssueReport');
      }}
    />
  );
};
