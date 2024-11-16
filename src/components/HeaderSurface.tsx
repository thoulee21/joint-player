import type {
  SurfaceComponentProps
} from '@codeherence/react-native-header';
import { BlurView } from 'expo-blur';
import React from 'react';
import { StyleSheet } from 'react-native';
import { useTheme } from 'react-native-paper';
import { useAppSelector } from '../hook';
import { blurRadius } from '../redux/slices';

export const HeaderSurface: React.FC<SurfaceComponentProps> = () => {
  const blurRadiusValue = useAppSelector(blurRadius);
  const appTheme = useTheme();

  return (
    <BlurView
      style={StyleSheet.absoluteFill}
      tint={appTheme.dark ? 'dark' : 'light'}
      intensity={blurRadiusValue}
    />
  );
};
