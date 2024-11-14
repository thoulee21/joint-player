import {
  createMaterialTopTabNavigator,
  MaterialTopTabBarProps,
} from '@react-navigation/material-top-tabs';
import { useNavigation } from '@react-navigation/native';
import React, { useCallback, useState } from 'react';
import { StyleSheet } from 'react-native';
import { Appbar, Icon, SegmentedButtons, useTheme } from 'react-native-paper';
import { PackageData, ReduxState, StorageList } from '../components/AppDataScreens';
import { BlurBackground } from '../components/BlurBackground';
import { MMKVStorageIndicator } from '../components/StorageIndicator';

const TopTab = createMaterialTopTabNavigator();

const ActionBar = ({ routeIndex }: { routeIndex: number }) => {
  const navigation = useNavigation();
  return (
    <Appbar.Header style={styles.transparent}>
      <Appbar.BackAction onPress={navigation.goBack} />
      <Appbar.Content title="App Data" />

      {routeIndex === 1 && (
        <MMKVStorageIndicator />
      )}
    </Appbar.Header>
  );
};

export function AppDataScreen() {
  const appTheme = useTheme();
  const [routeIndex, setRouteIndex] = useState(0);

  const renderTapBar = useCallback(({
    state, navigation: topTabNavi, descriptors,
  }: MaterialTopTabBarProps) => {
    const tabBarItems = state.routes.map(
      (route, index) => {
        const { title, tabBarIcon } = descriptors[route.key].options;
        return {
          value: state.routeNames[index],
          label: title,
          icon: tabBarIcon ? ({ color }: { color: string }) => (
            tabBarIcon({ color, focused: state.index === index })
          ) : undefined,
          showSelectedCheck: true,
        };
      }
    );

    return (
      <SegmentedButtons
        style={styles.tabBar}
        value={state.routeNames[state.index]}
        buttons={tabBarItems}
        density="small"
        onValueChange={(value) => {
          topTabNavi.navigate(value);
        }}
        theme={{
          ...appTheme,
          colors: {
            ...appTheme.colors,
            secondaryContainer: 'transparent',
            onSurface: appTheme.colors.onSurfaceDisabled
          },
        }}
      />
    );
  }, [appTheme]);

  const renderStateIcon = useCallback(
    ({ color }: { color: string }) => (
      <Icon
        source="cellphone-information"
        color={color}
        size={20}
      />
    ), []);

  const renderStorageIcon = useCallback(
    ({ color }: { color: string }) => (
      <Icon
        source="database-cog-outline"
        color={color}
        size={20}
      />
    ), []);

  const renderPackageIcon = useCallback(
    ({ color }: { color: string }) => (
      <Icon
        source="package-variant"
        color={color}
        size={20}
      />
    ), []);

  return (
    <BlurBackground>
      <ActionBar routeIndex={routeIndex} />

      <TopTab.Navigator
        backBehavior="none"
        screenOptions={{ lazy: true }}
        tabBar={renderTapBar}
        screenListeners={() => ({
          state: ({ data }) => {
            setRouteIndex(data.state.index);
          }
        })}
      >
        <TopTab.Screen
          name="ReduxState"
          component={ReduxState}
          options={{
            title: 'State',
            tabBarIcon: renderStateIcon,
          }}
        />
        <TopTab.Screen
          name="LocalStorage"
          component={StorageList}
          options={{
            title: 'Storage',
            tabBarIcon: renderStorageIcon,
          }}
        />
        <TopTab.Screen
          name="PackageData"
          component={PackageData}
          options={{
            title: 'Package',
            tabBarIcon: renderPackageIcon,
          }}
        />
      </TopTab.Navigator>
    </BlurBackground>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    shadowColor: 'transparent',
    marginHorizontal: 16,
  },
  transparent: {
    backgroundColor: 'transparent',
  },
});
