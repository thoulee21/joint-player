import { useNavigation, useTheme } from '@react-navigation/native';
import { View, TouchableWithoutFeedback, StyleSheet } from 'react-native';
import { Card, Avatar, IconButton } from 'react-native-paper';
import { HotAlbum } from '../types/albumArtist';
import React from 'react';
import HapticFeedback, {
    HapticFeedbackTypes
} from 'react-native-haptic-feedback';

export const HeaderCard = ({ album }: { album: HotAlbum }) => {
    const navigation = useNavigation();
    const appTheme = useTheme();

    const goComments = () => {
        //@ts-ignore
        navigation.push('Comments', {
            commentThreadId: album.commentThreadId
        });
    };

    return (
        <View style={styles.card}>
            <Card.Title
                left={(props) => (
                    <TouchableWithoutFeedback
                        onPress={() => {
                            HapticFeedback.trigger(
                                HapticFeedbackTypes.effectHeavyClick
                            );
                            navigation.goBack();
                        }}
                    >
                        <Avatar.Image {...props}
                            source={{ uri: album.picUrl }}
                        />
                    </TouchableWithoutFeedback>
                )}
                title={album.name}
                subtitle={album.artists.map((ar) => ar.name).join(', ')}
                subtitleStyle={{ color: appTheme.colors.primary }}
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
