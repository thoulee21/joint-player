import React, { PropsWithChildren, createContext, memo, useContext } from 'react';
import { StyleSheet, View } from 'react-native';
import HapticFeedback, { HapticFeedbackTypes } from 'react-native-haptic-feedback';
import { IconButton, useTheme } from 'react-native-paper';
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

    return (
        <IconButton
            icon="delete"
            style={styles.button}
            iconColor={appTheme.colors.error}
            onPress={() => {
                dispatch(removeFav(index));
            }}
        />
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

export const QuickActionsWrapper = memo(({ children, index, item }:
    PropsWithChildren<QuickActionsProps>
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
