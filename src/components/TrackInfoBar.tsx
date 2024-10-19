import React from 'react';
import { StyleProp, StyleSheet, ViewStyle } from 'react-native';
import { Avatar, List } from 'react-native-paper';
import { Style } from 'react-native-paper/lib/typescript/components/List/utils';
import { useActiveTrack } from 'react-native-track-player';
import { ArtistNames } from './ArtistNames';

const placeholderImg = 'https://picsum.photos/100';

export const TrackInfoBar = ({ style, right }: {
    style?: StyleProp<ViewStyle>;
    right?: ({ color, style }: {
        color: string, style?: Style
    }) => React.ReactNode;
}) => {
    const track = useActiveTrack();
    const avatarImg = track?.artwork || placeholderImg;

    const renderAvatar = ({ style: leftStyle }: { style: Style }) => (
        <Avatar.Image
            size={40}
            style={leftStyle}
            source={{ uri: avatarImg }}
        />
    );

    return (
        <List.Item
            title={track?.title}
            description={<ArtistNames />}
            style={[styles.bar, style]}
            left={renderAvatar}
            right={right}
        />
    );
};

const styles = StyleSheet.create({
    bar: {
        paddingRight: 0,
        marginBottom: 0,
    },
});
