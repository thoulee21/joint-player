import Clipboard from "@react-native-clipboard/clipboard";
import React, { useCallback } from "react";
import { ToastAndroid } from "react-native";
import HapticFeedback, {
  HapticFeedbackTypes,
} from "react-native-haptic-feedback";
import { List, useTheme } from "react-native-paper";
import type { ListLRProps } from "../types/paperListItem";
import { useTranslation } from "react-i18next";

export function ThemeColorIndicator() {
  const { t } = useTranslation();
  const appTheme = useTheme();

  const renderIcon = useCallback(
    (props: ListLRProps) => <List.Icon {...props} icon="palette-outline" />,
    [],
  );

  const renderIndicator = useCallback(
    (props: ListLRProps) => (
      <List.Icon
        {...props}
        icon="square-rounded"
        color={appTheme.colors.primary}
      />
    ),
    [appTheme.colors.primary],
  );

  const copyColor = useCallback(() => {
    Clipboard.setString(appTheme.colors.primary);

    HapticFeedback.trigger(HapticFeedbackTypes.impactLight);
    ToastAndroid.show(
      t("settings.appearance.theme.toast.copied"),
      ToastAndroid.SHORT,
    );
  }, [appTheme.colors.primary, t]);

  return (
    <List.Item
      title={t("settings.appearance.theme.title")}
      description={appTheme.colors.primary}
      left={renderIcon}
      right={renderIndicator}
      onLongPress={copyColor}
    />
  );
}
