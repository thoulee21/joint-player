import React, { memo, useCallback } from 'react';
import { StyleSheet, View } from 'react-native';
import HapticFeedback, {
    HapticFeedbackTypes
} from 'react-native-haptic-feedback';
import { IconButton, useTheme } from 'react-native-paper';
import { useAppDispatch } from '../hook';
import { addToQueueAsync, removeFav } from '../redux/slices';
import { TrackType } from '../services';

export const QuickActions = memo(({ index, item, isAlbum }: {
    index: number; item: TrackType; isAlbum?: boolean
}) => {
    const dispatch = useAppDispatch();
    const appTheme = useTheme();

    const addToQueue = useCallback(async () => {
        HapticFeedback.trigger(
            HapticFeedbackTypes.effectHeavyClick
        );
        dispatch(addToQueueAsync(item));

        // no dispatch here
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [item]);

    return (
        <View style={styles.container}>
            {isAlbum ? null : (
                <IconButton
                    icon="delete"
                    style={styles.button}
                    iconColor={appTheme.colors.error}
                    onPress={() => {
                        dispatch(removeFav(index));
                    }}
                />)}
            <IconButton
                icon="playlist-plus"
                style={styles.button}
                onPress={addToQueue}
            />
        </View>
    );
});

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'flex-end',
    },
    button: {
        alignItems: 'center',
        justifyContent: 'center',
        alignSelf: 'center',
    },
});
