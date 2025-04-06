import {
  ScrollViewWithHeaders,
  type ScrollHeaderProps,
  type ScrollLargeHeaderProps,
} from "@codeherence/react-native-header";
import { useNavigation } from "@react-navigation/native";
import type { LocalAuthenticationResult } from "expo-local-authentication";
import * as LocalAuthentication from "expo-local-authentication";
import React, { useCallback, useLayoutEffect, useState } from "react";
import { Divider, List, useTheme } from "react-native-paper";
import { AniGalleryItem } from "../components/AniGalleryItem";
import {
  HeaderComponent,
  LargeHeaderComponent,
} from "../components/AnimatedHeader";
import { ClearAllDataItem } from "../components/ClearAllDataItem";
import { DevSwitchItem } from "../components/DevSwitchItem";
import { LottieAnimation } from "../components/LottieAnimation";
import { RestartItem } from "../components/RestartItem";
import { ViewAppDataItem } from "../components/ViewAppDataItem";
import type { ListLRProps } from "../types/paperListItem";
import { rootLog } from "../utils/logger";

export function DevScreen() {
  const navigation = useNavigation();
  const appTheme = useTheme();

  const [isLoaded, setIsLoaded] = useState(false);
  const [authResult, setAuthResult] = useState<LocalAuthenticationResult>();

  useLayoutEffect(() => {
    const init = async () => {
      navigation.setOptions({
        headerShown: true,
        headerTitle: "Developer Options",
        headerStyle: {
          backgroundColor: appTheme.colors.background,
        },
      });

      const enrolled = await LocalAuthentication.isEnrolledAsync();
      rootLog.info("enrolled", enrolled);

      const result = await LocalAuthentication.authenticateAsync();
      rootLog.info("result", result);
      setAuthResult(result);

      if (result.success) {
        rootLog.info("Authenticated!");
      } else {
        rootLog.warn("Not authenticated!");
        navigation.goBack();
      }
    };

    if (!isLoaded) {
      init().then(() => {
        setIsLoaded(true);
        navigation.setOptions({ headerShown: false });
      });
    }
  }, [appTheme.colors.background, isLoaded, navigation]);

  const renderRightIcon = useCallback(
    (props: ListLRProps) => <List.Icon {...props} icon="chevron-right" />,
    [],
  );

  const renderLargeHeader = useCallback(
    (props: ScrollLargeHeaderProps) => (
      <LargeHeaderComponent {...props} title="Developer Options" />
    ),
    [],
  );

  const renderHeader = useCallback(
    (props: ScrollHeaderProps) => (
      <HeaderComponent {...props} title="Developer Options" />
    ),
    [],
  );

  const renderLogcatIcon = useCallback(
    (props: ListLRProps) => <List.Icon icon="folder-eye-outline" {...props} />,
    [],
  );

  if (!authResult || !authResult.success) {
    return <LottieAnimation animation="rocket" />;
  }

  return (
    <ScrollViewWithHeaders
      LargeHeaderComponent={renderLargeHeader}
      HeaderComponent={renderHeader}
      overScrollMode="never"
      scrollToOverflowEnabled={false}
    >
      <DevSwitchItem />
      <Divider />

      <List.Section
        title="Developer's View"
        titleStyle={{ color: appTheme.colors.secondary }}
      >
        <ViewAppDataItem />
        <AniGalleryItem />
        <List.Item
          title="Logcat"
          description="View logs"
          left={renderLogcatIcon}
          right={renderRightIcon}
          onPress={() => {
            //@ts-expect-error
            navigation.push("Logcat" as never);
          }}
        />
      </List.Section>

      <RestartItem />
      <ClearAllDataItem />
    </ScrollViewWithHeaders>
  );
}
