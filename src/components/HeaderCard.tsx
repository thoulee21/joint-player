import { useNavigation } from '@react-navigation/native';
import React, { useCallback } from 'react';
import { StyleSheet, View } from 'react-native';
import { Avatar, IconButton, List } from 'react-native-paper';
import { HotAlbum } from '../types/albumArtist';
import type { ListLRProps } from '../types/paperListItem';
import { ArtistNames } from './ArtistNames';

export const AlbumHeaderCard = ({ album }: { album: HotAlbum }) => {
    const navigation = useNavigation();

    const goComments = useCallback(() => {
        //@ts-ignore
        navigation.push('Comments', {
            commentThreadId: album.commentThreadId
        });
    }, [album.commentThreadId, navigation]);

    const renderAlbumPic = useCallback((props: ListLRProps) => (
        <Avatar.Image {...props}
            source={{ uri: album.picUrl }}
            size={40}
        />
    ), [album.picUrl]);

    const renderCommentBtn = useCallback((props: ListLRProps) => (
        <IconButton {...props}
            icon="comment-text-outline"
            onPress={goComments}
        />
    ), [goComments]);

    return (
        <View style={styles.card}>
            <List.Item
                left={renderAlbumPic}
                title={album.name}
                description={<ArtistNames />}
                right={renderCommentBtn}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    card: {
        marginHorizontal: '2%'
    },
});
