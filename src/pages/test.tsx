import { useNavigation } from '@react-navigation/native';
import type { LocalAuthenticationResult } from 'expo-local-authentication';
import * as LocalAuthentication from 'expo-local-authentication';
import React, { useEffect, useLayoutEffect, useState } from 'react';
import { StyleSheet } from 'react-native';
import { Button, Card, Text } from 'react-native-paper';
import { BlurBackground } from '../components/BlurBackground';
import { rootLog } from '../utils/logger';

export const TestScreen = () => {
  const navigation = useNavigation();

  const [isLoaded, setIsLoaded] = useState(false);
  const [
    authResult,
    setAuthResult,
  ] = useState<LocalAuthenticationResult>();

  useLayoutEffect(() => {
    navigation.setOptions({
      title: 'Authentication Test',
      headerShown: true,
    });
  }, [navigation]);

  useEffect(() => {
    const init = async () => {
      const hasHardware = await LocalAuthentication.hasHardwareAsync();
      rootLog.debug('hasHardware', hasHardware);

      const supported = await LocalAuthentication.supportedAuthenticationTypesAsync();
      rootLog.debug('supported', supported);

      const enrolled = await LocalAuthentication.isEnrolledAsync();
      rootLog.info('enrolled', enrolled);

      const result = await LocalAuthentication.authenticateAsync();
      rootLog.info('result', result);
      setAuthResult(result);

      if (result.success) {
        rootLog.info('Authenticated!');
      } else {
        rootLog.warn('Not authenticated!');
      }
    };

    if (!isLoaded) {
      init().then(() => {
        setIsLoaded(true);
      });
    }
  }, [isLoaded]);

  return (
    <BlurBackground>
      <Card style={styles.main}>
        <Card.Cover source={{ uri: 'https://picsum.photos/700' }} />
        <Card.Title title="Result" />

        <Card.Content>
          <Text>
            {JSON.stringify(
              authResult, null, 2
            )}
          </Text>
        </Card.Content>

        <Card.Actions>
          <Button
            icon="reload"
            onPress={() => setIsLoaded(false)}
          >Reload</Button>
        </Card.Actions>
      </Card>
    </BlurBackground>
  );
};

const styles = StyleSheet.create({
  main: {
    marginTop: '10%',
    marginHorizontal: '2.5%',
  }
});
