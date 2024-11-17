import { useNavigation } from '@react-navigation/native';
import React, { useCallback } from 'react';
import { List } from 'react-native-paper';
import type { ListLRProps } from '../types/paperListItem';

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
            description="View lottie animations in gallery mode"
            left={renderAniIcon}
            right={renderRightIcon}
            //@ts-expect-error
            onPress={() => navigation.push('AniGallery')}
        />
    );
};
