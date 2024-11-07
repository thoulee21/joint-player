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

const drawerIcon = (
    focusedIcon: string, unfocusedIcon: string
) => ({ color, focused, size }: {
    color: string, focused: boolean, size: number
}) => (
        <Icon
            size={size}
            source={focused ? focusedIcon : unfocusedIcon}
            color={color}
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
                drawerIcon: drawerIcon(
                    'music-circle',
                    'music-circle-outline'
                )
            }} />
            <Drawer.Screen name="Favorites" component={Favs} options={{
                lazy: false,
                drawerIcon: drawerIcon(
                    'heart',
                    'heart-outline'
                )
            }} />
            <Drawer.Screen name="Settings" component={Settings} options={{
                drawerIcon: drawerIcon(
                    'cog',
                    'cog-outline'
                )
            }} />
        </Drawer.Navigator >
    );
}
