import { useNavigation } from '@react-navigation/native';
import React from 'react';
import { Dimensions, StyleSheet } from 'react-native';
import { Card, useTheme } from 'react-native-paper';
import { HotAlbum } from '../types/albumArtist';
import { toReadableDate } from '../utils';

export const Album = ({ item }: { item: HotAlbum }) => {
    const navigation = useNavigation();
    const appTheme = useTheme();
    const { width: windowWidth } = Dimensions.get('window');

    return (
        <Card
            style={styles.album}
            onPress={() => {
                //@ts-expect-error
                navigation.navigate('AlbumDetail', { album: item });
            }}
        >
            <Card.Cover
                style={[styles.albumPic, { width: windowWidth / 2 - 20 }]}
                source={{ uri: item.picUrl }}
            />
            <Card.Title
                title={item.name}
                subtitle={toReadableDate(item.publishTime)}
                subtitleStyle={{
                    color: appTheme.dark
                        ? appTheme.colors.onSurfaceDisabled
                        : appTheme.colors.backdrop,
                }}
            />
        </Card>
    );
};

const styles = StyleSheet.create({
    albumPic: {
        height: 200,
    },
    album: {
        margin: '2%',
    },
});
