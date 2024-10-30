import Slider from '@react-native-community/slider';
import React, { useCallback, useEffect, useState } from 'react';
import { StyleSheet } from 'react-native';
import HapticFeedback from 'react-native-haptic-feedback';
import { List, Text, useTheme } from 'react-native-paper';
import { useAppDispatch, useAppSelector } from '../hook';
import { blurRadius, setBlurRadius } from '../redux/slices';
import type { ListLRProps } from '../types/paperListItem';

const SLIDER_STEP = 5;

export function BlurRadiusSlider() {
    const appTheme = useTheme();
    const dispatch = useAppDispatch();

    const blurRadiusValue = useAppSelector(blurRadius);
    const [showValue, setShowValue] = useState(blurRadiusValue);

    const updateBlurRadius = useCallback((value: number) => {
        dispatch(setBlurRadius(value));
        //no dispatch here
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const onValueChange = useCallback((value: number) => {
        if (value % SLIDER_STEP === 0) {
            setShowValue(value);
        }
    }, []);

    const renderIcon = useCallback((props: ListLRProps) => (
        <List.Icon {...props} icon="blur-linear" />
    ), []);

    const renderIndicator = useCallback(({ style }: ListLRProps) => (
        <Text style={[style, styles.indicator]}>
            {showValue}
        </Text>
    ), [showValue]);

    useEffect(() => {
        HapticFeedback.trigger('effectHeavyClick');
    }, [showValue]);

    const renderSlider = useCallback((props: any) => (
        <Slider
            {...props}
            style={styles.slider}
            thumbTintColor={appTheme.colors.primary}
            minimumTrackTintColor={appTheme.colors.secondary}
            maximumTrackTintColor={appTheme.colors.tertiary}
            onSlidingComplete={updateBlurRadius}
            onValueChange={onValueChange}
            minimumValue={0}
            maximumValue={100}
            lowerLimit={15}
            step={SLIDER_STEP}
            value={showValue}
        />
    ), [appTheme, showValue, onValueChange, updateBlurRadius]);

    return (
        <List.Item
            title="Blur Radius"
            titleStyle={styles.title}
            left={renderIcon}
            right={renderIndicator}
            description={renderSlider}
            contentStyle={styles.itemContainer}
        />
    );
}

const styles = StyleSheet.create({
    slider: {
        height: 20,
        marginTop: 10,
    },
    indicator: {
        marginLeft: 0,
        width: 25,
        textAlign: 'center',
    },
    itemContainer: {
        paddingLeft: 0,
    },
    title: {
        marginLeft: 16,
    },
});
