import {
    createDrawerNavigator,
    type DrawerContentComponentProps,
} from '@react-navigation/drawer';
import React, { useCallback, useMemo } from 'react';
import { Icon } from 'react-native-paper';
import { Favs, Player, Settings } from '../pages';
import { BlurBackground } from './BlurBackground';
import { DrawerItemList } from './DrawerItemList';
import { Spacer } from './Spacer';
import { UserHeader } from './UserHeader';
import { UpdateSnackbar } from './UpdateSnackbar';

const Drawer = createDrawerNavigator();

const ROUTES = [
    {
        name: 'Player',
        component: Player,
        focusedIcon: 'music-circle',
        unfocusedIcon: 'music-circle-outline',
    },
    {
        name: 'Favorites',
        component: Favs,
        focusedIcon: 'heart',
        unfocusedIcon: 'heart-outline',
    },
    {
        name: 'Settings',
        component: Settings,
        focusedIcon: 'cog',
        unfocusedIcon: 'cog-outline',
    },
];

const drawerIcon = (
    focusedIcon: string, unfocusedIcon: string
) =>
    ({ color, focused, size }: {
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
            name, component, focusedIcon, unfocusedIcon,
        }) => (
            <Drawer.Screen
                key={name}
                name={name}
                component={component}
                options={{
                    drawerIcon:
                        drawerIcon(focusedIcon, unfocusedIcon),
                }}
            />
        )), []);

    const renderDrawerContent = useCallback(
        (props: DrawerContentComponentProps) => (
            <BlurBackground>
                <UserHeader />
                <Spacer />
                <DrawerItemList {...props} />
                <UpdateSnackbar />
            </BlurBackground>
        ), []);

    return (
        <Drawer.Navigator
            initialRouteName="Player"
            screenOptions={{
                headerShown: false,
                lazy: false,
            }}
            drawerContent={renderDrawerContent}
        >
            {DrawerRoutes}
        </Drawer.Navigator>
    );
}
