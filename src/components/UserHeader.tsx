import React, { memo } from 'react';
import { Dimensions, ImageBackground, StyleSheet, View } from 'react-native';
import { Avatar, Text, useTheme } from 'react-native-paper';
import useSWR from 'swr';
import { Main } from '../types/userDetail';

export const UserHeader = memo(({ userId }: { userId?: number }) => {
    const appTheme = useTheme();
    const { data, error, } = useSWR<Main>(
        `https://music.163.com/api/v1/user/detail/${userId || 1492028517}`,
        { suspense: true }
    );

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
            imageStyle={styles.img}
            source={{ uri: data?.profile.backgroundUrl }}
        >
            <Avatar.Image
                style={styles.avatar}
                size={70}
                source={{ uri: data?.profile.avatarUrl }}
            />

            <View style={styles.caption}>
                <Text variant="labelLarge">
                    {data?.profile.nickname}
                </Text>
                <Text variant="labelMedium">
                    {data?.profile.signature}
                </Text>
            </View>
        </ImageBackground>
    );
});

const styles = StyleSheet.create({
    header: {
        alignItems: 'center',
    },
    img: {
        height: Dimensions.get('window').height / 6,
    },
    avatar: {
        marginTop: '30%',
    },
    caption: {
        marginTop: '1%'
    }
});
