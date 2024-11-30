import { ScrollViewWithHeaders } from '@codeherence/react-native-header';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import React, { useCallback, useEffect, useState } from 'react';
import { DeviceEventEmitter, Linking, StatusBar, StyleSheet, useWindowDimensions, View } from 'react-native';
import Markdown from 'react-native-marked';
import { Button, Dialog, List, Portal, Snackbar, useTheme } from 'react-native-paper';
import useSWR from 'swr';
import packageData from '../../package.json';
import { AboutDialog } from '../components/AboutDialog';
import {
  AboutHeaderComponent,
  AboutLargeHeaderComponent,
} from '../components/AboutHeader';
import { ContactMe } from '../components/ContactMe';
import { UpdateChecker } from '../components/UpdateChecker';
import { VersionItem } from '../components/VersionItem';
import type { Main } from '../types/latestRelease';
import type { ListLRProps } from '../types/paperListItem';

export function AboutScreen() {
  const navigation = useNavigation();
  const window = useWindowDimensions();
  const appTheme = useTheme();

  const userRepo = packageData.homepage.split('/').slice(-2).join('/');
  const { data } = useSWR<Main>(`https://api.github.com/repos/${userRepo}/releases/latest`);
  const latestRelease = data?.tag_name;

  const [
    newReleaseDialogVisible,
    setNewReleaseDialogVisible
  ] = useState(false);

  const [
    dialogVisible,
    setDialogVisible
  ] = useState(false);
  const [
    devSnackbarVisible,
    setDevSnackbarVisible
  ] = useState(false);

  const showDialog = () => setDialogVisible(true);
  const hideDialog = () => setDialogVisible(false);

  const showDevSnackbar = () => setDevSnackbarVisible(true);
  const hideDevSnackbar = () => setDevSnackbarVisible(false);

  useEffect(() => {
    const sub = DeviceEventEmitter.addListener(
      'newReleaseAvailable',
      () => {
        if (data) {
          setNewReleaseDialogVisible(true);
        }
      }
    );

    return () => sub.remove();
  }, [data]);

  useFocusEffect(() => {
    StatusBar.setBarStyle('light-content');

    return () => {
      StatusBar.setBarStyle(
        appTheme.dark ? 'light-content' : 'dark-content'
      );
    };
  });

  const renderRight = useCallback((
    props: ListLRProps
  ) => (
    <List.Icon {...props} icon="chevron-right" />
  ), []);

  const GoDevSnackbar = useCallback(() => (
    <Snackbar
      visible={devSnackbarVisible}
      onDismiss={hideDevSnackbar}
      onIconPress={hideDevSnackbar}
      action={{
        label: 'Jump',
        //@ts-expect-error
        onPress: () => navigation.push('Dev'),
      }}
    >
      Developer options enabled!
    </Snackbar>
  ), [devSnackbarVisible, navigation]);

  return (
    <ScrollViewWithHeaders
      HeaderComponent={AboutHeaderComponent}
      LargeHeaderComponent={AboutLargeHeaderComponent}
      scrollToOverflowEnabled={false}
      overScrollMode="never"
    >
      <VersionItem
        showDevSnackbar={showDevSnackbar}
      />
      <UpdateChecker />

      <ContactMe />
      <List.Item
        title="Changelog"
        description="View release notes"
        right={renderRight}
        onPress={() => {
          // @ts-expect-error
          navigation.push('ChangeLog');
        }}
        onLongPress={() => {
          // @ts-expect-error
          navigation.push('ReleaseTags');
        }}
      />
      <List.Item
        title="About This App"
        onPress={showDialog}
      />

      <View style={{
        height: window.height * 0.5,
      }} />

      <Portal>
        <AboutDialog
          hideDialog={hideDialog}
          visible={dialogVisible}
        />
      </Portal>

      <Portal>
        <GoDevSnackbar />
      </Portal>

      <Portal>
        <Dialog
          visible={newReleaseDialogVisible}
          onDismiss={() => setNewReleaseDialogVisible(false)}
          style={styles.dialog}
        >
          <Dialog.Icon icon="cloud-download" size={40} />
          <Dialog.Title>New Release {latestRelease}</Dialog.Title>

          <Dialog.ScrollArea style={styles.smallPadding}>
            <Markdown
              value={data?.body || ''}
              flatListProps={{
                contentContainerStyle: [styles.biggerPadding, {
                  backgroundColor: appTheme.colors.elevation.level3,
                }],
                overScrollMode: 'never',
                scrollToOverflowEnabled: false,
              }}
              theme={{
                colors: {
                  text: appTheme.colors.onSurface,
                  background: appTheme.colors.surface,
                  border: appTheme.colors.outline,
                  code: appTheme.colors.tertiary,
                  link: appTheme.colors.primary,
                }
              }}
              styles={{
                h2: { fontSize: 18 }
              }}
            />
          </Dialog.ScrollArea>

          <Dialog.Actions>
            <Button
              textColor={appTheme.colors.outline}
              onPress={() => {
                setNewReleaseDialogVisible(false);
              }}
            >
              Not now
            </Button>

            <Button
              icon="download"
              onPress={() => {
                Linking.openURL(
                  `https://proxy.v2gh.com/${data?.assets[0].browser_download_url}`
                  || packageData.homepage
                );
              }}
            >
              Download
            </Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>
    </ScrollViewWithHeaders>
  );
}

const styles = StyleSheet.create({
  dialog: {
    maxHeight: '80%',
  },
  smallPadding: {
    paddingHorizontal: 0,
  },
  biggerPadding: {
    paddingHorizontal: 24,
  },
});
