import { useNavigation } from '@react-navigation/native';
import Color from 'color';
import React from 'react';
import { Linking, StyleSheet, View } from 'react-native';
import { Appbar, List, Text, Tooltip, useTheme } from 'react-native-paper';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { BlurBackground } from '../components/BlurBackground';
import { LottieAnimation } from '../components/LottieAnimation';
import { PlaylistItem } from '../components/PlaylistItem';
import { UserAttrs } from '../components/UserAttrs';
import { UserBackground, UserInfo } from '../components/UserHeader';
import { useAppSelector } from '../hook';
import { favs, selectUser } from '../redux/slices';

export const UserDetail = () => {
  const navigation = useNavigation();
  const appTheme = useTheme();
  const insets = useSafeAreaInsets();

  const user = useAppSelector(selectUser);
  const favorites = useAppSelector(favs);

  return (
    <BlurBackground>
      <UserBackground style={styles.background}>
        <Appbar.Header
          elevated
          statusBarHeight={0}
          style={{
            backgroundColor: Color(
              appTheme.colors.surface
            ).alpha(0.5).string(),
            paddingTop: insets.top,
            height: 56 + insets.top,
          }}
        >
          <Appbar.BackAction onPress={navigation.goBack} />
          <Appbar.Content title="User Detail" />
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
          <Tooltip title="Switch User" >
            <Appbar.Action
              icon="account-switch-outline"
              onPress={() => {
                navigation.navigate('SwitchUser' as never);
              }}
            />
          </Tooltip>
        </Appbar.Header>

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
        style={styles.footer}
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
    </BlurBackground>
  );
};

const styles = StyleSheet.create({
  info: {
    marginTop: '33%',
  },
  background: {
    height: '80%',
  },
  attrs: {
    marginVertical: '3%',
    height: '12%',
  },
  footer: {
    justifyContent: 'flex-end',
  },
  footerTxt: {
    textAlign: 'center',
  }
});
