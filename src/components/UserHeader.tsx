import { useNetInfoInstance } from '@react-native-community/netinfo';
import { useNavigation } from '@react-navigation/native';
import React, { memo } from 'react';
import { Dimensions, ImageBackground, StatusBar, StyleSheet } from 'react-native';
import { ActivityIndicator, Avatar, Text, TouchableRipple, useTheme } from 'react-native-paper';
import useSWR from 'swr';
import { useAppSelector } from '../hook';
import { selectUser } from '../redux/slices';
import { Main } from '../types/userDetail';

export const UserHeader = memo(({ userId }: { userId?: number }) => {
    const navigation = useNavigation();
    const appTheme = useTheme();

    const { netInfo } = useNetInfoInstance();
    const currentUser = useAppSelector(selectUser);

    const { data, error, isLoading } = useSWR<Main>(
        `https://music.163.com/api/v1/user/detail/${userId || currentUser.id}`,
    );

    if (isLoading) { return <ActivityIndicator />; }

    if (error) {
        return (
            <Text style={[
                styles.errMsg,
                { color: appTheme.colors.error }
            ]}>
                Error: {error.message}
            </Text>
        );
    }

    return (
        <ImageBackground
            style={styles.header}
            imageStyle={styles.img}
            source={{ uri: data?.profile.backgroundUrl }}
        >
            <TouchableRipple
                style={styles.avatar}
                borderless
                onPress={() => {
                    if (netInfo.isConnected) {
                        //@ts-expect-error
                        navigation.push('Login');
                    }
                }}
            >
                <Avatar.Image
                    size={70}
                    source={{ uri: data?.profile.avatarUrl }}
                />
            </TouchableRipple>

            <Text variant="labelLarge">
                {data?.profile.nickname}
            </Text>
            <Text variant="labelMedium">
                {data?.profile.signature}
            </Text>
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
        borderRadius: 50,
    },
    errMsg: {
        textAlign: 'center',
        marginTop: StatusBar.currentHeight,
        alignSelf: 'center',
    }
});
