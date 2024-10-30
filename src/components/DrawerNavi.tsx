import {
    createDrawerNavigator,
    type DrawerContentComponentProps,
} from '@react-navigation/drawer';
import React, { useCallback, useMemo } from 'react';
import { Icon } from 'react-native-paper';
import { Favs, Player, Settings } from '../pages';
import { BlurBackground } from './BlurBackground';
import { DrawerItemList } from './DrawerItemList';
import { UserHeader } from './UserHeader';

const Drawer = createDrawerNavigator();

const ROUTES = [
    {
        name: 'Player',
        component: Player,
        focusedIcon: 'music-circle',
        unfocusedIcon: 'music-circle-outline',
        lazy: false,
    },
    {
        name: 'Favorites',
        component: Favs,
        focusedIcon: 'heart',
        unfocusedIcon: 'heart-outline',
        lazy: false,
    },
    {
        name: 'Settings',
        component: Settings,
        focusedIcon: 'cog',
        unfocusedIcon: 'cog-outline',
        lazy: true,
    },
];

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
    const DrawerRoutes = useMemo(() =>
        ROUTES.map(({
            name, component, focusedIcon, unfocusedIcon, lazy,
        }) => (
            <Drawer.Screen
                key={name}
                name={name}
                component={component}
                options={{
                    drawerIcon:
                        drawerIcon(focusedIcon, unfocusedIcon),
                    lazy,
                }}
            />
        )), []);

    const renderDrawerContent = useCallback(
        (props: DrawerContentComponentProps) => (
            <BlurBackground>
                <UserHeader />
                <DrawerItemList {...props} />
            </BlurBackground>
        ), []);

    return (
        <Drawer.Navigator
            screenOptions={{ headerShown: false }}
            drawerContent={renderDrawerContent}
        >
            {DrawerRoutes}
        </Drawer.Navigator>
    );
}
