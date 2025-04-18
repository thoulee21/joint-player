import {
  Header,
  ScalingView,
  type HeaderProps,
  type ScrollHeaderProps,
  type ScrollLargeHeaderProps,
} from "@codeherence/react-native-header";
import { useNavigation } from "@react-navigation/native";
import React, { useCallback } from "react";
import { StyleSheet, View } from "react-native";
import { Appbar, IconButton, Text, useTheme } from "react-native-paper";
import Animated, { useAnimatedStyle } from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export const HeaderComponent = ({
  showNavBar,
  title,
  ignoreTopSafeArea,
  headerLeft,
  scrollY,
  ...rst
}: ScrollHeaderProps & { title: string } & HeaderProps) => {
  const navigation = useNavigation();
  const { top } = useSafeAreaInsets();
  const appTheme = useTheme();

  const aniStyle = useAnimatedStyle(() => {
    return {
      opacity: scrollY.value,
    };
  });

  const renderSurface = useCallback(
    () => (
      <Animated.View
        style={[
          StyleSheet.absoluteFill,
          aniStyle,
          { backgroundColor: appTheme.colors.elevation.level2 },
        ]}
      />
    ),
    [aniStyle, appTheme.colors.elevation.level2],
  );

  return (
    <Header
      showNavBar={showNavBar}
      initialBorderColor="transparent"
      noBottomBorder
      borderColor={appTheme.colors.outlineVariant}
      headerCenter={
        <Text variant="titleLarge" numberOfLines={1}>
          {title}
        </Text>
      }
      headerStyle={[
        styles.elevated,
        {
          height: 64 + (!ignoreTopSafeArea ? top : 0),
        },
      ]}
      headerCenterStyle={styles.headerTitle}
      headerLeftStyle={styles.smallHeaderLeft}
      headerLeft={
        <View style={styles.row}>
          <IconButton icon="arrow-left" onPress={navigation.goBack} />
          {headerLeft}
        </View>
      }
      SurfaceComponent={renderSurface}
      headerRightStyle={styles.smallHeaderRight}
      ignoreTopSafeArea={ignoreTopSafeArea}
      {...rst}
    />
  );
};

export const LargeHeaderComponent = ({
  scrollY,
  title,
}: ScrollLargeHeaderProps & { title: string }) => {
  const appTheme = useTheme();
  return (
    <ScalingView scrollY={scrollY}>
      <Appbar.Header mode="medium" statusBarHeight={0}>
        <Appbar.Content
          title={title}
          titleStyle={{
            ...appTheme.fonts.headlineMedium,
          }}
        />
      </Appbar.Header>
    </ScalingView>
  );
};

const styles = StyleSheet.create({
  smallHeaderLeft: {
    width: "auto",
    paddingRight: 0,
  },
  smallHeaderRight: {
    width: "auto",
    paddingLeft: 0,
  },
  headerTitle: {
    textAlign: "left",
    justifyContent: "flex-start",
  },
  elevated: {
    elevation: 5,
  },
  row: {
    flexDirection: "row",
  },
});
