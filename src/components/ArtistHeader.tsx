import { useNavigation } from '@react-navigation/native';
import React from 'react';
import { Dimensions, StatusBar, StyleSheet, View } from 'react-native';
import HapticFeedback, { HapticFeedbackTypes } from 'react-native-haptic-feedback';
import { Card, Text, useTheme } from 'react-native-paper';
import { Artist } from '../types/albumArtist';

export const ArtistHeader = ({ artist }: { artist?: Artist }) => {
    const navigation = useNavigation();
    const appTheme = useTheme();

    return (
        <View style={styles.albumHeader}>
            <View style={styles.albumHeaderTitle}>
                <Text variant="headlineSmall">
                    {artist?.name}
                </Text>
                <Text style={[styles.artistAlias, {
                    color: appTheme.dark
                        ? appTheme.colors.onSurfaceDisabled
                        : appTheme.colors.backdrop
                }]}>
                    {artist?.alias.join(', ')}
                </Text>
            </View>
            <Card
                onLongPress={() => {
                    HapticFeedback.trigger(
                        HapticFeedbackTypes.effectDoubleClick
                    );
                    //@ts-ignore
                    navigation.push('WebView', {
                        url: artist?.picUrl,
                        title: artist?.name,
                    });
                }}
            >
                <Card.Cover
                    source={{ uri: artist?.picUrl }}
                />
            </Card>
        </View>
    );
};

const styles = StyleSheet.create({
    albumHeader: {
        marginHorizontal: '2%',
        marginBottom: '1%',
        marginTop: StatusBar.currentHeight,
        width: Dimensions.get('window').width - 20,
    },
    albumHeaderTitle: {
        flexDirection: 'row',
        alignItems: 'baseline',
        margin: '3%'
    },
    artistAlias: {
        marginLeft: '1%',
    },
});
