import {
    StackNavigationOptions,
    TransitionPresets,
    createStackNavigator
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
    Logcat,
    LyricsScreen,
    MvDetail,
    MvPlayer,
    PlaylistDetailScreen,
    Search,
    Settings,
    SwitchUser,
    TestScreen,
    WebViewScreen
} from '../pages';
import { DrawerNavi } from './DrawerNavi';

const Stack = createStackNavigator();

const screenOptions: StackNavigationOptions = {
    headerShown: false,
    ...TransitionPresets.SlideFromRightIOS,
};

export function RootStack() {
    return (
        <Stack.Navigator screenOptions={screenOptions}>
            <Stack.Screen name="DrawerNavi" component={DrawerNavi} />
            <Stack.Screen name="Comments" component={Comments} />
            <Stack.Screen name="Lyrics" component={LyricsScreen} />
            <Stack.Screen name="MvPlayer" component={MvPlayer} />
            <Stack.Screen name="MvDetail" component={MvDetail} />
            <Stack.Screen name="Artist" component={Artist} />
            <Stack.Screen name="Dev" component={DevScreen} />
            <Stack.Screen name="About" component={AboutScreen} />
            <Stack.Screen name="AppData" component={AppDataScreen} />
            <Stack.Screen name="AniGallery" component={AniGallery} />
            <Stack.Screen name="Test" component={TestScreen} />
            <Stack.Screen name="AlbumDetail" component={AlbumDetail} />
            <Stack.Screen name="Settings" component={Settings} />
            <Stack.Screen name="PlaylistDetail" component={PlaylistDetailScreen} />
            <Stack.Screen name="Logcat" component={Logcat} />
            <Stack.Screen name="SwitchUser" component={SwitchUser} />
            <Stack.Group screenOptions={TransitionPresets.ModalPresentationIOS}>
                <Stack.Screen name="IssueReport" component={IssueReport} />
                <Stack.Screen name="WebView" component={WebViewScreen} />
                <Stack.Screen name="Search" component={Search} />
            </Stack.Group>
        </Stack.Navigator>
    );
}
