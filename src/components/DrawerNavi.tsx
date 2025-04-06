import {
  createDrawerNavigator,
  type DrawerContentComponentProps,
} from "@react-navigation/drawer";
import React, { useCallback } from "react";
import { useTranslation } from "react-i18next";
import { Icon } from "react-native-paper";
import { Favs, Player, SearchPlaylist, UserDetail } from "../pages";
import { BlurBackground } from "./BlurBackground";
import { DrawerItemList } from "./DrawerItemList";
import { UserBackground, UserInfo } from "./UserHeader";

const Drawer = createDrawerNavigator();

const renderDrawerIcon =
  (focusedIcon: string, noOutline?: boolean) =>
  ({
    color,
    focused,
    size,
  }: {
    color: string;
    focused: boolean;
    size: number;
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
  const { t } = useTranslation();

  const renderDrawerContent = useCallback(
    (props: DrawerContentComponentProps) => (
      <BlurBackground>
        <UserBackground>
          <UserInfo />
        </UserBackground>
        <DrawerItemList {...props} />
      </BlurBackground>
    ),
    []
  );

  return (
    <Drawer.Navigator
      drawerContent={renderDrawerContent}
      screenOptions={{ headerShown: false, lazy: false }}
    >
      <Drawer.Screen
        name="Player"
        component={Player}
        options={{
          title: t("drawer.item.player.title"),
          drawerIcon: renderDrawerIcon("music-circle"),
        }}
      />
      <Drawer.Screen
        name="Favorites"
        component={Favs}
        options={{
          title: t("drawer.item.favs.title"),
          drawerIcon: renderDrawerIcon("heart"),
        }}
      />
      <Drawer.Screen
        name="SearchPlaylist"
        component={SearchPlaylist}
        options={{
          title: t("drawer.item.playlist.title"),
          drawerIcon: renderDrawerIcon("playlist-music"),
        }}
      />
      <Drawer.Screen
        name="UserDetail"
        component={UserDetail}
        options={{
          title: t("drawer.item.account.title"),
          drawerIcon: renderDrawerIcon("account"),
        }}
      />
    </Drawer.Navigator>
  );
}
