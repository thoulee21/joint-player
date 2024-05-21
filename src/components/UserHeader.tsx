import { useNavigation } from '@react-navigation/native';
import Color from 'color';
import React, { useEffect, useState } from 'react';
import { Dimensions, ImageBackground, StatusBar, StyleSheet } from 'react-native';
import { getColors } from 'react-native-image-colors';
import { AndroidImageColors } from 'react-native-image-colors/build/types';
import { Avatar, IconButton, Text, useTheme } from 'react-native-paper';
import useSWR from 'swr';
import { placeholderImg } from '.';
import { Main } from '../types/userDetail';

export const UserHeader = ({ userId }: { userId: number; }) => {
    const navigation = useNavigation();
    const appTheme = useTheme();

    const [isImageDark, setIsImageDark] = useState(false);
    const { data, error, } = useSWR<Main>(
        `https://music.163.com/api/v1/user/detail/${userId}`,
        { suspense: true }
    );

    useEffect(() => {
        const handleImageDark = async () => {
            const colors = await getColors(
                data?.profile.backgroundUrl || placeholderImg
            );
            const imgColors = colors as AndroidImageColors;
            setIsImageDark(Color(imgColors.average).isDark());
        };

        handleImageDark().then(() => {
            StatusBar.setBarStyle(
                isImageDark ? 'light-content' : 'dark-content'
            );
        });
    }, [data?.profile.backgroundUrl, isImageDark]);

    if (error) {
        return (
            <Text style={{ color: appTheme.colors.error }}>
                {error}
            </Text>
        );
    }

    return (
        <ImageBackground
            style={styles.header}
            source={{ uri: data?.profile.backgroundUrl }}
        >
            <IconButton
                icon="menu"
                size={24}
                style={styles.menuBtn}
                iconColor={isImageDark ? 'white' : 'black'}
                onPress={() => {
                    //@ts-ignore
                    navigation.openDrawer();
                }} />
            <Avatar.Image
                style={styles.avatar}
                size={70}
                source={{ uri: data?.profile.avatarUrl }} />

            <Text variant="labelLarge">
                {data?.profile.nickname}
            </Text>
            <Text variant="labelMedium">
                {data?.profile.signature}
            </Text>
        </ImageBackground>
    );
};

const styles = StyleSheet.create({
    header: {
        height: Dimensions.get('window').height * 0.15,
        alignItems: 'center',
    },
    menuBtn: {
        position: 'absolute',
        top: 0,
        left: 0,
        marginTop: StatusBar.currentHeight,
        margin: '2%'
    },
    avatar: {
        marginTop: Dimensions.get('window').height * 0.1,
        marginBottom: '1%'
    },
});
