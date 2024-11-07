import { useNavigation } from '@react-navigation/native';
import type { TrackType } from '../services/GetTracksService';
import { List, useTheme, Text } from 'react-native-paper';
import { useCallback } from 'react';
import type { ListLRProps } from '../types/paperListItem';
import React from 'react';

export const PlaylistItem = ({ tracks }: { tracks: TrackType[] }) => {
    const navigation = useNavigation();
    const appTheme = useTheme();

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
