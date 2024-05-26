import { useNavigation } from '@react-navigation/native';
import React, { memo } from 'react';
import {
    Dimensions,
    ImageBackground,
    StatusBar,
    StyleSheet,
    TouchableWithoutFeedback
} from 'react-native';
import HapticFeedback, {
    HapticFeedbackTypes
} from 'react-native-haptic-feedback';
import {
    ActivityIndicator,
    Avatar,
    Text,
    TouchableRipple,
    useTheme
} from 'react-native-paper';
import useSWR from 'swr';
import { useAppSelector } from '../hook';
import { selectUser } from '../redux/slices';
import { Main } from '../types/userDetail';

export const UserHeader = memo(({ userId }: { userId?: number }) => {
    const navigation = useNavigation();
    const appTheme = useTheme();

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

    const viewBackground = () => {
        HapticFeedback.trigger(
            HapticFeedbackTypes.effectDoubleClick
        );
        if (data) {
            //@ts-expect-error
            navigation.push('WebView', {
                url: data?.profile.backgroundUrl,
                title: 'User Background'
            });
        }
    };

    const viewAvatar = () => {
        HapticFeedback.trigger(
            HapticFeedbackTypes.effectDoubleClick
        );
        if (data) {
            //@ts-expect-error
            navigation.push('WebView', {
                url: data?.profile.avatarUrl,
                title: 'Avatar'
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
                source={{ uri: data?.profile.backgroundUrl }}
            >
                <TouchableRipple
                    style={styles.avatar}
                    borderless
                    onPress={() => {
                        HapticFeedback.trigger(
                            HapticFeedbackTypes.effectHeavyClick
                        );
                        //@ts-expect-error
                        navigation.push('Login');
                    }}
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
                <Text variant="labelMedium">
                    {data?.profile.signature}
                </Text>
            </ImageBackground>
        </TouchableWithoutFeedback>
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
