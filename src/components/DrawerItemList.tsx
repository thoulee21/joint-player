import {
    DrawerDescriptorMap,
    DrawerNavigationHelpers,
} from '@react-navigation/drawer/lib/typescript/src/types';
import {
    CommonActions,
    DrawerActions,
    DrawerNavigationState,
    ParamListBase,
} from '@react-navigation/native';
import Color from 'color';
import React, { useCallback } from 'react';
import { FlatList, StyleSheet } from 'react-native';
import { Drawer, useTheme } from 'react-native-paper';

type Props = {
    state: DrawerNavigationState<ParamListBase>;
    navigation: DrawerNavigationHelpers;
    descriptors: DrawerDescriptorMap;
};

/**
 * Component that renders the navigation list in the drawer.
 */
function DrawerItems({ state, navigation, descriptors }: Props) {
    const appTheme = useTheme();

    const renderDrawerItem = useCallback(({ item, index }: {
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

        const { title, drawerIcon } = descriptors[item.key].options;

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

        return (
            <Drawer.Item
                key={item.key}
                label={title !== undefined
                    ? title
                    : item.name}
                icon={icon}
                onPress={onPress}
                active={focused}
                style={[styles.drawerItem, {
                    backgroundColor,
                }]}
            />
        );
    }, [appTheme, descriptors, navigation, state]);

    return (
        <FlatList
            data={state.routes}
            renderItem={renderDrawerItem}
            keyExtractor={item => item.key}
            extraData={state.index}
        />
    );
}

export function DrawerItemList(props: Props) {
    return (
        <Drawer.Section {...props} showDivider={false}>
            <DrawerItems {...props} />
        </Drawer.Section>
    );
}

const styles = StyleSheet.create({
    drawerItem: {
        marginVertical: 2,
    },
});
