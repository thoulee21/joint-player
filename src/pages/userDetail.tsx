import { DrawerToggleButton } from '@react-navigation/drawer';
import { useNavigation } from '@react-navigation/native';
import { FlashList, type ListRenderItemInfo } from '@shopify/flash-list';
import Color from 'color';
import React, { useCallback, useMemo } from 'react';
import { Linking, ScrollView, StyleSheet, useWindowDimensions, View } from 'react-native';
import { Appbar, List, Portal, Text, useTheme } from 'react-native-paper';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import useSWR from 'swr';
import { BlurBackground } from '../components/BlurBackground';
import { LottieAnimation } from '../components/LottieAnimation';
import { PlaylistCover } from '../components/PlaylistCover';
import { PlaylistItem } from '../components/SearchPlaylistItem';
import { UserAttrs } from '../components/UserAttrs';
import { UserBackground, UserInfo } from '../components/UserHeader';
import { useAppSelector } from '../hook';
import { selectPlaylists, selectUser, type PlaylistType } from '../redux/slices';
import type { Main } from '../types/playlistDetail';
import type { Playlist } from '../types/searchPlaylist';
import { fetcher } from '../utils/retryFetcher';

const PlaylistDisplay = (
  props: ListRenderItemInfo<PlaylistType>
) => {
  const { playlistID } = props.item;

  const { data, isLoading, error, mutate } = useSWR<Main>(
    `https://music.163.com/api/playlist/detail?id=${playlistID}`,
    { fetcher: fetcher }
  );

  if (isLoading) { return null; }

  if (error || data?.code !== 200) {
    return (
      <List.Item
        title="Error"
        // @ts-expect-error
        description={error?.message || data?.msg}
        onPress={() => mutate()}
      />
    );
  }

  return (
    <PlaylistItem
      {...props}
      item={data.result as unknown as Playlist}
    />
  );
};

export const UserDetail = () => {
  const navigation = useNavigation();
  const appTheme = useTheme();

  const insets = useSafeAreaInsets();
  const window = useWindowDimensions();

  const user = useAppSelector(selectUser);
  const playlists = useAppSelector(selectPlaylists);

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
            <FlashList
              data={playlists}
              renderItem={renderPlaylist}
              estimatedItemSize={92}
            />
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
