import { useNavigation } from '@react-navigation/native';
import React from 'react';
import {
    StatusBar,
    StyleProp,
    StyleSheet,
    TouchableWithoutFeedback,
    ViewStyle,
} from 'react-native';
import HapticFeedback from 'react-native-haptic-feedback';
import { Avatar, Card, useTheme } from 'react-native-paper';
import { useActiveTrack } from 'react-native-track-player';
import { TrackMenu } from '.';

const placeholderImg = 'https://picsum.photos/100';

export interface TrackInfoBarProps {
    style?: StyleProp<ViewStyle>;
    right?: ({ size }: { size: number }) => React.ReactNode;
}

export const TrackInfoBar = ({ style, right }: TrackInfoBarProps) => {
    const navigation = useNavigation();
    const appTheme = useTheme();

    const track = useActiveTrack();

    const topBarStyle = [
        styles.infoBar,
        { paddingTop: StatusBar.currentHeight },
    ];

    return (
        <Card.Title
            title={track?.title}
            subtitle={track?.artist}
            subtitleStyle={{ color: appTheme.colors.primary }}
            style={style || topBarStyle}
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
            right={right || TrackMenu}
        />
    );
};

const styles = StyleSheet.create({
    infoBar: {
        marginVertical: '5%',
    },
});
