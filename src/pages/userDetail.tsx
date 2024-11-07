import { useNavigation } from '@react-navigation/native';
import Color from 'color';
import React, { useCallback, useMemo } from 'react';
import { Alert, Linking, ScrollView, StyleSheet, ToastAndroid, useWindowDimensions, View } from 'react-native';
import HapticFeedback, { HapticFeedbackTypes } from 'react-native-haptic-feedback';
import { Appbar, List, Portal, Text, Tooltip, useTheme } from 'react-native-paper';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { BlurBackground } from '../components/BlurBackground';
import { LottieAnimation } from '../components/LottieAnimation';
import { PlaylistItem } from '../components/PlaylistItem';
import { UserAttrs } from '../components/UserAttrs';
import { UserBackground, UserInfo } from '../components/UserHeader';
import { useAppDispatch, useAppSelector } from '../hook';
import { favs, resetUser, selectUser } from '../redux/slices';

export const UserDetail = () => {
  const dispatch = useAppDispatch();
  const navigation = useNavigation();
  const appTheme = useTheme();

  const insets = useSafeAreaInsets();
  const window = useWindowDimensions();

  const user = useAppSelector(selectUser);
  const favorites = useAppSelector(favs);

  const appbarBgColor = useMemo(() => {
    if (appTheme.dark) {
      return Color(
        appTheme.colors.surface
      ).alpha(0.5).string();
    } else {
      return Color(
        appTheme.colors.surface
      ).fade(0.5).string();
    }
  }, [appTheme.colors.surface, appTheme.dark]);

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
          navigation.goBack();
          dispatch(resetUser());
          ToastAndroid.show(
            'User logged out',
            ToastAndroid.SHORT
          );
        }
      }]
    );
  }, [dispatch, navigation]);

  return (
    <Portal.Host>
      <BlurBackground>
        <ScrollView fadingEdgeLength={50}>
          <UserBackground style={styles.background}>
            <Portal>
              <Appbar.Header
                elevated
                statusBarHeight={0}
                style={{
                  backgroundColor: appbarBgColor,
                  paddingTop: insets.top,
                  height: 56 + insets.top,
                }}
              >
                <Appbar.BackAction onPress={navigation.goBack} />
                <Appbar.Action
                  icon="open-in-app"
                  onPress={() => {
                    //@ts-expect-error
                    navigation.navigate('WebView' as never, {
                      title: 'User Detail',
                      url: `https://music.163.com/user/home?id=${user.id}`,
                    });
                  }}
                  onLongPress={() => {
                    Linking.openURL(
                      `https://music.163.com/user/home?id=${user.id}`
                    );
                  }}
                />
                <Appbar.Content title="User Detail" />
                <Appbar.Action
                  icon="logout"
                  iconColor={appTheme.colors.error}
                  onPress={logout}
                />
                <Tooltip title="Switch User" >
                  <Appbar.Action
                    icon="account-switch-outline"
                    onPress={() => {
                      navigation.navigate('SwitchUser' as never);
                    }}
                  />
                </Tooltip>
              </Appbar.Header>
            </Portal>

            <UserInfo style={styles.info} />
          </UserBackground>

          <View style={styles.attrs}>
            <UserAttrs />
          </View>

          <List.Section
            title="Playlist"
            titleStyle={{
              color: appTheme.colors.secondary
            }}
          >
            <PlaylistItem tracks={favorites} />
          </List.Section>

          <LottieAnimation
            animation="rocket"
            style={[styles.footer, {
              height: window.height * 0.35,
            }]}
          >
            <Text
              variant="labelSmall"
              style={[styles.footerTxt, {
                color: appTheme.colors.outline
              }]}
            >
              Powered by Netease Cloud Music API
            </Text>
          </LottieAnimation>
        </ScrollView>
      </BlurBackground>
    </Portal.Host>
  );
};

const styles = StyleSheet.create({
  info: {
    marginTop: '45%',
  },
  background: {
    height: '80%',
  },
  attrs: {
    marginVertical: '3%',
  },
  footer: {
    justifyContent: 'flex-end',
  },
  footerTxt: {
    textAlign: 'center',
  }
});
