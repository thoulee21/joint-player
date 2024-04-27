import BottomSheet from '@gorhom/bottom-sheet';
import { useNavigation } from '@react-navigation/native';
import React, { RefObject } from 'react';
import { Alert, StyleSheet } from 'react-native';
import HapticFeedback, {
    HapticFeedbackTypes,
} from 'react-native-haptic-feedback';
import { Appbar } from 'react-native-paper';
import { useActiveTrack } from 'react-native-track-player';
import { useAppSelector } from '../hook/reduxHooks';
import { selectDevModeEnabled } from '../redux/slices';

export const BottomBar = ({ bottomSheetRef }:
    { bottomSheetRef: RefObject<BottomSheet> }
) => {
    const navigation = useNavigation();

    const track = useActiveTrack();
    const devModeEnabled = useAppSelector(selectDevModeEnabled);

    const showDetails = () => {
        if (track && devModeEnabled) {
            HapticFeedback.trigger(HapticFeedbackTypes.effectHeavyClick);
            console.info(JSON.stringify(track, null, 2));
            Alert.alert(
                track.title || 'Details',
                JSON.stringify(track, null, 2),
                [{ text: 'OK' }],
                { cancelable: true }
            );
        }
    };

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
                    // @ts-ignore
                    navigation.push('Settings');
                }}
            />
            <Appbar.Content
                title={track?.album || 'No Album'}
                titleStyle={styles.bottomTitle}
                onPress={showDetails}
            />
            <Appbar.Action
                icon="menu-open"
                onPress={() => {
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
