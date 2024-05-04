import AsyncStorage from '@react-native-async-storage/async-storage';
import Slider from '@react-native-community/slider';
import React, { useState } from 'react';
import { StyleSheet } from 'react-native';
import HapticFeedback from 'react-native-haptic-feedback';
import { List, Text, useTheme } from 'react-native-paper';
import { StorageKeys } from '../App';
import { useAppDispatch, useAppSelector } from '../hook';
import { blurRadius, setBlurRadius } from '../redux/slices';

export function BlurRadiusSlider() {
    const appTheme = useTheme();
    const dispatch = useAppDispatch();
    const blurRadiusValue = useAppSelector(blurRadius);
    const [showValue, setShowValue] = useState(blurRadiusValue);

    const step = 5;

    const vibrate = (value: number) => {
        if (value % step === 0) {
            HapticFeedback.trigger('effectHeavyClick');
            setShowValue(value);
        }
    };

    return (
        <List.Item
            title="Blur Radius"
            left={(props) =>
                <List.Icon {...props} icon="blur-linear" />
            }
            right={(props) => (
                <Text {...props}>{showValue}</Text>
            )}
            description={(props) => (
                <Slider
                    {...props}
                    style={styles.slider}
                    thumbTintColor={appTheme.colors.primary}
                    minimumTrackTintColor={appTheme.colors.primary}
                    maximumTrackTintColor={appTheme.colors.tertiary}
                    onSlidingComplete={async (value) => {
                        dispatch(setBlurRadius(value));
                        await AsyncStorage.setItem(
                            StorageKeys.BlurRadius, String(value)
                        );
                    }}
                    onValueChange={vibrate}
                    minimumValue={15}
                    maximumValue={100}
                    step={step}
                    value={showValue}
                />
            )}
        />
    );
}

const styles = StyleSheet.create({
    slider: {
        height: 20,
    },
});
