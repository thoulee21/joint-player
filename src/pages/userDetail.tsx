import { DrawerToggleButton } from '@react-navigation/drawer';
import { useNavigation } from '@react-navigation/native';
import Color from 'color';
import React, { useMemo } from 'react';
import { Linking, ScrollView, StyleSheet, useWindowDimensions, View } from 'react-native';
import { Appbar, List, Portal, Text, useTheme } from 'react-native-paper';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { BlurBackground } from '../components/BlurBackground';
import { LottieAnimation } from '../components/LottieAnimation';
import { PlaylistCover } from '../components/PlaylistCover';
import { UserAttrs } from '../components/UserAttrs';
import { UserBackground, UserInfo } from '../components/UserHeader';
import { useAppSelector } from '../hook';
import { selectUser } from '../redux/slices';

export const UserDetail = () => {
  const navigation = useNavigation();
  const appTheme = useTheme();

  const insets = useSafeAreaInsets();
  const window = useWindowDimensions();

  const user = useAppSelector(selectUser);

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
                <DrawerToggleButton tintColor={appTheme.colors.onSurface} />
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
                <Appbar.Content title="Account" />
                <Appbar.Action
                  icon="cog-outline"
                  onPress={() => {
                    navigation.navigate('Settings' as never);
                  }}
                />
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
            <PlaylistCover />
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
