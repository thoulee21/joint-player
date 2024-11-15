import {
  createMaterialTopTabNavigator
} from '@react-navigation/material-top-tabs';
import { useNavigation } from '@react-navigation/native';
import React, { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { Appbar, useTheme } from 'react-native-paper';
import Animated, { Easing, FadeIn, FadeOut } from 'react-native-reanimated';
import { PackageData, ReduxState, StorageList } from '../components/AppDataScreens';
import { MMKVStorageIndicator } from '../components/StorageIndicator';

const TopTab = createMaterialTopTabNavigator();

const ActionBar = ({ routeIndex }: { routeIndex: number }) => {
  const navigation = useNavigation();
  return (
    <Appbar.Header>
      <Appbar.BackAction onPress={navigation.goBack} />
      <Appbar.Content title="App Data" />

      {routeIndex === 1 && (
        <Animated.View
          entering={FadeIn.easing(Easing.inOut(Easing.quad))}
          exiting={FadeOut.easing(Easing.inOut(Easing.quad))}
        >
          <MMKVStorageIndicator />
        </Animated.View>
      )}
    </Appbar.Header >
  );
};

export function AppDataScreen() {
  const appTheme = useTheme();
  const [routeIndex, setRouteIndex] = useState(0);

  return (
    <View style={styles.root}>
      <ActionBar routeIndex={routeIndex} />
      <TopTab.Navigator
        backBehavior="none"
        screenOptions={{
          lazy: true,
          tabBarStyle: {
            backgroundColor: appTheme.colors.background,
          },
        }}
        screenListeners={() => ({
          state: ({ data }) => {
            setRouteIndex(data.state.index);
          }
        })}
      >
        <TopTab.Screen
          name="ReduxState"
          component={ReduxState}
          options={{ title: 'State' }}
        />
        <TopTab.Screen
          name="LocalStorage"
          component={StorageList}
          options={{ title: 'Storage' }}
        />
        <TopTab.Screen
          name="PackageData"
          component={PackageData}
          options={{ title: 'Package' }}
        />
      </TopTab.Navigator>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
});
