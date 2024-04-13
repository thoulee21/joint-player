import React, { useState } from "react";
import { StatusBar } from "react-native";
import { Appbar, Menu } from "react-native-paper";
import { MvButton } from "./MvButton";

export function TrackMenu() {
    const [visible, setVisible] = useState(false);

    const openMenu = () => setVisible(true);
    const closeMenu = () => setVisible(false);

    return (
        <Menu
            visible={visible}
            onDismiss={closeMenu}
            statusBarHeight={StatusBar.currentHeight}
            anchor={
                <Appbar.Action
                    icon="dots-vertical"
                    onPress={openMenu}
                />
            }
        >
            <MvButton />
        </Menu>
    );
}