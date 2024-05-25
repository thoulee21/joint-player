import {
    StackCardInterpolationProps,
    StackNavigationOptions,
    TransitionPresets,
    createStackNavigator
} from '@react-navigation/stack';
import React from 'react';
import { DrawerNavi } from '.';
import {
    AlbumDetail,
    Artist,
    Comments,
    Login,
    LyricsScreen,
    MvDetail,
    MvPlayer,
    WebViewScreen,
} from '../pages';

const Stack = createStackNavigator();

// 弹性动画
const flexAnimation = ({ current, layouts }:
    StackCardInterpolationProps
) => ({
    cardStyle: {
        transform: [
            {
                translateX: current.progress.interpolate({
                    inputRange: [0, 1],
                    outputRange: [layouts.screen.width, 0],
                }),
            },
        ],
    }
});

const screenOptions: StackNavigationOptions = {
    headerShown: false,
    ...TransitionPresets.SlideFromRightIOS,
    cardStyleInterpolator: flexAnimation,
};

export function RootStack() {
    return (
        <Stack.Navigator screenOptions={screenOptions}>
            <Stack.Screen name="DrawerNavi" component={DrawerNavi} />
            <Stack.Screen name="WebView" component={WebViewScreen} />
            <Stack.Screen name="Comments" component={Comments} />
            <Stack.Screen name="Lyrics" component={LyricsScreen} />
            <Stack.Screen name="MvPlayer" component={MvPlayer} />
            <Stack.Screen name="MvDetail" component={MvDetail} />
            <Stack.Screen name="Artist" component={Artist} />
            <Stack.Screen name="AlbumDetail" component={AlbumDetail} />
            <Stack.Screen name="Login" component={Login} />
        </Stack.Navigator>
    );
}
