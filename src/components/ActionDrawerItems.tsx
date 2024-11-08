import type {
  DrawerNavigationHelpers,
} from '@react-navigation/drawer/lib/typescript/src/types';
import React, { useCallback } from 'react';
import { Alert, ToastAndroid } from 'react-native';
import HapticFeedback, {
  HapticFeedbackTypes,
} from 'react-native-haptic-feedback';
import { Drawer, Icon, useTheme } from 'react-native-paper';
import {
  useAppDispatch,
  useAppSelector,
} from '../hook/reduxHooks';
import {
  initialState as initialUser,
  resetUser,
  selectUser,
} from '../redux/slices/user';

export const ActionDrawerItems = ({ navigation }: {
  navigation: DrawerNavigationHelpers
}) => {
  const dispatch = useAppDispatch();
  const appTheme = useTheme();

  const currentUser = useAppSelector(selectUser);
  const isLoggedOut = currentUser === initialUser;

  const renderLogoutIcon = useCallback(
    (props: any) => (
      <Icon
        {...props}
        source="logout"
        color={appTheme.colors.error}
      />
    ), [appTheme.colors.error]);

  const logout = useCallback(() => {
    HapticFeedback.trigger(
      HapticFeedbackTypes.notificationWarning
    );
    Alert.alert(
      'Logout',
      'Are you sure to logout?', [
      { text: 'Cancel', style: 'cancel' }, {
        text: 'OK',
        onPress: () => {
          dispatch(resetUser());
          navigation.closeDrawer();
          ToastAndroid.show(
            'User logged out',
            ToastAndroid.SHORT
          );
        }
      }]
    );
  }, [dispatch, navigation]);

  return (
    <Drawer.Section showDivider={false}>
      <Drawer.Item
        label="Switch User"
        icon="account-switch-outline"
        onPress={() => {
          navigation.closeDrawer();
          navigation.navigate('SwitchUser');
        }}
      />
      {!isLoggedOut && (
        <Drawer.Item
          label="Logout"
          icon={renderLogoutIcon}
          onPress={logout}
        />
      )}
    </Drawer.Section>
  );
};
