import { useNavigation } from '@react-navigation/native';
import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Avatar, IconButton, List } from 'react-native-paper';
import { ArtistNames } from '.';
import { HotAlbum } from '../types/albumArtist';

export const HeaderCard = ({ album }: { album: HotAlbum }) => {
    const navigation = useNavigation();

    const goComments = () => {
        //@ts-ignore
        navigation.push('Comments', {
            commentThreadId: album.commentThreadId
        });
    };

    return (
        <View style={styles.card}>
            <List.Item
                left={(props) => (
                    <Avatar.Image {...props}
                        source={{ uri: album.picUrl }}
                        size={40}
                    />
                )}
                title={album.name}
                description={<ArtistNames />}
                right={(props) => (
                    <IconButton {...props}
                        icon="comment-text-outline"
                        onPress={goComments}
                    />
                )}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    card: {
        marginHorizontal: '2%'
    },
});
