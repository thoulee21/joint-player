import { useRoute } from '@react-navigation/native';
import React from 'react';
import { StyleSheet } from 'react-native';
import { AlbumContent, BlurBackground } from '../components';
import { HotAlbum } from '../types/albumArtist';

export function AlbumDetail() {
    const { album } = (useRoute().params as { album: HotAlbum });
    return (
        <BlurBackground style={styles.container}>
            <AlbumContent album={album} />
        </BlurBackground>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignContent: 'center',
    },
});
