import { useNavigation } from '@react-navigation/native';
import React, { Suspense } from 'react';
import { StyleSheet } from 'react-native';
import HapticFeedback, {
    HapticFeedbackTypes
} from 'react-native-haptic-feedback';
import { ActivityIndicator, Appbar } from 'react-native-paper';
import { BlurBackground } from '../components';
import { FavsList } from '../components/FavsList';
import { useAppDispatch } from '../hook';
import { clearFavs } from '../redux/slices';

export function Favs() {
    const dispatch = useAppDispatch();
    const navigation = useNavigation();

    return (
        <BlurBackground>
            <Suspense
                fallback={
                    <ActivityIndicator
                        size="large"
                        style={styles.loading}
                    />
                }
            >
                <Appbar.Header style={styles.appbar}>
                    <Appbar.Action
                        icon="menu"
                        onPress={() => {
                            HapticFeedback.trigger(
                                HapticFeedbackTypes.effectHeavyClick
                            );
                            // @ts-expect-error
                            navigation.openDrawer();
                        }}
                    />
                    <Appbar.Content title="Favorites" />
                    <Appbar.Action
                        icon="delete-forever-outline"
                        onPress={() => { dispatch(clearFavs()); }}
                    />
                </Appbar.Header>

                <FavsList />
            </Suspense>
        </BlurBackground>
    );
}

export const styles = StyleSheet.create({
    appbar: {
        backgroundColor: 'transparent'
    },
    loading: {
        marginTop: '50%',
    }
});
