import React from 'react';
import { StyleSheet, useWindowDimensions } from 'react-native';
import { Text, useTheme } from 'react-native-paper';
import { LottieAnimation } from './LottieAnimation';

export const PoweredBy = () => {
  const window = useWindowDimensions();
  const appTheme = useTheme();

  return (
    <LottieAnimation
      animation="rocket"
      style={[styles.footer, {
        height: window.height * 0.35,
      }]}
    >
      <Text
        variant="labelSmall"
        style={[styles.footerTxt, {
          color: appTheme.colors.outline
        }]}
      >
        Powered by Netease Cloud Music API
      </Text>
    </LottieAnimation>
  );
};

const styles = StyleSheet.create({
  footer: {
    justifyContent: 'flex-end',
  },
  footerTxt: {
    textAlign: 'center',
  }
});
