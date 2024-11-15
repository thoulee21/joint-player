import { useNavigation } from '@react-navigation/native';
import React, { useCallback, useState } from 'react';
import { View } from 'react-native';
import { List, Portal, Snackbar } from 'react-native-paper';
import { AboutDialog } from '../components/AboutDialog';
import { ContactMe } from '../components/ContactMe';
import { ListWrapper } from '../components/ListWrapper';
import { UpdateChecker } from '../components/UpdateChecker';
import { VersionItem } from '../components/VersionItem';

export function AboutScreen() {
  const navigation = useNavigation();

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
    <View>
      <ListWrapper>
        <VersionItem
          showDevSnackbar={showDevSnackbar}
        />
        <UpdateChecker />

        <ContactMe />
        <List.Item
          title="About This App"
          onPress={showDialog}
        />
      </ListWrapper>

      <Portal>
        <AboutDialog
          hideDialog={hideDialog}
          visible={dialogVisible}
        />
      </Portal>
      <Portal>
        <GoDevSnackbar />
      </Portal>
    </View>
  );
}
