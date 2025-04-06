import {
  ScrollViewWithHeaders,
  type ScrollHeaderProps,
  type ScrollLargeHeaderProps,
} from "@codeherence/react-native-header";
import { useNavigation } from "@react-navigation/native";
import React, { useCallback, useState } from "react";
import { useTranslation } from "react-i18next";
import { useWindowDimensions, View } from "react-native";
import { List, Portal, Snackbar, useTheme } from "react-native-paper";
import RNRestart from "react-native-restart";
import { AboutItem } from "../components/AboutItem";
import {
  HeaderComponent,
  LargeHeaderComponent,
} from "../components/AnimatedHeader";
import { BlurRadiusSlider } from "../components/BlurRadiusSlider";
import { CacheItem } from "../components/CacheItem";
import { DevItem } from "../components/DevItem";
import { ExportDataItem } from "../components/ExportDataItem";
import { ImportDataItem } from "../components/ImportDataItem";
import { RippleEffectSwitch } from "../components/RippleEffectSwitch";
import { ThemeColorIndicator } from "../components/ThemeColorIndicator";
import type { ListLRProps } from "../types/paperListItem";

export function Settings() {
  const navigation = useNavigation();
  const window = useWindowDimensions();
  const { t } = useTranslation();
  const appTheme = useTheme();

  const [restartBarVisible, setRestartBarVisible] = useState(false);

  const renderHeader = useCallback(
    (props: ScrollHeaderProps) => (
      <HeaderComponent {...props} title={t("settings.title")} />
    ),
    [t],
  );

  const renderLargeHeader = useCallback(
    (props: ScrollLargeHeaderProps) => (
      <LargeHeaderComponent {...props} title={t("settings.title")} />
    ),
    [t],
  );

  const renderLanguageIcon = useCallback(
    (props: ListLRProps) => <List.Icon {...props} icon="translate" />,
    [],
  );

  const renderRightIcon = useCallback(
    (props: ListLRProps) => <List.Icon {...props} icon="chevron-right" />,
    [],
  );

  return (
    <ScrollViewWithHeaders
      HeaderComponent={renderHeader}
      LargeHeaderComponent={renderLargeHeader}
    >
      <List.Section
        title={t("settings.appearance.title")}
        titleStyle={{
          color: appTheme.colors.secondary,
        }}
      >
        <ThemeColorIndicator />
        <List.Item
          title={t("settings.appearance.languages.title")}
          description={t("settings.appearance.languages.description")}
          left={renderLanguageIcon}
          right={renderRightIcon}
          onPress={() => {
            navigation.navigate("Locales" as never);
          }}
        />
        <BlurRadiusSlider />
        <RippleEffectSwitch />
      </List.Section>

      <List.Section
        title={t("settings.data.title")}
        titleStyle={{ color: appTheme.colors.secondary }}
      >
        <ExportDataItem />
        <ImportDataItem setRestartBarVisible={setRestartBarVisible} />
        <CacheItem />
      </List.Section>

      <DevItem />
      <AboutItem />

      <View style={{ height: window.height * 0.35 }} />

      <Portal>
        <Snackbar
          visible={restartBarVisible}
          onDismiss={() => setRestartBarVisible(false)}
          onIconPress={() => setRestartBarVisible(false)}
          action={{
            label: t("settings.data.import.snackbar.label"),
            onPress: () => RNRestart.Restart(),
          }}
        >
          {t("settings.data.import.snackbar.caption")}
        </Snackbar>
      </Portal>
    </ScrollViewWithHeaders>
  );
}
