import {
    StackCardInterpolationProps,
    StackNavigationOptions,
    TransitionPresets,
    createStackNavigator,
} from '@react-navigation/stack';
import React from 'react';
import {
    AboutScreen,
    AlbumDetail,
    AniGallery,
    AppDataScreen,
    Artist,
    Comments,
    DevScreen,
    IssueReport,
    LyricsScreen,
    MvDetail,
    MvPlayer,
    SwitchUser,
    TestScreen,
    WebViewScreen,
} from '../pages';
import { DrawerNavi } from './DrawerNavi';

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
    },
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
            <Stack.Screen name="IssueReport" component={IssueReport} />
            <Stack.Screen name="Dev" component={DevScreen} />
            <Stack.Screen name="About" component={AboutScreen} />
            <Stack.Screen name="AppData" component={AppDataScreen} />
            <Stack.Screen name="SwitchUser" component={SwitchUser} />
            <Stack.Screen name="AniGallery" component={AniGallery} />
            <Stack.Screen name="Test" component={TestScreen} />
        </Stack.Navigator>
    );
}
