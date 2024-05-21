import React, { Suspense, useEffect } from 'react';
import { StatusBar, StyleSheet } from 'react-native';
import { ActivityIndicator, useTheme } from 'react-native-paper';
import { BlurBackground, UserHeader } from '../components';
import { FavsList } from '../components/FavsList';

export function Favs() {
    const userId = 1492028517;
    const appTheme = useTheme();

    useEffect(() => {
        return () => {
            StatusBar.setBarStyle(
                appTheme.dark ? 'light-content' : 'dark-content'
            );
        };
    }, [appTheme.dark]);

    return (
        <BlurBackground>
            <Suspense fallback={
                <ActivityIndicator
                    size="large"
                    style={styles.loading}
                />
            }>
                <UserHeader userId={userId} />
                <FavsList />
            </Suspense>
        </BlurBackground>
    );
}

export const styles = StyleSheet.create({
    loading: {
        marginTop: '50%',
    }
});
