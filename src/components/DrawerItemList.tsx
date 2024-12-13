import {
  CommonActions,
  DrawerActions,
  DrawerNavigationState,
  ParamListBase,
} from '@react-navigation/native';
import Color from 'color';
import React, { useCallback } from 'react';
import {
  ScrollView,
  StyleSheet,
  useWindowDimensions,
  View,
} from 'react-native';
import { Drawer, useTheme } from 'react-native-paper';
import { ActionDrawerItems } from './ActionDrawerItems';
import { FavCount } from './DrawerRightItems';

type Props = {
  state: DrawerNavigationState<ParamListBase>;
  navigation: any;
  descriptors: any;
};

/**
 * Component that renders the navigation list in the drawer.
 */
export function DrawerItemList({
  state, navigation, descriptors
}: Props) {
  const appTheme = useTheme();
  const { height } = useWindowDimensions();

  const renderDrawerItem = useCallback(({
    item, index
  }: {
    item: any, index: number
  }) => {
    const focused = index === state.index;
    const onPress = () => {
      const event = navigation.emit({
        type: 'drawerItemPress',
        target: item.key,
        canPreventDefault: true,
      });

      if (!event.defaultPrevented) {
        navigation.dispatch({
          ...(focused
            ? DrawerActions.closeDrawer()
            : CommonActions.navigate({
              name: item.name,
              merge: true,
            })),
          target: state.key,
        });
      }
    };

    const {
      title, drawerIcon,
    } = descriptors[item.key].options;

    const backgroundColor = focused
      ? Color(appTheme.colors.secondaryContainer)
        .fade(appTheme.dark ? 0.4 : 0.6).string()
      : undefined;

    const icon = () => {
      if (typeof drawerIcon === 'function') {
        return drawerIcon({
          focused,
          color: focused
            ? appTheme.colors.primary
            : appTheme.colors.onSurface,
          size: 24,
        });
      }
      return drawerIcon;
    };

    const renderRight = () => {
      switch (item.name) {
        case 'Favorites':
          return <FavCount />;
        default:
          return null;
      }
    };

    return (
      <Drawer.Item
        key={item.key}
        label={title !== undefined
          ? title
          : item.name}
        icon={icon}
        onPress={onPress}
        active={focused}
        style={{ backgroundColor }}
        right={renderRight}
      />
    );
  }, [appTheme, descriptors, navigation, state]);

  return (
    <ScrollView
      style={styles.items}
      fadingEdgeLength={20}
    >
      <Drawer.Section>
        {state.routes.map((
          route: any, index: number
        ) => (
          renderDrawerItem({ item: route, index })
        ))}
      </Drawer.Section>

      <ActionDrawerItems
        navigation={navigation}
      />
      <View style={{ height: height * 0.1 }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  items: {
    marginTop: 60,
  }
});
