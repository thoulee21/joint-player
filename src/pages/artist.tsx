import { useRoute } from '@react-navigation/native';
import React from 'react';
import { StyleSheet } from 'react-native';
import { Albums, BlurBackground } from '../components';
import { Artist as ArtistType } from '../types/albumArtist';

export function Artist() {
    const { artist } = (useRoute().params as { artist: ArtistType });

    return (
        <BlurBackground style={styles.content}>
            <Albums artistID={artist.id} />
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
