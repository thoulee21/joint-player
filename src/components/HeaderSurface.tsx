import {
  FadingView,
  type SurfaceComponentProps
} from '@codeherence/react-native-header';
import { BlurView } from 'expo-blur';
import React from 'react';
import { StyleSheet } from 'react-native';
import { useTheme } from 'react-native-paper';
import { useAppSelector } from '../hook';
import { blurRadius, selectDimezisBlur } from '../redux/slices';

export const HeaderSurface: React.FC<SurfaceComponentProps> = (
  { showNavBar }
) => {
  const appTheme = useTheme();

  const blurRadiusValue = useAppSelector(blurRadius);
  const experimentalBlur = useAppSelector(selectDimezisBlur);

  return (
    <FadingView
      style={StyleSheet.absoluteFill}
      opacity={showNavBar}
    >
      <BlurView
        style={StyleSheet.absoluteFill}
        tint={appTheme.dark ? 'dark' : 'light'}
        intensity={blurRadiusValue}
        experimentalBlurMethod={
          experimentalBlur ? 'dimezisBlurView' : 'none'
        }
      />
    </FadingView>
  );
};
