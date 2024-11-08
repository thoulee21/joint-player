import { useNavigation } from '@react-navigation/native';
import React, { useCallback } from 'react';
import { List, Text, useTheme } from 'react-native-paper';
import { useAppSelector } from '../hook';
import { favs } from '../redux/slices';
import type { TrackType } from '../services/GetTracksService';
import type { ListLRProps } from '../types/paperListItem';

export const PlaylistCover = ({ tracks }: { tracks?: TrackType[] }) => {
    const navigation = useNavigation();
    const appTheme = useTheme();

    const favorites = useAppSelector(favs);
    tracks = tracks || favorites;

    const renderFavImage = useCallback(
        (props: ListLRProps) => (
            <List.Image
                {...props}
                variant="video"
                source={{ uri: tracks[0].artwork }}
                style={[props.style, {
                    borderRadius: appTheme.roundness
                }]}
            />
        ), [appTheme.roundness, tracks]);

    const renderCount = useCallback(
        (props: ListLRProps) => (
            <Text
                {...props}
                variant="titleLarge"
                style={{ color: appTheme.colors.outline }}
            >
                {tracks.length}
            </Text>
        ), [appTheme, tracks]);

    if (!tracks.length) { return null; }

    return (
        <List.Item
            title="Favorite"
            description={
                `${tracks[0].title}\n${tracks[0].album}`
            }
            descriptionNumberOfLines={2}
            onPress={() => {
                navigation.navigate('Favorites' as never);
            }}
            left={renderFavImage}
            right={renderCount}
        />
    );
};
