import { useNavigation } from "@react-navigation/native";
import React, { useCallback } from "react";
import { useTranslation } from "react-i18next";
import { List } from "react-native-paper";
import { useAppSelector } from "../hook";
import { selectDevModeEnabled } from "../redux/slices";
import type { ListLRProps } from "../types/paperListItem";

export const DevItem = () => {
  const { t } = useTranslation();
  const navigation = useNavigation();
  const isDev = useAppSelector(selectDevModeEnabled);

  const CodeTags = useCallback(
    (props: ListLRProps) => <List.Icon {...props} icon="code-tags" />,
    [],
  );

  const ChevronRight = useCallback(
    (props: ListLRProps) => <List.Icon {...props} icon="chevron-right" />,
    [],
  );

  if (isDev) {
    return (
      <List.Item
        title={t("settings.dev.title")}
        description={t("settings.dev.description")}
        left={CodeTags}
        right={ChevronRight}
        onPress={() => {
          navigation.navigate("Dev" as never);
        }}
      />
    );
  }
};
