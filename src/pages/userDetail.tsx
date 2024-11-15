import {
  Header,
  ScalingView,
  ScrollViewWithHeaders,
  type ScrollHeaderProps,
  type ScrollLargeHeaderProps,
  type SurfaceComponentProps
} from '@codeherence/react-native-header';
import { useNavigation } from '@react-navigation/native';
import { FlashList } from '@shopify/flash-list';
import { BlurView } from 'expo-blur';
import React, { useCallback } from 'react';
import { Linking, StyleSheet, useWindowDimensions, View } from 'react-native';
import { Appbar, List, Portal, Text, useTheme } from 'react-native-paper';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { BlurBackground } from '../components/BlurBackground';
import { PlaylistCover } from '../components/PlaylistCover';
import { PlaylistDisplay } from '../components/PlaylistDisplayItem';
import { PoweredBy } from '../components/PoweredBy';
import { UserAttrs } from '../components/UserAttrs';
import { UserBackground, UserInfo } from '../components/UserHeader';
import { useAppSelector } from '../hook';
import { favs, selectPlaylists, selectUser } from '../redux/slices';

const HeaderSurface: React.FC<SurfaceComponentProps> = () => {
  const appTheme = useTheme();
  return (
    <BlurView
      style={StyleSheet.absoluteFill}
      tint={appTheme.dark ? 'dark' : 'light'}
      intensity={100}
    />
  );
};

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

  const renderHeader = useCallback((
    { showNavBar }: ScrollHeaderProps
  ) => (
    <Portal>
      <Header
        showNavBar={showNavBar}
        noBottomBorder
        headerCenter={
          <Text
            variant="titleLarge"
            numberOfLines={1}
          >{user.username}</Text>
        }
        headerStyle={{ height: 64 + insets.top }}
        headerCenterStyle={styles.headerTitle}
        headerLeftStyle={styles.smallHeaderLeft}
        headerLeft={
          <View style={styles.row}>
            <Appbar.BackAction
              onPress={navigation.goBack}
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
          </View>
        }
        headerRight={
          <Appbar.Action
            icon="cog-outline"
            onPress={() => {
              navigation.navigate('Settings' as never);
            }}
          />
        }
        SurfaceComponent={HeaderSurface}
      />
    </Portal>
  ), [insets.top, navigation, user.id, user.username]);

  const renderLargeHeader = useCallback((
    { scrollY }: ScrollLargeHeaderProps
  ) => (
    <ScalingView scrollY={scrollY}>
      <UserBackground>
        <UserInfo />
      </UserBackground>
    </ScalingView>
  ), []);

  return (
    <Portal.Host>
      <BlurBackground>
        <ScrollViewWithHeaders
          absoluteHeader
          largeHeaderContainerStyle={{
            height: height * 0.35,
          }}
          HeaderComponent={renderHeader}
          LargeHeaderComponent={renderLargeHeader}
          overScrollMode="never"
          scrollToOverflowEnabled={false}
          disableAutoFixScroll
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
                      navigation.navigate('Favorites' as never);
                    }}
                  />
                )}
              </>
            }
          />

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
  }
});
