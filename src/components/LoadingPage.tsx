import React from 'react';
import { SafeAreaView, StyleSheet } from 'react-native';
import { ActivityIndicator } from 'react-native-paper';

export function LoadingPage() {
    return (
        <SafeAreaView style={styles.screenContainer}>
            <ActivityIndicator size="large" />
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    screenContainer: {
        display: 'flex',
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
});
