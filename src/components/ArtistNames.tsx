import { useNavigation } from '@react-navigation/native';
import React, { useCallback } from 'react';
import { FlatList, StyleProp, TextStyle } from 'react-native';
import HapticFeedback, {
    HapticFeedbackTypes
} from 'react-native-haptic-feedback';
import { Text, useTheme } from 'react-native-paper';
import { useActiveTrack } from 'react-native-track-player';
import { Artist } from '../types/albumArtist';

export const ArtistNames = ({ textStyle }:
    { textStyle?: StyleProp<TextStyle> }
) => {
    const navigation = useNavigation();
    const appTheme = useTheme();
    const track = useActiveTrack();

    const themedGray = appTheme.dark
        ? appTheme.colors.onSurfaceDisabled
        : appTheme.colors.backdrop;

    const goArtist = (item: Artist) => {
        HapticFeedback.trigger(
            HapticFeedbackTypes.effectHeavyClick
        );
        //@ts-ignore
        navigation.push('Artist', {
            artist: item,
        });
    };

    const renderSeparator = useCallback(() => (
        <Text style={[textStyle, { color: themedGray }]}>/</Text>
    ), [textStyle, themedGray]);

    return (
        <FlatList
            data={track?.artists as Artist[]}
            horizontal
            keyExtractor={(item) => item.id.toString()}
            ItemSeparatorComponent={renderSeparator}
            renderItem={({ item }) => (
                <Text
                    style={[textStyle, {
                        color: appTheme.colors.primary
                    }]}
                    onPress={() => goArtist(item)}
                >{item.name}</Text>
            )}
        />
    );
};
