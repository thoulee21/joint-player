import {
  HeaderStyleInterpolators,
  StackNavigationOptions,
  TransitionPresets,
  createStackNavigator
} from '@react-navigation/stack';
import React from 'react';
import { StyleSheet, View } from 'react-native';
import { useTheme } from 'react-native-paper';
import {
  AboutScreen,
  AlbumDetail,
  AniGallery,
  AppDataScreen,
  Artist,
  ChangeLog,
  Comments,
  DevScreen,
  IssueReport,
  Logcat,
  LyricsScreen,
  MvDetail,
  MvPlayer,
  PlaylistDetailScreen,
  ReleaseTags,
  Search,
  Settings,
  SwitchUser,
  UserDetail,
  WebViewScreen,
} from '../pages';
import TestScreen from '../pages/testScreen';
import { DrawerNavi } from './DrawerNavi';

const Stack = createStackNavigator();

const screenOptions: StackNavigationOptions = {
  ...TransitionPresets.SlideFromRightIOS,
  headerShown: false,
  headerMode: 'float',
  headerStyleInterpolator: HeaderStyleInterpolators.forUIKit,
  headerShadowVisible: false,
  freezeOnBlur: true,
  gestureEnabled: true,
};

export function RootStack() {
  const appTheme = useTheme();
  return (
    <View style={[styles.rootView, {
      // to avoid white flash when switching between screens
      backgroundColor: appTheme.colors.background,
    }]}>
      <Stack.Navigator screenOptions={screenOptions}>
        <Stack.Screen name="DrawerNavi" component={DrawerNavi} />
        <Stack.Screen name="Comments" component={Comments} />
        <Stack.Screen name="Lyrics" component={LyricsScreen} />
        <Stack.Screen name="MvPlayer" component={MvPlayer} />
        <Stack.Screen name="MvDetail" component={MvDetail} />
        <Stack.Screen name="Artist" component={Artist} />
        <Stack.Screen name="Dev" component={DevScreen} />
        <Stack.Screen name="About" component={AboutScreen} />
        <Stack.Screen name="AppData" component={AppDataScreen} options={{ headerShown: true }} />
        <Stack.Screen name="AniGallery" component={AniGallery} options={{
          headerShown: true,
          title: 'Animation Gallery',
        }} />
        <Stack.Screen name="Test" component={TestScreen} options={{ headerShown: true }} />
        <Stack.Screen name="AlbumDetail" component={AlbumDetail} />
        <Stack.Screen name="Settings" component={Settings} />
        <Stack.Screen name="PlaylistDetail" component={PlaylistDetailScreen} />
        <Stack.Screen name="Logcat" component={Logcat} options={{ headerShown: true }} />
        <Stack.Screen name="SwitchUser" component={SwitchUser} />
        <Stack.Screen name="UserDetail" component={UserDetail} />
        <Stack.Screen name="IssueReport" component={IssueReport} />
        <Stack.Screen name="ChangeLog" component={ChangeLog} options={{ headerShown: true }} />
        <Stack.Screen name="ReleaseTags" component={ReleaseTags} options={{
          headerShown: true,
          title: 'Release Tags',
        }} />

        <Stack.Group screenOptions={TransitionPresets.ModalPresentationIOS}>
          <Stack.Screen name="WebView" component={WebViewScreen} />
          <Stack.Screen name="Search" component={Search} options={{ gestureEnabled: false }} />
        </Stack.Group>
      </Stack.Navigator>
    </View>
  );
}

const styles = StyleSheet.create({
  rootView: {
    flex: 1,
  },
});
