import { DrawerContentScrollView } from "@react-navigation/drawer";
import React, { useState } from "react";
import { Drawer } from "react-native-paper";

export function DrawerItems({ navigation }: { navigation: any }) {
    const [drawerItemIndex, setDrawerItemIndex] = useState(0);

    return (
        <DrawerContentScrollView>
            <Drawer.Section title="Pages" >
                <Drawer.Item
                    label="Player"
                    icon="play-circle"
                    active={drawerItemIndex === 0}
                    onPress={() => {
                        navigation.navigate("Player");
                        setDrawerItemIndex(0);
                    }}
                />
                <Drawer.Item
                    label="Settings"
                    icon="cog"
                    active={drawerItemIndex === 1}
                    onPress={() => {
                        navigation.navigate("Settings");
                        setDrawerItemIndex(1);
                    }}
                />
            </Drawer.Section>
        </DrawerContentScrollView>
    );
}
