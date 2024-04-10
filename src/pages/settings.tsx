import Clipboard from "@react-native-clipboard/clipboard";
import React from "react";
import { Platform, ToastAndroid } from "react-native";
import { Appbar, Divider, List, useTheme } from "react-native-paper";
import { version as appVersion } from "../../package.json";
import { ScreenWrapper } from "../components";

function ThemeColorIndicator() {
    const appTheme = useTheme();
    return (
        <List.Item
            title="Theme Color"
            description={appTheme.colors.primary}
            left={(props) =>
                <List.Icon {...props} icon="palette" />
            }
            right={() => (
                <List.Icon
                    icon="square-rounded"
                    color={appTheme.colors.primary}
                    style={{ marginRight: 10 }}
                />
            )}
            onLongPress={() => {
                Clipboard.setString(appTheme.colors.primary);
                ToastAndroid.show("Color copied to clipboard", ToastAndroid.SHORT);
            }}
        />
    );
}

export function Settings({ navigation }: { navigation: any }) {
    return (
        <>
            <Appbar.Header elevated>
                <Appbar.Action
                    icon="menu"
                    onPress={() => {
                        navigation.openDrawer()
                    }}
                />
                <Appbar.Content title="Settings" />
            </Appbar.Header>
            <ScreenWrapper>
                <List.Section title="General">
                    <ThemeColorIndicator />
                    <Divider />
                    <List.Item
                        title="Version"
                        description={`${Platform.OS} v${appVersion}`}
                        left={(props) =>
                            <List.Icon {...props} icon="information-outline" />
                        }
                    />
                </List.Section>
            </ScreenWrapper>
        </>
    );
}