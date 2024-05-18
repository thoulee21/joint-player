import { useRoute } from '@react-navigation/native';
import React, { Suspense } from 'react';
import { StyleSheet, View } from 'react-native';
import { ActivityIndicator } from 'react-native-paper';
import { AlbumContent, BlurBackground } from '../components';
import { HotAlbum } from '../types/albumArtist';

export function AlbumDetail() {
    const { album } = (useRoute().params as { album: HotAlbum });

    return (
        <BlurBackground>
            <View style={styles.container}>
                <Suspense fallback={
                    <ActivityIndicator size="large" style={styles.loading} />
                }>
                    <AlbumContent album={album} />
                </Suspense>
            </View>
        </BlurBackground>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignContent: 'center',
    },
    loading: {
        marginTop: '40%'
    },
});
