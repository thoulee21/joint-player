import {
  Header,
  LargeHeader,
  ScalingView,
  ScrollViewWithHeaders,
} from '@codeherence/react-native-header';
import type { LocalAuthenticationResult } from 'expo-local-authentication';
import * as LocalAuthentication from 'expo-local-authentication';
import React, { useEffect, useState } from 'react';
import { StyleSheet } from 'react-native';
import { Button, Card, Text } from 'react-native-paper';
import type { SharedValue } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { BlurBackground } from '../components/BlurBackground';
import { rootLog } from '../utils/logger';

const HeaderComponent = (
  { showNavBar }: { showNavBar: SharedValue<number> }
) => (
  <Header
    showNavBar={showNavBar}
    headerCenter={
      <Text style={styles.headerTitle}>
        react-native-header
      </Text>
    }
  />
);

const LargeHeaderComponent = (
  { scrollY }: { scrollY: SharedValue<number> }
) => {
  return (
    <LargeHeader>
      <ScalingView scrollY={scrollY}>
        <Text variant="titleMedium">Welcome!</Text>
        <Text variant="titleLarge">react-native-header</Text>
        <Text variant="titleSmall">
          This project displays some header examples using the package.
        </Text>
      </ScalingView>
    </LargeHeader>
  );
};

export const TestScreen = () => {
  const { bottom } = useSafeAreaInsets();
  const [isLoaded, setIsLoaded] = useState(false);
  const [authResult, setAuthResult] = useState<LocalAuthenticationResult>();

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
      <ScrollViewWithHeaders
        HeaderComponent={HeaderComponent}
        LargeHeaderComponent={LargeHeaderComponent}
        contentContainerStyle={{ paddingBottom: bottom }}
      >
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
      </ScrollViewWithHeaders>
    </BlurBackground>
  );
};

const styles = StyleSheet.create({
  main: {
    flex: 1,
    height: 1500,
    marginTop: '10%',
    marginHorizontal: '2.5%',
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: 'bold',
  }
});
