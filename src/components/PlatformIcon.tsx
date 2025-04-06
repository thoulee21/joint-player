import React from "react";
import { Platform } from "react-native";
import { List, useTheme } from "react-native-paper";
import { useAppSelector } from "../hook/reduxHooks";
import { selectDevModeEnabled } from "../redux/slices/devMode";
import { ListLRProps } from "../types/paperListItem";

export const PlatformIcon = ({ color, style }: ListLRProps) => {
  const appTheme = useTheme();
  const devModeEnabled = useAppSelector(selectDevModeEnabled);

  return (
    <List.Icon
      style={style}
      color={devModeEnabled ? appTheme.colors.primary : color}
      icon={Platform.select({
        android: "android",
        ios: "apple-ios",
        macos: "desktop-mac",
        windows: "microsoft-windows",
        web: "web",
        native: "information",
        default: "information",
      })}
    />
  );
};
