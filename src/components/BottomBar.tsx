import BottomSheet from '@gorhom/bottom-sheet';
import { useNavigation } from '@react-navigation/native';
import React, { RefObject } from 'react';
import { StyleSheet } from 'react-native';
import HapticFeedback, {
    HapticFeedbackTypes,
} from 'react-native-haptic-feedback';
import { Appbar } from 'react-native-paper';
import { useActiveTrack } from 'react-native-track-player';

export const BottomBar = ({ bottomSheetRef }:
    { bottomSheetRef: RefObject<BottomSheet> }
) => {
    const navigation = useNavigation();
    const track = useActiveTrack();

    return (
        <Appbar.Header
            style={styles.bottom}
            mode="center-aligned"
            elevated
            statusBarHeight={0}
        >
            <Appbar.Action
                icon="video-outline"
                disabled={track?.mvid === 0
                    || typeof track?.mvid === 'undefined'}
                onPress={() => {
                    HapticFeedback.trigger(
                        HapticFeedbackTypes.effectHeavyClick
                    );
                    // @ts-ignore
                    navigation.push('MvDetail');
                }}
            />
            <Appbar.Content
                title={track?.album || 'No Album'}
                titleStyle={styles.bottomTitle}
                onPress={() => {
                    HapticFeedback.trigger(
                        HapticFeedbackTypes.effectHeavyClick
                    );
                    //@ts-ignore
                    navigation.push('AlbumDetail', {
                        album: track?.albumRaw,
                    });
                }}
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
