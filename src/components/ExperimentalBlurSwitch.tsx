import React, { useContext } from 'react';
import HapticFeedback from 'react-native-haptic-feedback';
import { List } from 'react-native-paper';
import { RightSwitch } from '.';
import { PreferencesContext } from '../App';

export function ExperimentalBlurSwitch() {
    const prefs = useContext(PreferencesContext);

    const togglePlayAtStartup = () => {
        HapticFeedback.trigger('effectClick');
        const newValue = !prefs?.experimentalBlur;

        prefs?.setExperimentalBlur(newValue);
    };

    return (
        <List.Item
            title="Experimental Blur"
            description="Enable experimental blur effect"
            left={(props) =>
                <List.Icon {...props}
                    icon="blur-linear"
                />
            }
            right={(props) =>
                <RightSwitch {...props}
                    value={prefs?.experimentalBlur ?? false}
                />
            }
            onPress={togglePlayAtStartup}
        />
    );
}
