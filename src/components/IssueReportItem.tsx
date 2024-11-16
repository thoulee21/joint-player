import { useNavigation } from '@react-navigation/native';
import React, { useCallback } from 'react';
import { List } from 'react-native-paper';
import type { ListLRProps } from '../types/paperListItem';

export const IssueReportItem = () => {
  const navigation = useNavigation();

  const IssueReportIcon = useCallback((props: ListLRProps) => (
    <List.Icon {...props} icon="message-text-outline" />
  ), []);

  const ChevronRight = useCallback((props: ListLRProps) => (
    <List.Icon {...props} icon="chevron-right" />
  ), []);

  return (
    <List.Item
      title="Report Issue"
      description="Report an issue or send feedback"
      left={IssueReportIcon}
      right={ChevronRight}
      onPress={() => {
        //@ts-expect-error
        navigation.push('IssueReport');
      }}
    />
  );
};
