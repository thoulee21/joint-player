import { DrawerContentScrollView } from "@react-navigation/drawer";
import React, { useState } from "react";
import { StyleSheet } from "react-native";
import { Badge, Drawer } from "react-native-paper";

function RightDot({ color, active }:
    { color: string, active: boolean }
) {
    if (active) {
        return <Badge size={8}
            style={[
                styles.badge,
                { backgroundColor: color }
            ]}
        />
    }
}

export function DrawerItems({ navigation }: { navigation: any }) {
    const [drawerItemIndex, setDrawerItemIndex] = useState(0);

    return (
        <DrawerContentScrollView>
            <Drawer.Section title="Pages" >
                <Drawer.Item
                    label="Home"
                    icon="home"
                    active={drawerItemIndex === 0}
                    onPress={() => {
                        navigation.navigate("Home");
                        setDrawerItemIndex(0);
                    }}
                    right={({ color }) =>
                        RightDot({ color, active: drawerItemIndex === 0 })
                    }
                />
                <Drawer.Item
                    label="Settings"
                    icon="cog"
                    active={drawerItemIndex === 1}
                    onPress={() => {
                        navigation.navigate("Settings");
                        setDrawerItemIndex(1);
                    }}
                    right={({ color }) =>
                        RightDot({ color, active: drawerItemIndex === 1 })
                    }
                />
            </Drawer.Section>
        </DrawerContentScrollView>
    );
}

const styles = StyleSheet.create({
    badge: {
        alignSelf: 'center',
    },
});
