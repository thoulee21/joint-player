import { useNavigation } from '@react-navigation/native';
import React from 'react';
import { StyleSheet } from 'react-native';
import HapticFeedback, {
    HapticFeedbackTypes,
} from 'react-native-haptic-feedback';
import { Appbar } from 'react-native-paper';
import { useActiveTrack } from 'react-native-track-player';
import { usePlayerContext } from '../pages';

export const BottomBar = () => {
    const navigation = useNavigation();
    const { bottomSheetRef } = usePlayerContext();
    const track = useActiveTrack();

    return (
        <Appbar.Header
            style={styles.bottom}
            mode="center-aligned"
            elevated
            statusBarHeight={0}
        >
            <Appbar.Action
                icon="cog-outline"
                onPress={() => {
                    HapticFeedback.trigger(
                        HapticFeedbackTypes.effectHeavyClick
                    );
                    // @ts-ignore
                    navigation.push('Settings');
                }}
            />
            <Appbar.Content
                title={track?.album || 'No Album'}
                titleStyle={styles.bottomTitle}
            />
            <Appbar.Action
                icon="menu-open"
                onPress={() => {
                    HapticFeedback.trigger(
                        HapticFeedbackTypes.effectHeavyClick
                    );
                    bottomSheetRef.current?.expand();
                }}
            />
        </Appbar.Header>);
};

const styles = StyleSheet.create({
    bottom: {
        backgroundColor: 'transparent',
    },
    bottomTitle: {
        fontSize: 16,
    },
});
