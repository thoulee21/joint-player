import { useRoute } from '@react-navigation/native';
import React, { Suspense } from 'react';
import { StyleSheet, View } from 'react-native';
import { ActivityIndicator } from 'react-native-paper';
import { Albums, BlurBackground } from '../components';
import { Artist as ArtistType } from '../types/albumArtist';

export function Artist() {
    const { artist } = (useRoute().params as { artist: ArtistType });

    return (
        <BlurBackground>
            <View style={styles.content}>
                <Suspense fallback={<ActivityIndicator size="large" />}>
                    <Albums artistID={artist.id} />
                </Suspense>
            </View>
        </BlurBackground>
    );
}

const styles = StyleSheet.create({
    content: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
});
