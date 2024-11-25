import {
  createDrawerNavigator,
  type DrawerContentComponentProps,
} from '@react-navigation/drawer';
import React, { useCallback } from 'react';
import { Icon } from 'react-native-paper';
import { Favs, Player, SearchPlaylist } from '../pages';
import { BlurBackground } from './BlurBackground';
import { DrawerItemList } from './DrawerItemList';
import { UserBackground, UserInfo } from './UserHeader';

const Drawer = createDrawerNavigator();

const renderDrawerIcon = (focusedIcon: string) => ({
  color, focused, size
}: {
  color: string, focused: boolean, size: number
}) => (
  <Icon
    size={size}
    color={color}
    source={
      `${focusedIcon}${focused ? '' : '-outline'}`
    }
  />
);

export function DrawerNavi() {
  const renderDrawerContent = useCallback((
    props: DrawerContentComponentProps
  ) => (
    <BlurBackground>
      <UserBackground>
        <UserInfo />
        <DrawerItemList {...props} />
      </UserBackground>
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
    </Drawer.Navigator >
  );
}
