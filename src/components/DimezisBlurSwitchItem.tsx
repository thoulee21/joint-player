import React, { useCallback } from 'react';
import { View } from 'react-native';
import HapticFeedback, {
  HapticFeedbackTypes,
} from 'react-native-haptic-feedback';
import { List, Switch } from 'react-native-paper';
import { useAppDispatch, useAppSelector } from '../hook';
import { selectDimezisBlur, toggleDimezisBlur } from '../redux/slices';
import { ListLRProps } from '../types/paperListItem';

export const DimezisBlurSwitchItem = () => {
  const dispatch = useAppDispatch();
  const dimezisBlur = useAppSelector(selectDimezisBlur);

  const renderBlurIcon = useCallback(
    (props: ListLRProps) => (
      <List.Icon {...props} icon="blur" />
    ), []
  );

  const renderSwitch = useCallback(
    (props: ListLRProps) => (
      <View pointerEvents="none" {...props}>
        <Switch value={dimezisBlur} />
      </View>
    ), [dimezisBlur]);

  const toggle = useCallback(() => {
    HapticFeedback.trigger(HapticFeedbackTypes.effectClick);
    dispatch(toggleDimezisBlur());
  }, [dispatch]);

  return (
    <List.Item
      title="Dimezis Blur"
      description="Experimental blur effect"
      left={renderBlurIcon}
      right={renderSwitch}
      onPress={toggle}
    />
  );
};
