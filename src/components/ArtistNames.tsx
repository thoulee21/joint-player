import { useNavigation } from '@react-navigation/native';
import React from 'react';
import { FlatList, StyleSheet } from 'react-native';
import HapticFeedback, {
    HapticFeedbackTypes
} from 'react-native-haptic-feedback';
import { Text, useTheme } from 'react-native-paper';
import { useActiveTrack } from 'react-native-track-player';
import { Artist } from '../types/albumArtist';

export const ArtistNames = () => {
    const navigation = useNavigation();
    const appTheme = useTheme();
    const track = useActiveTrack();

    return (
        <FlatList
            data={track?.artists as Artist[]}
            horizontal
            keyExtractor={(item) => item.id.toString()}
            ItemSeparatorComponent={() => (
                <Text
                    style={[styles.artistText, {
                        color: appTheme.dark
                            ? appTheme.colors.onSurfaceDisabled
                            : appTheme.colors.backdrop
                    }]}
                >/</Text>
            )}
            renderItem={({ item }) => (
                <Text
                    style={[styles.artistText, {
                        color: appTheme.colors.primary
                    }]}
                    onPress={() => {
                        HapticFeedback.trigger(
                            HapticFeedbackTypes.effectHeavyClick
                        );
                        //@ts-ignore
                        navigation.push('Artist', {
                            artist: item,
                        });
                    }}
                >{item.name}</Text>
            )}
        />
    );
};

const styles = StyleSheet.create({
    artistText: {
        fontSize: 16,
        fontWeight: '200',
        textAlign: 'center',
    },
});
