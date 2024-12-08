import {
  FadingView,
  Header,
  LargeHeader,
  ScalingView,
  type ScrollHeaderProps,
  type ScrollLargeHeaderProps,
  type SurfaceComponentProps,
} from '@codeherence/react-native-header';
import { useNavigation } from '@react-navigation/native';
import React, { useCallback } from 'react';
import { StyleSheet, View } from 'react-native';
import { Appbar, Avatar, Text, useTheme } from 'react-native-paper';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import packageData from '../../package.json';
import { THEME_COLOR } from '../utils/constants';

export const AboutHeaderComponent = (
  { showNavBar }: ScrollHeaderProps
) => {
  const appTheme = useTheme();
  const navigation = useNavigation();
  const { top } = useSafeAreaInsets();

  const renderBackground = useCallback(({
    showNavBar: opacity
  }: SurfaceComponentProps) => (
    <FadingView
      opacity={opacity}
      style={[
        StyleSheet.absoluteFill, {
          backgroundColor: appTheme.dark
            ? appTheme.colors.surface : THEME_COLOR
        }
      ]}
    />
  ), [appTheme.colors.surface, appTheme.dark]);

  return (
    <Header
      showNavBar={showNavBar}
      noBottomBorder
      headerCenter={
        <Text
          variant="titleLarge"
          style={styles.white}
        >
          {packageData.displayName}
        </Text>
      }
      headerStyle={{
        height: 64 + top,
        backgroundColor: appTheme.dark
          ? appTheme.colors.surface : THEME_COLOR,
      }}
      headerCenterStyle={styles.headerTitle}
      headerLeftStyle={styles.smallHeaderLeft}
      headerLeft={
        <Appbar.BackAction
          onPress={navigation.goBack}
          iconColor="white"
        />
      }
      SurfaceComponent={renderBackground}
    />
  );
};

export const AboutLargeHeaderComponent = (
  { scrollY }: ScrollLargeHeaderProps
) => {
  const appTheme = useTheme();
  return (
    <LargeHeader headerStyle={[
      styles.largeHeader, {
        backgroundColor: appTheme.dark
          ? appTheme.colors.surface : THEME_COLOR
      }]}>
      <ScalingView scrollY={scrollY}>
        <View>
          <Avatar.Image
            size={80}
            style={styles.largeHeaderAvatar}
            source={
              require('../assets/images/logo.png')
            }
          />
          <Text
            variant="titleSmall"
            style={[styles.name, styles.white]}
          >
            {packageData.displayName}
          </Text>
        </View>
      </ScalingView>
    </LargeHeader>
  );
};

const styles = StyleSheet.create({
  largeHeader: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    alignContent: 'center',
    height: 150,
  },
  largeHeaderAvatar: {
    elevation: 10,
  },
  headerTitle: {
    textAlign: 'left',
    justifyContent: 'flex-start',
  },
  smallHeaderLeft: {
    width: 'auto',
    paddingRight: 0,
  },
  white: {
    color: 'white',
  },
  name: {
    marginTop: 10,
    fontWeight: 'bold',
  }
});
