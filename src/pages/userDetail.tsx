import {
  FadingView,
  Header,
  ScrollViewWithHeaders,
  type ScrollHeaderProps,
  type SurfaceComponentProps
} from '@codeherence/react-native-header';
import { DrawerToggleButton } from '@react-navigation/drawer';
import { useNavigation } from '@react-navigation/native';
import React, { useCallback } from 'react';
import { Linking, StyleSheet, useWindowDimensions, View } from 'react-native';
import { Appbar, List, Portal, Text, useTheme } from 'react-native-paper';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { BlurBackground } from '../components/BlurBackground';
import { ImageBlurView } from '../components/ImageBlur';
import { PlaylistCover } from '../components/PlaylistCover';
import { PlaylistDisplay } from '../components/PlaylistDisplayItem';
import { PoweredBy } from '../components/PoweredBy';
import { UserAttrs } from '../components/UserAttrs';
import { UserBackground, UserInfo } from '../components/UserHeader';
import { useAppSelector } from '../hook';
import { favs, selectPlaylists, selectUser } from '../redux/slices';

export const UserDetail = () => {
  const navigation = useNavigation();
  const { height } = useWindowDimensions();
  const insets = useSafeAreaInsets();
  const appTheme = useTheme();

  const user = useAppSelector(selectUser);
  const playlists = useAppSelector(selectPlaylists);
  const favorites = useAppSelector(favs);

  const renderSurface = useCallback((
    { showNavBar }: SurfaceComponentProps
  ) => (
    <FadingView
      opacity={showNavBar}
      style={StyleSheet.absoluteFill}
    >
      <View style={[
        StyleSheet.absoluteFill,
        { backgroundColor: appTheme.colors.background }
      ]} />
    </FadingView>
  ), [appTheme.colors.background]);

  const renderHeader = useCallback((
    props: ScrollHeaderProps
  ) => (
    <Portal>
      <Header
        {...props}
        headerCenter={<Text>{user.username}</Text>}
        initialBorderColor="transparent"
        borderColor={appTheme.colors.outlineVariant}
        SurfaceComponent={renderSurface}
      />
    </Portal>
  ), [appTheme.colors.outlineVariant, renderSurface, user.username]);

  const renderLargeHeader = useCallback(() => (
    <UserBackground>
      <ImageBlurView
        style={[
          styles.row,
          { paddingTop: insets.top, }
        ]}
      >
        <View style={styles.row}>
          <DrawerToggleButton tintColor="white" />
          <Appbar.Action
            icon="open-in-new"
            color="white"
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
        </View>
        <Appbar.Action
          icon="cog-outline"
          color="white"
          onPress={() => {
            navigation.navigate('Settings' as never);
          }}
        />
      </ImageBlurView>

      <UserInfo style={styles.avatar} />
    </UserBackground>
  ), [insets.top, navigation, user.id]);

  return (
    <Portal.Host>
      <BlurBackground>
        <ScrollViewWithHeaders
          HeaderComponent={renderHeader}
          LargeHeaderComponent={renderLargeHeader}
          overScrollMode="never"
          scrollToOverflowEnabled={false}
          style={styles.root}
          contentInset={insets}
        >
          <UserAttrs style={[
            styles.attrs, {
              marginTop: height * 0.1,
            }
          ]} />
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
                //@ts-expect-error
                navigation.navigate('DrawerNavi', {
                  screen: 'Favorites',
                });
              }}
            />
          )}

          {playlists.map((
            item, index
          ) => (
            <PlaylistDisplay
              key={item.playlistID}
              index={index}
              item={item}
            />
          ))}
          <PoweredBy />
        </ScrollViewWithHeaders>
      </BlurBackground>
    </Portal.Host>
  );
};

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
  attrs: {
    marginBottom: '3%',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  avatar: {
    marginTop: '25%',
  }
});
