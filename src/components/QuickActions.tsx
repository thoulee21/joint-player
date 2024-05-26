import React, { PropsWithChildren, createContext, memo, useContext, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import HapticFeedback, { HapticFeedbackTypes } from 'react-native-haptic-feedback';
import { IconButton, Portal, Snackbar, useTheme } from 'react-native-paper';
import { useAppDispatch } from '../hook';
import { addToQueueAsync, removeFav } from '../redux/slices';
import { TrackType } from '../services';

export interface QuickActionsProps {
    index: number;
    item: TrackType;
}

export const QuickActionsContext = createContext({} as QuickActionsProps);

export const DeleteFavButton = () => {
    const dispatch = useAppDispatch();
    const appTheme = useTheme();

    const { index } = useContext(QuickActionsContext);
    const [confirmVisible, setConfirmVisible] = useState(false);

    const remove = () => {
        HapticFeedback.trigger(
            HapticFeedbackTypes.effectTick
        );
        dispatch(removeFav(index));
    };

    return (
        <>
            <IconButton
                icon="delete"
                style={styles.button}
                iconColor={appTheme.colors.error}
                onPress={() => {
                    HapticFeedback.trigger(
                        HapticFeedbackTypes.effectTick
                    );
                    setConfirmVisible(true);
                }}
            />

            <Portal>
                <Snackbar
                    visible={confirmVisible}
                    onDismiss={() => setConfirmVisible(false)}
                    action={{
                        label: 'OK',
                        onPress: remove,
                    }}
                    duration={Snackbar.DURATION_SHORT}
                >
                    Confirm delete?
                </Snackbar>
            </Portal>
        </>
    );
};

export const AddToQueueButton = () => {
    const dispatch = useAppDispatch();
    const { item } = useContext(QuickActionsContext);

    return (
        <IconButton
            icon="playlist-plus"
            style={styles.button}
            onPress={() => {
                HapticFeedback.trigger(
                    HapticFeedbackTypes.effectHeavyClick
                );
                dispatch(addToQueueAsync(item));
            }}
        />
    );
};

export const QuickActionsWrapper = memo(({
    children, index, item
}: PropsWithChildren<QuickActionsProps>
) => {
    return (
        <View style={styles.container}>
            <QuickActionsContext.Provider value={{ index, item }}>
                {children}
            </QuickActionsContext.Provider>
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
