import Slider from '@react-native-community/slider';
import React, { useCallback, useState } from 'react';
import { StyleSheet } from 'react-native';
import HapticFeedback from 'react-native-haptic-feedback';
import { List, Text, useTheme } from 'react-native-paper';
import { useAppDispatch, useAppSelector } from '../hook';
import { blurRadius, setBlurRadius } from '../redux/slices';
import type { ListLRProps } from '../types/paperListItem';

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

    const renderIcon = useCallback((props: ListLRProps) => (
        <List.Icon {...props} icon="blur-linear" />
    ), []);

    const renderIndicator = useCallback((props: ListLRProps) => (
        <Text {...props}>{showValue}</Text>
    ), [showValue]);

    const renderSlider = useCallback((props: any) => (
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
    ), [appTheme, showValue, vibrate, updateBlurRadius]);

    return (
        <List.Item
            title="Blur Radius"
            left={renderIcon}
            right={renderIndicator}
            description={renderSlider}
        />
    );
}

const styles = StyleSheet.create({
    slider: {
        height: 20,
    },
});
