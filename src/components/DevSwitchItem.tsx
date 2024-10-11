import React from 'react';
import HapticFeedback, { HapticFeedbackTypes } from 'react-native-haptic-feedback';
import { List } from 'react-native-paper';
import { useAppDispatch, useAppSelector } from '../hook';
import { selectDevModeEnabled, toggleDevModeValue } from '../redux/slices';
import { RightSwitch } from './RightSwitch';

export const DevSwitchItem = () => {
    const dispatch = useAppDispatch();
    const isDev = useAppSelector(selectDevModeEnabled);

    return <List.Item
        title="Developer Mode"
        description="切换开发者模式"
        left={(props) => List.Icon({ ...props, icon: 'code-tags' })}
        right={(props) => RightSwitch({ value: isDev, ...props })}
        onPress={() => {
            HapticFeedback.trigger(HapticFeedbackTypes.effectClick);
            dispatch(toggleDevModeValue());
        }}
    />;
};
