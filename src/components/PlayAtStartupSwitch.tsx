import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { useContext } from 'react';
import HapticFeedback from "react-native-haptic-feedback";
import { List } from 'react-native-paper';
import { RightSwitch } from '.';
import { PreferencesContext, StorageKeys } from '../App';

export function PlayAtStartupSwitch() {
    const prefs = useContext(PreferencesContext);

    const togglePlayAtStartup = () => {
        HapticFeedback.trigger('effectClick');
        const newValue = !prefs?.playAtStartup;

        prefs?.setPlayAtStartup(newValue);
        AsyncStorage.setItem(StorageKeys.PlayAtStartup, String(newValue));
    };

    return (
        <List.Item
            title="Play At Startup"
            description="Automatically start playing"
            left={(props) =>
                <List.Icon {...props}
                    icon="play-outline"
                />
            }
            right={(props) =>
                <RightSwitch {...props}
                    value={prefs?.playAtStartup || false}
                />
            }
            onPress={togglePlayAtStartup}
        />
    );
}