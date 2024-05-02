import { useNavigation } from '@react-navigation/native';
import Color from 'color';
import React, { PropsWithChildren } from 'react';
import {
    ImageBackground,
    StatusBar,
    StyleSheet,
    View
} from 'react-native';
import HapticFeedback, {
    HapticFeedbackTypes
} from 'react-native-haptic-feedback';
import { Card, useTheme } from 'react-native-paper';
import { useActiveTrack } from 'react-native-track-player';
import useSWR from 'swr';
import { Main as MvMain } from '../types/mv';
import { placeholderImg } from './TrackInfo';

export const MvCover = ({ children }: PropsWithChildren) => {
    const navigation = useNavigation();
    const appTheme = useTheme();
    const track = useActiveTrack();

    const { data } = useSWR<MvMain>(
        `http://music.163.com/api/mv/detail?id=${track?.mvid}`
    );

    const actionsBarStyle = {
        backgroundColor:
            Color(appTheme.colors.surface)
                .fade(0.3).toString(),
        borderRadius: appTheme.roundness * 3
    };

    return (
        <Card
            elevation={5}
            style={styles.card}
            onLongPress={() => {
                HapticFeedback.trigger(
                    HapticFeedbackTypes.effectTick
                );
                // @ts-ignore
                navigation.navigate('WebView', {
                    title: data?.data.name,
                    url: data?.data.cover
                });
            }}
        >
            <ImageBackground
                imageStyle={{ borderRadius: appTheme.roundness * 3 }}
                source={{ uri: data?.data.cover || placeholderImg }}
            >
                <View style={styles.cover}>
                    <View style={actionsBarStyle}>
                        {children}
                    </View>
                </View>
            </ImageBackground>
        </Card>
    );
};

const styles = StyleSheet.create({
    cover: {
        height: 200,
        justifyContent: 'flex-end',
    },
    card: {
        marginHorizontal: '2%',
        marginTop: StatusBar.currentHeight,
    },
});
