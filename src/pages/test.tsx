import { useNavigation } from '@react-navigation/native';
import React from 'react';
import { LottieAnimation } from '../components/LottieAnimation';

export default function Test() {
  const navigation = useNavigation();
  return (
    <LottieAnimation
      animation="sushi"
      caption="Test Page"
      onPress={() => {
        // @ts-expect-error
        navigation.push('ChangeLog');
      }}
    />
  );
}
