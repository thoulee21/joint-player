import React, { useCallback } from 'react';
import HapticFeedback, { HapticFeedbackTypes } from 'react-native-haptic-feedback';
import { List } from 'react-native-paper';
import { useAppDispatch, useAppSelector } from '../hook';
import { selectDevModeEnabled, toggleDevModeValue } from '../redux/slices';
import { RightSwitch } from './RightSwitch';

export const DevSwitchItem = () => {
    const dispatch = useAppDispatch();
    const isDev = useAppSelector(selectDevModeEnabled);

    const renderDevIcon = useCallback((props: any) => (
        <List.Icon {...props} icon="code-tags" />
    ), []);

    const renderSwitch = useCallback((props: any) => (
        <RightSwitch {...props} value={isDev} />
    ), [isDev]);

    return (
        <List.Item
            title="Developer Mode"
            description="Enable to access additional features"
            left={renderDevIcon}
            right={renderSwitch}
            onPress={() => {
                HapticFeedback.trigger(
                    HapticFeedbackTypes.effectClick
                );
                dispatch(toggleDevModeValue());
            }}
        />
    );
};
