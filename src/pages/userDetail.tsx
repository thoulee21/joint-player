import {
  FadingView,
  Header,
  ScrollViewWithHeaders,
  type ScrollHeaderProps,
  type SurfaceComponentProps
} from '@codeherence/react-native-header';
import { useNavigation } from '@react-navigation/native';
import { FlashList } from '@shopify/flash-list';
import React, { useCallback } from 'react';
import { Linking, StyleSheet, useWindowDimensions, View } from 'react-native';
import { Appbar, List, Portal, Text, useTheme } from 'react-native-paper';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
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

  const renderPlaylist = useCallback((props: any) => (
    <PlaylistDisplay {...props} />
  ), []);

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
          <Appbar.BackAction
            onPress={navigation.goBack}
            color="white"
          />
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
      <ScrollViewWithHeaders
        // absoluteHeader
        largeHeaderContainerStyle={{
          height: height * 0.35,
        }}
        HeaderComponent={renderHeader}
        LargeHeaderComponent={renderLargeHeader}
        overScrollMode="never"
        scrollToOverflowEnabled={false}
        style={styles.root}
        contentInset={{ top: 0 }}
      >
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
                    //@ts-expect-error
                    navigation.navigate('DrawerNavi', {
                      screen: 'Favorites',
                    });
                  }}
                />
              )}
            </>
          }
        />

        <PoweredBy />
      </ScrollViewWithHeaders>
    </Portal.Host>
  );
};

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
  background: {
    height: '80%',
  },
  attrs: {
    marginVertical: '3%',
  },
  smallHeaderLeft: {
    width: 'auto',
    paddingRight: 0,
  },
  headerTitle: {
    textAlign: 'left',
    justifyContent: 'flex-start',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  avatar: {
    marginTop: '25%',
  }
});
