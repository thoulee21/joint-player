import {
    createDrawerNavigator,
    type DrawerContentComponentProps,
} from '@react-navigation/drawer';
import React, { useCallback } from 'react';
import { Icon } from 'react-native-paper';
import { Favs, Player, Settings } from '../pages';
import { BlurBackground } from './BlurBackground';
import { DrawerItemList } from './DrawerItemList';
import { UserHeader } from './UserHeader';

const Drawer = createDrawerNavigator();

const renderDrawerIcon = (focusedIcon: string) => (
    { color, focused, size }: {
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
    const renderDrawerContent = useCallback(
        (props: DrawerContentComponentProps) => (
            <BlurBackground>
                <UserHeader />
                <DrawerItemList {...props} />
            </BlurBackground>
        ), []);

    return (
        <Drawer.Navigator
            drawerContent={renderDrawerContent}
            screenOptions={{ headerShown: false }}
        >
            <Drawer.Screen name="Player" component={Player} options={{
                lazy: false,
                drawerIcon: renderDrawerIcon('music-circle'),
            }} />
            <Drawer.Screen name="Favorites" component={Favs} options={{
                lazy: false,
                drawerIcon: renderDrawerIcon('heart'),
            }} />
            <Drawer.Screen name="Settings" component={Settings} options={{
                drawerIcon: renderDrawerIcon('cog'),
            }} />
        </Drawer.Navigator >
    );
}
