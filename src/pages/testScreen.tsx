import React from 'react';
import { Portal } from 'react-native-paper';
import { LottieAnimation } from '../components/LottieAnimation';
import { PlayControlsFAB } from '../components/PlayControlsFAB';

export default function Test() {
  return (
    <Portal.Host>
      <LottieAnimation
        animation="sushi"
        caption="Test Page"
      />

      <PlayControlsFAB />
    </Portal.Host>
  );
}
