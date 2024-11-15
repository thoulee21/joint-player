import {
  Header,
  ScalingView,
  type ScrollHeaderProps,
  type ScrollLargeHeaderProps,
} from '@codeherence/react-native-header';
import { useNavigation } from '@react-navigation/native';
import React from 'react';
import { StyleSheet } from 'react-native';
import { Appbar, Text, useTheme } from 'react-native-paper';
import { interpolateColor } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export const HeaderComponent = ({
  showNavBar, title
}: ScrollHeaderProps & { title: string }
) => {
  const navigation = useNavigation();
  const { top } = useSafeAreaInsets();
  const appTheme = useTheme();

  return (
    <Header
      showNavBar={showNavBar}
      noBottomBorder
      headerCenter={
        <Text
          variant="titleLarge"
          numberOfLines={1}
        >{title}</Text>
      }
      headerStyle={[styles.elevated, {
        height: 64 + top,
        backgroundColor: interpolateColor(
          showNavBar.value,
          [0, 1],
          [
            appTheme.colors.surface,
            appTheme.colors.primary
          ]
        )
      }]}
      headerCenterStyle={styles.headerTitle}
      headerLeftStyle={styles.smallHeaderLeft}
      headerLeft={
        <Appbar.BackAction
          onPress={navigation.goBack}
        />
      }
    />
  );
};

export const LargeHeaderComponent = ({
  scrollY, title
}: ScrollLargeHeaderProps & { title: string }
) => {
  const appTheme = useTheme();
  return (
    <ScalingView scrollY={scrollY}>
      <Appbar.Header
        mode="medium"
        statusBarHeight={0}
      >
        <Appbar.Content
          title={title}
          titleStyle={{
            ...appTheme.fonts.headlineMedium
          }}
        />
      </Appbar.Header>
    </ScalingView>
  );
};

const styles = StyleSheet.create({
  smallHeaderLeft: {
    width: 'auto',
    paddingRight: 0,
  },
  headerTitle: {
    textAlign: 'left',
    justifyContent: 'flex-start',
  },
  elevated: {
    elevation: 5,
  }
});
