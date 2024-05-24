import { createDrawerNavigator } from '@react-navigation/drawer';
import React, { useMemo } from 'react';
import { Icon } from 'react-native-paper';
import { BlurBackground, DrawerItemList } from '.';
import { Favs, Player, Settings } from '../pages';

const Drawer = createDrawerNavigator();

const ROUTES = [
    {
        name: 'Player',
        component: Player,
        focusedIcon: 'music-circle',
        unfocusedIcon: 'music-circle-outline'
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
        unfocusedIcon: 'cog-outline'
    },
];

export function DrawerNavi() {
    const DrawerRoutes = useMemo(() =>
        ROUTES.map(({ name, component, focusedIcon, unfocusedIcon }) => (
            <Drawer.Screen
                key={name}
                name={name}
                component={component}
                options={{
                    drawerIcon: ({ color, focused, size }) => (
                        <Icon
                            size={size}
                            source={focused ? focusedIcon : unfocusedIcon}
                            color={color}
                        />
                    ),
                }}
            />
        )), []);

    return (
        <Drawer.Navigator
            initialRouteName="Player"
            screenOptions={{ headerShown: false }}
            drawerContent={(props) =>
                <BlurBackground>
                    <DrawerItemList {...props} />
                </BlurBackground>
            }
        >
            {DrawerRoutes}
        </Drawer.Navigator>
    );
}
