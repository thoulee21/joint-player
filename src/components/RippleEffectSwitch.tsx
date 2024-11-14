import React, { useCallback } from 'react';
import { Platform, View } from 'react-native';
import HapticFeedback, {
  HapticFeedbackTypes,
} from 'react-native-haptic-feedback';
import { List, Switch } from 'react-native-paper';
import { useAppDispatch, useAppSelector } from '../hook';
import { selectRippleEffect, toggleRippleEffect } from '../redux/slices';
import { ListLRProps } from '../types/paperListItem';

export const RippleEffectSwitch = () => {
  const dispatch = useAppDispatch();
  const rippleEffectEnabled = useAppSelector(selectRippleEffect);

  const renderRippleEffectIcon = useCallback(
    (props: ListLRProps) => (
      <List.Icon {...props} icon="waves" />
    ), []
  );

  const renderSwitch = useCallback(
    (props: ListLRProps) => (
      <View pointerEvents="none" {...props}>
        <Switch value={rippleEffectEnabled} />
      </View>
    ), [rippleEffectEnabled]);

  const toggle = useCallback(() => {
    HapticFeedback.trigger(HapticFeedbackTypes.effectClick);
    dispatch(toggleRippleEffect());
  }, [dispatch]);

  const effectName = Platform.select({
    ios: 'Highlight Effect',
    android: 'Ripple Effect',
    default: 'Ripple Effect',
  });

  return (
    <List.Item
      title={effectName}
      description={`Enable ${effectName.toLocaleLowerCase()} on touch`}
      left={renderRippleEffectIcon}
      right={renderSwitch}
      onPress={toggle}
    />
  );
};
