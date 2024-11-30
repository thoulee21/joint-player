import React, {
  useCallback,
  useMemo,
  useState,
} from 'react';
import { ToastAndroid } from 'react-native';
import HapticFeedback, {
  HapticFeedbackTypes,
} from 'react-native-haptic-feedback';
import {
  Button,
  Dialog,
  Drawer,
  Icon,
  Portal,
  Text,
  useTheme,
} from 'react-native-paper';
import {
  useAppDispatch,
  useAppSelector,
} from '../hook/reduxHooks';
import { selectDevModeEnabled } from '../redux/slices';
import {
  initialState as initialUser,
  resetUser,
  selectUser,
} from '../redux/slices/user';

export const ActionDrawerItems = ({ navigation }: {
  navigation: any
}) => {
  const dispatch = useAppDispatch();
  const appTheme = useTheme();

  const currentUser = useAppSelector(selectUser);
  const isDev = useAppSelector(selectDevModeEnabled);

  const [
    isDialogVisible,
    setIsDialogVisible,
  ] = useState(false);

  const isLoggedOut = useMemo(() => (
    currentUser.id === initialUser.id
    && currentUser.username === initialUser.username
  ), [currentUser]);

  const renderSwitchUserIcon = useCallback(
    (props: any) => (
      <Icon
        {...props}
        source="account-switch-outline"
        color={appTheme.colors.onSurface}
      />
    ), [appTheme.colors.onSurface]
  );

  const renderLogoutIcon = useCallback(
    (props: any) => (
      <Icon
        {...props}
        source="logout"
        color={appTheme.colors.error}
      />
    ), [appTheme.colors.error]
  );

  const logout = useCallback(() => {
    dispatch(resetUser());
    navigation.closeDrawer();

    ToastAndroid.show(
      'User logged out',
      ToastAndroid.SHORT
    );
  }, [dispatch, navigation]);

  return (
    <>
      {isDev && (
        <Drawer.Section>
          <Drawer.Item
            label="Test"
            icon="test-tube"
            onPress={() => {
              navigation.closeDrawer();
              navigation.navigate('Test');
            }}
          />
        </Drawer.Section>
      )}
      <Drawer.Section showDivider={false}>
        <Drawer.Item
          label="Switch User"
          icon={renderSwitchUserIcon}
          onPress={() => {
            navigation.closeDrawer();
            navigation.navigate('SwitchUser');
          }}
        />
        {!isLoggedOut && (
          <>
            <Drawer.Item
              label="Logout"
              icon={renderLogoutIcon}
              onPress={() => {
                HapticFeedback.trigger(
                  HapticFeedbackTypes.notificationWarning
                );
                setIsDialogVisible(true);
              }}
            />
            <Portal>
              <Dialog
                visible={isDialogVisible}
                onDismiss={() => {
                  setIsDialogVisible(false);
                }}
              >
                <Dialog.Icon icon="logout" size={40} />
                <Dialog.Title>Logout</Dialog.Title>
                <Dialog.Content>
                  <Text>Are you sure to logout?</Text>
                </Dialog.Content>
                <Dialog.Actions>
                  <Button
                    textColor={appTheme.colors.outline}
                    onPress={() => {
                      setIsDialogVisible(false);
                    }}
                  >Cancel</Button>
                  <Button
                    textColor={appTheme.colors.error}
                    onPress={logout}
                  >OK</Button>
                </Dialog.Actions>
              </Dialog>
            </Portal>
          </>
        )}
      </Drawer.Section>
    </>
  );
};
