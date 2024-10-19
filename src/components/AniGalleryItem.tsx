import { useNavigation } from '@react-navigation/native';
import { useCallback } from 'react';
import { List } from 'react-native-paper';
import type { ListLRProps } from '../types/paperListItem';
import React from 'react';
export const AniGalleryItem = () => {
    const navigation = useNavigation();

    const renderAniIcon = useCallback((props: ListLRProps) => (
        <List.Icon {...props} icon="animation-outline" />
    ), []);

    const renderRightIcon = useCallback((props: ListLRProps) => (
        <List.Icon {...props} icon="chevron-right" />
    ), []);

    return (
        <List.Item
            title="Animation Gallery"
            description="View all animations used in the app"
            left={renderAniIcon}
            right={renderRightIcon}
            //@ts-expect-error
            onPress={() => navigation.push('AniGallery')}
        />
    );
};
