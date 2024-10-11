import { createDrawerNavigator, DrawerItemList } from '@react-navigation/drawer';
import React, { useMemo } from 'react';
import { Icon } from 'react-native-paper';
import { Favs, Login, Player, Settings } from '../pages';
import { BlurBackground } from './BlurBackground';
import { Spacer } from './Spacer';
import { UserHeader } from './UserHeader';

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
        name: 'Account',
        component: Login,
        focusedIcon: 'account',
        unfocusedIcon: 'account-outline',
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
                    <UserHeader />
                    <Spacer />

                    <DrawerItemList {...props} />
                </BlurBackground>
            }
        >
            {DrawerRoutes}
        </Drawer.Navigator>
    );
}
