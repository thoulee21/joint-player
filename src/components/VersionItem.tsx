import React, { useCallback, useState } from 'react';
import { Platform } from 'react-native';
import HapticFeedback, { HapticFeedbackTypes } from 'react-native-haptic-feedback';
import { List } from 'react-native-paper';
import { version } from '../../package.json';
import { useAppDispatch, useAppSelector } from '../hook';
import { selectDevModeEnabled, setDevModeValue } from '../redux/slices';
import { ListLRProps } from '../types/paperListItem';
import { upperFirst } from '../utils';
import { PlatformIcon } from './PlatformIcon';

export const VersionItem = ({ showDevSnackbar }: {
    showDevSnackbar: () => void
}) => {
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
                showDevSnackbar();
            }
        }
        // no dispatch
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [devModeEnabled, hitCount]);

    const renderPlatformIcon = useCallback((props: ListLRProps) => (
        <PlatformIcon {...props} />
    ), []);

    return (
        <List.Item
            title="Version"
            description={versionText}
            left={renderPlatformIcon}
            onPress={handleDevMode}
        />
    );
};
