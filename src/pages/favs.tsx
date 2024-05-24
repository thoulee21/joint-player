import { useNavigation } from '@react-navigation/native';
import React, { Suspense } from 'react';
import { SafeAreaView, StyleSheet } from 'react-native';
import { ActivityIndicator, Appbar } from 'react-native-paper';
import { UserHeader } from '../components';
import { FavsList } from '../components/FavsList';
import { useAppDispatch } from '../hook';
import { clearFavs } from '../redux/slices';

export function Favs() {
    const userId = 1492028517;
    const dispatch = useAppDispatch();
    const navigation = useNavigation();

    return (
        <SafeAreaView style={styles.container}>
            <Suspense
                fallback={
                    <ActivityIndicator
                        size="large"
                        style={styles.loading}
                    />
                }
            >
                <Appbar.Header>
                    <Appbar.Action
                        icon="menu"
                        // @ts-expect-error
                        onPress={() => navigation.openDrawer()}
                    />
                    <Appbar.Content title="Favorites" />
                    <Appbar.Action
                        icon="delete-forever-outline"
                        onPress={() => {
                            dispatch(clearFavs());
                        }}
                    />
                </Appbar.Header>

                <UserHeader userId={userId} />
                <FavsList />
            </Suspense>
        </SafeAreaView>
    );
}

export const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
    },
    loading: {
        marginTop: '50%',
    }
});
