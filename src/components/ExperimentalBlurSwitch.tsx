import React from 'react';
import HapticFeedback, {
    HapticFeedbackTypes,
} from 'react-native-haptic-feedback';
import { List } from 'react-native-paper';
import { RightSwitch } from '.';
import { useAppDispatch, useAppSelector } from '../hook/reduxHooks';
import { selectBlurEnabled, toggleBlur } from '../redux/slices';

export function ExperimentalBlurSwitch() {
    const experimentalBlurEnabled = useAppSelector(selectBlurEnabled);
    const dispatch = useAppDispatch();

    const toggleExperimentalBlur = () => {
        HapticFeedback.trigger(HapticFeedbackTypes.effectTick);
        dispatch(toggleBlur());
    };

    return (
        <List.Item
            title="Experimental Blur"
            description="Enable experimental blur effect"
            left={(props) =>
                <List.Icon {...props} icon="blur" />
            }
            right={(props) =>
                <RightSwitch {...props}
                    value={experimentalBlurEnabled}
                />
            }
            onPress={toggleExperimentalBlur}
        />
    );
}
