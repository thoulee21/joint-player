import { DrawerToggleButton } from '@react-navigation/drawer';
import { useNavigation } from '@react-navigation/native';
import { FlashList } from '@shopify/flash-list';
import Color from 'color';
import React, { useCallback, useMemo } from 'react';
import { Linking, ScrollView, StyleSheet, useWindowDimensions, View } from 'react-native';
import { Appbar, List, Portal, Text, useTheme } from 'react-native-paper';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { BlurBackground } from '../components/BlurBackground';
import { LottieAnimation } from '../components/LottieAnimation';
import { PlaylistCover } from '../components/PlaylistCover';
import { PlaylistDisplay } from '../components/PlaylistDisplayItem';
import { UserAttrs } from '../components/UserAttrs';
import { UserBackground, UserInfo } from '../components/UserHeader';
import { useAppSelector } from '../hook';
import { favs, selectPlaylists, selectUser } from '../redux/slices';

export const UserDetail = () => {
  const navigation = useNavigation();
  const appTheme = useTheme();

  const insets = useSafeAreaInsets();
  const window = useWindowDimensions();

  const user = useAppSelector(selectUser);
  const playlists = useAppSelector(selectPlaylists);
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

  const renderPlaylist = useCallback(
    (props: any) => (
      <PlaylistDisplay {...props} />
    ), []);

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
                <DrawerToggleButton
                  tintColor={appTheme.colors.onSurface}
                />
                <Appbar.Action
                  icon="open-in-new"
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

          <FlashList
            data={playlists}
            renderItem={renderPlaylist}
            estimatedItemSize={92}
            ListHeaderComponent={
              <>
                <List.Subheader style={{
                  color: appTheme.colors.secondary
                }}>
                  {playlists.length ? 'Playlists' : null}
                </List.Subheader>
                {favorites.length >= 1 && (
                  <PlaylistCover
                    artwork={favorites[0].artwork}
                    description={`${favorites[0].title}\n${favorites[0].artist}`}
                    length={favorites.length}
                    name="Favorites"
                    onPress={() => {
                      navigation.navigate('Favorites' as never);
                    }}
                  />
                )}
              </>
            }
          />

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
