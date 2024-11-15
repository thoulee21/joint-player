import { ScrollViewWithHeaders } from '@codeherence/react-native-header';
import { useNavigation } from '@react-navigation/native';
import React, { useCallback, useState } from 'react';
import { useWindowDimensions, View } from 'react-native';
import { List, Portal, Snackbar } from 'react-native-paper';
import { AboutDialog } from '../components/AboutDialog';
import {
  AboutHeaderComponent,
  AboutLargeHeaderComponent,
} from '../components/AboutHeader';
import { ContactMe } from '../components/ContactMe';
import { UpdateChecker } from '../components/UpdateChecker';
import { VersionItem } from '../components/VersionItem';

export function AboutScreen() {
  const navigation = useNavigation();
  const window = useWindowDimensions();

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
      disableAutoFixScroll
      scrollToOverflowEnabled={false}
      overScrollMode="never"
    >
      <VersionItem
        showDevSnackbar={showDevSnackbar}
      />
      <UpdateChecker />

      <ContactMe />
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
    </ScrollViewWithHeaders>
  );
}
