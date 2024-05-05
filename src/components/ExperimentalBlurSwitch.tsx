import React from 'react';
import { List, Switch, useTheme } from 'react-native-paper';
import { useAppDispatch, useAppSelector } from '../hook';
import { selectBlurEnabled, toggleBlur } from '../redux/slices';

export function ExperimentalBlurSwitch() {
    const dispatch = useAppDispatch();
    const appTheme = useTheme();
    const experimentalBlurEnabled = useAppSelector(selectBlurEnabled);

    const toggleExperimentalBlur = () => {
        dispatch(toggleBlur());
    };

    return (
        <List.Item
            title="Experimental Blur"
            description="dimezisBlurView for blur effect"
            left={(props) => <List.Icon {...props} icon="blur" />}
            right={(props) =>
                <Switch {...props}
                    color={appTheme.colors.primary}
                    onValueChange={toggleExperimentalBlur}
                    value={experimentalBlurEnabled}
                />
            }
        />
    );
}
