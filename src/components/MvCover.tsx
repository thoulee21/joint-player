import Color from 'color';
import React, { PropsWithChildren } from 'react';
import { ImageBackground, StatusBar, StyleSheet, View } from 'react-native';
import { Card, useTheme } from 'react-native-paper';
import { useActiveTrack } from 'react-native-track-player';
import useSWR from 'swr';
import { Main as MvMain } from '../types/mv';
import { placeholderImg } from './TrackInfo';

export const MvCover = ({ children }: PropsWithChildren) => {
    const appTheme = useTheme();
    const track = useActiveTrack();

    const { data } = useSWR<MvMain>(
        `http://music.163.com/api/mv/detail?id=${track?.mvid}`
    );

    return (
        <Card elevation={5} style={styles.card}>
            <ImageBackground
                imageStyle={{ borderRadius: appTheme.roundness * 3 }}
                source={{ uri: data?.data.cover || placeholderImg }}
            >
                <View
                    style={[styles.cover, {
                        backgroundColor:
                            Color(appTheme.colors.surface)
                                .fade(0.3).toString(),
                        borderRadius: appTheme.roundness * 3
                    }]}
                >
                    {children}
                </View>
            </ImageBackground>
        </Card>
    );
};

const styles = StyleSheet.create({
    cover: {
        height: 200,
        justifyContent: 'space-between'
    },
    card: {
        marginHorizontal: '2%',
        marginTop: StatusBar.currentHeight,
    },
});
