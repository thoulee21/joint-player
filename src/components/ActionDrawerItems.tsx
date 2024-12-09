import React, {
  useCallback,
  useMemo,
  useState,
} from 'react';
import { useTranslation } from 'react-i18next';
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
  useTheme
} from 'react-native-paper';
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
  navigation: any
}) => {
  const dispatch = useAppDispatch();
  const { t } = useTranslation();
  const appTheme = useTheme();
  const currentUser = useAppSelector(selectUser);

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
      t('drawer.account.logout.toast'),
      ToastAndroid.SHORT
    );
  }, [dispatch, navigation, t]);

  return (
    <>
      <Drawer.Item
        label={t('drawer.item.switchAccount.label')}
        icon={renderSwitchUserIcon}
        onPress={() => {
          navigation.closeDrawer();
          navigation.navigate('SwitchUser');
        }}
      />

      {!isLoggedOut && (
        <>
          <Drawer.Item
            label={t('drawer.account.logout.label')}
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
              <Dialog.Title>{t('drawer.account.logout.label')}</Dialog.Title>
              <Dialog.Content>
                <Text>{t('drawer.account.logout.dialog.ask')}</Text>
              </Dialog.Content>
              <Dialog.Actions>
                <Button
                  textColor={appTheme.colors.outline}
                  onPress={() => {
                    setIsDialogVisible(false);
                  }}
                >
                  {t('about.update.dialog.actions.cancel')}
                </Button>
                <Button
                  textColor={appTheme.colors.error}
                  onPress={logout}
                >
                  {t('drawer.account.logout.dialog.ok')}
                </Button>
              </Dialog.Actions>
            </Dialog>
          </Portal>
        </>
      )}
    </>
  );
};
