import React from 'react';
import { View } from 'react-native';
import { Switch } from 'react-native-paper';

export const RightSwitch = ({
    value,
    disabled = false,
    ...props
}: {
    value: boolean,
    disabled?: boolean
}) => {
    return (
        <View pointerEvents="none" {...props}>
            <Switch value={value} disabled={disabled} />
        </View>
    );
};
