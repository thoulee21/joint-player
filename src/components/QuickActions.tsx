import React, {
    PropsWithChildren,
    createContext,
    useCallback,
    useContext,
    useState,
} from 'react';
import { StyleSheet, ToastAndroid, View } from 'react-native';
import HapticFeedback, {
    HapticFeedbackTypes,
} from 'react-native-haptic-feedback';
import {
    IconButton,
    Portal,
    Snackbar,
    useTheme,
} from 'react-native-paper';
import { useAppDispatch } from '../hook';
import { removeFav } from '../redux/slices/favs';
import { addToQueueAsync } from '../redux/slices/queue';
import { TrackType } from '../services/GetTracksService';

export interface QuickActionsProps {
    index: number;
    item: TrackType;
}

export const QuickActionsContext = createContext(
    {} as QuickActionsProps
);

export const DeleteFavButton = () => {
    const dispatch = useAppDispatch();
    const appTheme = useTheme();

    const { index } = useContext(QuickActionsContext);
    const [
        confirmVisible,
        setConfirmVisible,
    ] = useState(false);

    const hideSnackbar = useCallback(() => {
        setConfirmVisible(false);
    }, []);

    const remove = useCallback(() => {
        HapticFeedback.trigger(
            HapticFeedbackTypes.effectTick
        );
        dispatch(removeFav(index));
        //no dispatch needed here
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [index]);

    return (
        <>
            <IconButton
                icon="delete-outline"
                style={styles.button}
                size={34}
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
                    onDismiss={hideSnackbar}
                    onIconPress={hideSnackbar}
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
            size={34}
            onPress={async () => {
                HapticFeedback.trigger(
                    HapticFeedbackTypes.effectHeavyClick
                );
                const { payload } = await dispatch(
                    addToQueueAsync(item)
                );

                if (payload) {
                    ToastAndroid.showWithGravity(
                        'Added to queue',
                        ToastAndroid.SHORT,
                        ToastAndroid.TOP
                    );
                }
            }}
        />
    );
};

export const QuickActionsWrapper = ({
    children, index, item,
}: PropsWithChildren<QuickActionsProps>
) => {
    return (
        <View style={styles.container}>
            <QuickActionsContext.Provider
                value={{ index, item }}
            >
                {children}
            </QuickActionsContext.Provider>
        </View>
    );
};

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
