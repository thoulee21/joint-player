import AsyncStorage from '@react-native-async-storage/async-storage';
import Slider from '@react-native-community/slider';
import React, { useContext } from 'react';
import { StyleSheet, View } from 'react-native';
import { List, useTheme } from 'react-native-paper';
import { PreferencesContext, StorageKeys } from '../App';

export function BlurRadiusSlider() {
    const appTheme = useTheme();
    const preferences = useContext(PreferencesContext);

    return (
        <View>
            <List.Subheader>
                Lyric Background Blur Radius: {preferences?.blurRadius}
            </List.Subheader>

            <Slider
                style={styles.slider}
                thumbTintColor={appTheme.colors.primary}
                minimumTrackTintColor={appTheme.colors.primary}
                maximumTrackTintColor={appTheme.colors.tertiary}
                onSlidingComplete={async (value) => {
                    preferences?.setBlurRadius(value);
                    await AsyncStorage.setItem(StorageKeys.BlurRadius, String(value));
                }}
                minimumValue={0}
                maximumValue={100}
                step={1}
                value={preferences?.blurRadius}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    slider: {
        height: 30,
        marginVertical: "2%",
    },
});