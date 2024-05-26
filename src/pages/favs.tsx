import { useNavigation } from '@react-navigation/native';
import React from 'react';
import { StyleSheet } from 'react-native';
import HapticFeedback, {
    HapticFeedbackTypes
} from 'react-native-haptic-feedback';
import { Appbar } from 'react-native-paper';
import { BlurBackground } from '../components';
import { FavsList } from '../components/FavsList';
import { useAppDispatch } from '../hook';
import { clearFavs } from '../redux/slices';

export function Favs() {
    const dispatch = useAppDispatch();
    const navigation = useNavigation();

    return (
        <BlurBackground>
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
        </BlurBackground>
    );
}

const styles = StyleSheet.create({
    appbar: {
        backgroundColor: 'transparent'
    },
    loading: {
        marginTop: '50%',
    }
});
