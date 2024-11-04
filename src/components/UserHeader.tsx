import { useNavigation } from '@react-navigation/native';
import React, { type PropsWithChildren } from 'react';
import {
    ImageBackground,
    StatusBar,
    StyleSheet,
    TouchableWithoutFeedback,
    View,
} from 'react-native';
import HapticFeedback, {
    HapticFeedbackTypes,
} from 'react-native-haptic-feedback';
import {
    ActivityIndicator,
    Avatar,
    Text,
    TouchableRipple,
    useTheme,
} from 'react-native-paper';
import useSWR from 'swr';
import { useAppSelector } from '../hook';
import { selectUser } from '../redux/slices';
import { Main } from '../types/userDetail';
import { placeholderImg } from './TrackInfo';

export const UserInfo = ({ userId }: { userId?: number }) => {
    const navigation = useNavigation();
    const appTheme = useTheme();
    const currentUser = useAppSelector(selectUser);

    const { data } = useSWR<Main>(
        `https://music.163.com/api/v1/user/detail/${userId || currentUser.id}`,
    );

    const viewAvatar = () => {
        HapticFeedback.trigger(
            HapticFeedbackTypes.effectDoubleClick
        );
        if (data) {
            //@ts-expect-error
            navigation.push('WebView', {
                url: data?.profile.avatarUrl,
                title: 'Avatar',
            });
        }
    };

    const goSwitchUser = () => {
        HapticFeedback.trigger(HapticFeedbackTypes.effectClick);
        navigation.navigate('SwitchUser' as never);
    };

    return (
        <>
            <TouchableRipple
                borderless
                style={styles.avatar}
                onPress={goSwitchUser}
                onLongPress={viewAvatar}
            >
                <Avatar.Image
                    size={70}
                    source={{ uri: data?.profile.avatarUrl }}
                />
            </TouchableRipple>

            <Text variant="labelLarge">
                {data?.profile.nickname}
            </Text>
            <Text
                variant="labelMedium"
                style={[styles.signature, {
                    color: appTheme.dark
                        ? appTheme.colors.onSurfaceDisabled
                        : appTheme.colors.backdrop,
                }]}
            >
                {data?.profile.signature}
            </Text>
        </>
    );
};

export const UserBackground = ({ userId, children }:
    PropsWithChildren<{ userId?: number }>
) => {
    const navigation = useNavigation();
    const appTheme = useTheme();

    const currentUser = useAppSelector(selectUser);
    const { data, error, isLoading } = useSWR<Main>(
        `https://music.163.com/api/v1/user/detail/${userId || currentUser.id}`,
    );

    if (isLoading) {
        return (
            <View style={styles.img}>
                <ActivityIndicator style={styles.loading} />
            </View>
        );
    }

    if (error) {
        return (
            <Text style={[
                styles.errMsg,
                { color: appTheme.colors.error },
            ]}>
                Error: {error.message}
            </Text>
        );
    }

    const viewBackground = () => {
        HapticFeedback.trigger(
            HapticFeedbackTypes.effectDoubleClick
        );
        if (data) {
            //@ts-expect-error
            navigation.push('WebView', {
                url: data?.profile.backgroundUrl,
                title: 'User Background',
            });
        }
    };

    return (
        <TouchableWithoutFeedback
            onLongPress={viewBackground}
        >
            <ImageBackground
                style={styles.header}
                imageStyle={styles.img}
                source={{
                    uri: data?.profile.backgroundUrl ||
                        placeholderImg,
                }}
            >
                {children}
            </ImageBackground>
        </TouchableWithoutFeedback>
    );
};

export const UserHeader = ({ userId }: { userId?: number }) => {
    return (
        <UserBackground userId={userId}>
            <UserInfo userId={userId} />
        </UserBackground>
    );
};

const styles = StyleSheet.create({
    header: {
        alignItems: 'center',
    },
    img: {
        height: '60%',
    },
    avatar: {
        marginTop: '30%',
        borderRadius: 50,
    },
    errMsg: {
        textAlign: 'center',
        marginTop: StatusBar.currentHeight,
        alignSelf: 'center',
    },
    loading: {
        flex: 1,
        alignSelf: 'center',
    },
    signature: {
        marginTop: 10,
    },
});
