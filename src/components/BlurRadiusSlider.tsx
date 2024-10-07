import Slider from '@react-native-community/slider';
import React, { useCallback, useState } from 'react';
import { StyleSheet } from 'react-native';
import HapticFeedback from 'react-native-haptic-feedback';
import { List, Text, useTheme } from 'react-native-paper';
import { useAppDispatch, useAppSelector } from '../hook';
import { blurRadius, setBlurRadius } from '../redux/slices';

export function BlurRadiusSlider() {
    const SLIDER_STEP = 5;

    const appTheme = useTheme();
    const dispatch = useAppDispatch();

    const blurRadiusValue = useAppSelector(blurRadius);
    const [showValue, setShowValue] = useState(blurRadiusValue);

    const vibrate = useCallback((value: number) => {
        if (value % SLIDER_STEP === 0) {
            HapticFeedback.trigger('effectHeavyClick');
            setShowValue(value);
        }
    }, []);

    const updateBlurRadius = useCallback((value: number) => {
        dispatch(setBlurRadius(value));
    }, [dispatch]);

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
                    onSlidingComplete={updateBlurRadius}
                    onValueChange={vibrate}
                    minimumValue={15}
                    maximumValue={100}
                    step={SLIDER_STEP}
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
