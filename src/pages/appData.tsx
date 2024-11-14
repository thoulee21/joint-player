import {
  createMaterialTopTabNavigator,
  MaterialTopTabBarProps,
} from '@react-navigation/material-top-tabs';
import { useNavigation } from '@react-navigation/native';
import React, { useCallback, useMemo, useState } from 'react';
import { LayoutAnimation, StyleSheet } from 'react-native';
import { Appbar, Icon, SegmentedButtons, useTheme } from 'react-native-paper';
import packageJson from '../../package.json';
import { BlurBackground } from '../components/BlurBackground';
import { DataList } from '../components/DataList';
import { MMKVStorageIndicator } from '../components/StorageIndicator';
import { store } from '../redux/store';
import { storage } from '../utils/reduxPersistMMKV';

const TopTab = createMaterialTopTabNavigator();

const PackageData = () => {
  const packageData = useMemo(() => (
    Object.keys(packageJson).map((
      key
    ) => ({
      name: key,
      data: (packageJson as Record<string, any>)[key],
    }))
  ), []);

  return <DataList dataItems={packageData} />;
};

const ReduxState = () => {
  const state: { [key: string]: any } = store.getState();

  const stateList = useMemo(() => (
    Object.keys(state).map((
      key
    ) => ({
      name: key,
      data: state[key].value || state[key],
    }))
  ), [state]);

  return <DataList dataItems={stateList} />;
};

const StorageList = () => {
  const dataItems = useMemo(() => (
    storage.getAllKeys().map((
      localDataName
    ) => ({
      name: localDataName,
      data: JSON.parse(
        storage.getString(localDataName) || ''
      ),
    }))
  ), []);

  return <DataList dataItems={dataItems} />;
};

export function AppDataScreen() {
  const navigation = useNavigation();
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
        onValueChange={(value) => {
          topTabNavi.navigate(value);
        }}
        theme={{
          ...appTheme,
          colors: {
            ...appTheme.colors,
            secondaryContainer: 'transparent',
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
      <Appbar.Header style={styles.transparent}>
        <Appbar.BackAction onPress={navigation.goBack} />
        <Appbar.Content title="App Data" />

        {routeIndex === 1 && (
          <MMKVStorageIndicator />
        )}
      </Appbar.Header>

      <TopTab.Navigator
        backBehavior="none"
        tabBar={renderTapBar}
        screenListeners={() => ({
          state: ({ data }) => {
            LayoutAnimation.configureNext(
              LayoutAnimation.Presets.easeInEaseOut
            );
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
