import { useNavigation } from '@react-navigation/native';
import React from 'react';
import {
    StyleProp,
    TouchableWithoutFeedback,
    ViewStyle
} from 'react-native';
import HapticFeedback from 'react-native-haptic-feedback';
import { Avatar, Card, useTheme } from 'react-native-paper';
import { useActiveTrack } from 'react-native-track-player';

const placeholderImg = 'https://picsum.photos/100';

export interface TrackInfoBarProps {
    style?: StyleProp<ViewStyle>;
    right?: ({ size }: { size: number }) => React.ReactNode;
}

export const TrackInfoBar = (props: TrackInfoBarProps) => {
    const navigation = useNavigation();

    const appTheme = useTheme();
    const track = useActiveTrack();

    return (
        <Card.Title
            title={track?.title}
            subtitle={track?.artist}
            subtitleStyle={{ color: appTheme.colors.primary }}
            left={({ size }) =>
                <TouchableWithoutFeedback
                    onPress={() => {
                        HapticFeedback.trigger('effectHeavyClick');
                        navigation.goBack();
                    }}
                >
                    <Avatar.Image
                        size={size}
                        source={{ uri: track?.artwork || placeholderImg }}
                    />
                </TouchableWithoutFeedback>
            }
            {...props}
        />
    );
};
