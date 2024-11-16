import {
  Header,
  ScalingView,
  type HeaderProps,
  type ScrollHeaderProps,
  type ScrollLargeHeaderProps,
} from '@codeherence/react-native-header';
import { useNavigation } from '@react-navigation/native';
import Color from 'color';
import React from 'react';
import { StyleSheet } from 'react-native';
import { Appbar, IconButton, Text, useTheme } from 'react-native-paper';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export const HeaderComponent = ({
  showNavBar, title, ignoreTopSafeArea, ...rst
}: ScrollHeaderProps & { title: string } & HeaderProps
) => {
  const navigation = useNavigation();
  const { top } = useSafeAreaInsets();
  const appTheme = useTheme();

  return (
    <Header
      showNavBar={showNavBar}
      initialBorderColor="transparent"
      headerCenter={
        <Text
          variant="titleLarge"
          numberOfLines={1}
        >{title}</Text>
      }
      headerStyle={[styles.elevated, {
        height: 64 + (!ignoreTopSafeArea ? top : 0),
      }]}
      headerCenterStyle={styles.headerTitle}
      headerLeftStyle={styles.smallHeaderLeft}
      headerLeft={
        <IconButton
          icon="arrow-left"
          onPress={navigation.goBack}
          containerColor={Color(
            appTheme.colors.surface
          ).alpha(0.6).rgb().string()}
        />
      }
      ignoreTopSafeArea={ignoreTopSafeArea}
      {...rst}
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
