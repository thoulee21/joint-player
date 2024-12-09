import {
  createDrawerNavigator,
  type DrawerContentComponentProps,
} from '@react-navigation/drawer';
import React, { useCallback } from 'react';
import { Icon } from 'react-native-paper';
import { useAppSelector } from '../hook';
import { Favs, Player, SearchPlaylist, UserDetail } from '../pages';
import Test from '../pages/testScreen';
import { selectDevModeEnabled } from '../redux/slices';
import { BlurBackground } from './BlurBackground';
import { DrawerItemList } from './DrawerItemList';
import { UserBackground, UserInfo } from './UserHeader';

const Drawer = createDrawerNavigator();

const renderDrawerIcon = (
  focusedIcon: string,
  noOutline?: boolean,
) => ({ color, focused, size }: {
  color: string, focused: boolean, size: number
}) => (
    <Icon
      size={size}
      color={color}
      source={
        noOutline
          ? focusedIcon
          : focused
            ? focusedIcon
            : `${focusedIcon}-outline`
      }
    />
  );

export function DrawerNavi() {
  const isDev = useAppSelector(selectDevModeEnabled);

  const renderDrawerContent = useCallback((
    props: DrawerContentComponentProps
  ) => (
    <BlurBackground>
      <UserBackground>
        <UserInfo />
      </UserBackground>
      <DrawerItemList {...props} />
    </BlurBackground>
  ), []);

  return (
    <Drawer.Navigator
      drawerContent={renderDrawerContent}
      screenOptions={{
        headerShown: false,
        lazy: false,
      }}
    >
      <Drawer.Screen name="Player" component={Player} options={{
        drawerIcon: renderDrawerIcon('music-circle'),
      }} />
      <Drawer.Screen name="Favorites" component={Favs} options={{
        drawerIcon: renderDrawerIcon('heart'),
      }} />
      <Drawer.Screen name="SearchPlaylist" component={SearchPlaylist} options={{
        title: 'Playlist',
        drawerIcon: renderDrawerIcon('playlist-music'),
      }} />
      <Drawer.Screen name="UserDetail" component={UserDetail} options={{
        title: 'Account',
        drawerIcon: renderDrawerIcon('account'),
      }} />

      {isDev && (
        <Drawer.Screen name="Test" component={Test} options={{
          headerShown: true,
          drawerIcon: renderDrawerIcon(
            'test-tube', true
          ),
        }} />
      )}
    </Drawer.Navigator >
  );
}
