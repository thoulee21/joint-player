import React, { useCallback, useState } from 'react';
import { Platform, ToastAndroid } from 'react-native';
import HapticFeedback, { HapticFeedbackTypes } from 'react-native-haptic-feedback';
import { List, useTheme } from 'react-native-paper';
import { Style } from 'react-native-paper/lib/typescript/components/List/utils';
import { version } from '../../package.json';
import { useAppDispatch, useAppSelector } from '../hook';
import { selectDevModeEnabled, setDevModeValue } from '../redux/slices';
import { upperFirst } from '../utils';

export interface ListLeftProps {
    color: string;
    style: Style;
}

const VersionIcon = ({ color, style }: ListLeftProps) => {
    const appTheme = useTheme();
    const devModeEnabled = useAppSelector(selectDevModeEnabled);

    return (
        <List.Icon
            style={style}
            color={devModeEnabled
                ? appTheme.colors.primary
                : color}
            icon={Platform.select({
                android: 'android',
                ios: 'apple-ios',
                macos: 'desktop-mac',
                windows: 'microsoft-windows',
                web: 'web',
                native: 'information',
                default: 'information',
            })}
        />
    );
};

export const VersionItem = () => {
    const dispatch = useAppDispatch();
    const devModeEnabled = useAppSelector(selectDevModeEnabled);
    const [hitCount, setHitCount] = useState(0);

    const versionText = `${upperFirst(Platform.OS)} v${version}`;

    // 点击5次后开启开发者模式
    const handleDevMode = useCallback(() => {
        if (!devModeEnabled) {
            setHitCount(hitCount + 1);
            if (hitCount >= 5) {
                dispatch(setDevModeValue(true));
                HapticFeedback.trigger(HapticFeedbackTypes.effectClick);
                ToastAndroid.show('Developer mode enabled', ToastAndroid.SHORT);
            }
        }
        // no dispatch
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [devModeEnabled, hitCount]);

    return (
        <List.Item
            title="Version"
            description={versionText}
            left={(props) => <VersionIcon {...props} />}
            onPress={handleDevMode}
        />
    );
};
