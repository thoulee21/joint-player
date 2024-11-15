import React, { useCallback } from 'react';
import { Alert } from 'react-native';
import { List } from 'react-native-paper';
import RNRestart from 'react-native-restart';

export const RestartItem = () => {
  const restartApp = () => {
    Alert.alert(
      'Restart App',
      'Are you sure you want to restart the app?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'OK',
          onPress: () => RNRestart.Restart()
        }
      ]
    );
  };

  const renderRestartIcon = useCallback((props: any) => (
    <List.Icon {...props} icon="restart" />
  ), []);

  return (
    <List.Item
      title="Restart App"
      description="Restart the app to apply changes"
      left={renderRestartIcon}
      onPress={restartApp}
    />
  );
};
