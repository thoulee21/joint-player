import {
  createMaterialTopTabNavigator
} from '@react-navigation/material-top-tabs';
import { useNavigation } from '@react-navigation/native';
import React, { useCallback, useLayoutEffect, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { useTheme } from 'react-native-paper';
import Animated, { Easing, FadeIn, FadeOut } from 'react-native-reanimated';
import { PackageData, ReduxState, StorageList } from '../components/AppDataScreens';
import { MMKVStorageIndicator } from '../components/StorageIndicator';

const TopTab = createMaterialTopTabNavigator();

const Actions = ({ routeIndex }: { routeIndex: number }) => {
  return (
    routeIndex === 1 && (
      <Animated.View
        entering={FadeIn.easing(Easing.inOut(Easing.quad))}
        exiting={FadeOut.easing(Easing.inOut(Easing.quad))}
      >
        <MMKVStorageIndicator />
      </Animated.View>
    )
  );
};

export function AppDataScreen() {
  const navigation = useNavigation();
  const appTheme = useTheme();
  const [routeIndex, setRouteIndex] = useState(0);

  const renderActions = useCallback(() => (
    <Actions routeIndex={routeIndex} />
  ), [routeIndex]);

  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: renderActions,
      headerStyle: {
        backgroundColor: appTheme.colors.background,
      }
    });
  }, [appTheme.colors.background, navigation, renderActions, routeIndex]);

  return (
    <View style={styles.root}>
      <TopTab.Navigator
        backBehavior="none"
        screenOptions={{
          lazy: true,
          tabBarStyle: {
            backgroundColor: appTheme.colors.background,
          },
          swipeEnabled: false,
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
