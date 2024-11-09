import { useNavigation } from '@react-navigation/native';
import React, { useCallback } from 'react';
import { List, Text, useTheme } from 'react-native-paper';
import { useAppSelector } from '../hook';
import { favs } from '../redux/slices';
import type { ListLRProps } from '../types/paperListItem';

export const PlaylistCover = ({
    artwork, length, description, name, onPress
}: {
    artwork?: string;
    length?: number;
    description?: string;
    name?: string;
    onPress?: () => void;
}) => {
    const navigation = useNavigation();
    const appTheme = useTheme();
    const favorites = useAppSelector(favs);

    artwork = artwork || favorites[0]?.artwork;
    length = length || favorites.length;
    description = description || 'Your favorite tracks';
    name = name || 'Favorites';
    onPress = onPress || (() => {
        navigation.navigate(
            'Favorites' as never
        );
    });

    const renderFavImage = useCallback(
        (props: ListLRProps) => (
            <List.Image
                {...props}
                variant="video"
                source={{ uri: artwork }}
                style={[props.style, {
                    borderRadius: appTheme.roundness
                }]}
            />
        ), [appTheme.roundness, artwork]);

    const renderCount = useCallback(
        (props: ListLRProps) => (
            <Text
                {...props}
                variant="titleLarge"
                style={{ color: appTheme.colors.outline }}
            >
                {length}
            </Text>
        ), [appTheme.colors.outline, length]);

    if (!length) { return null; }

    return (
        <List.Item
            title={name || 'Favorites'}
            description={
                description
            }
            descriptionNumberOfLines={2}
            onPress={onPress || (() => {
                navigation.navigate(
                    'Favorites' as never
                );
            })}
            left={renderFavImage}
            right={renderCount}
        />
    );
};
