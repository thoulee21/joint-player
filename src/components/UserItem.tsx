import { useNavigation } from '@react-navigation/native';
import React, { useCallback, useMemo } from 'react';
import { ToastAndroid } from 'react-native';
import HapticFeedback, { HapticFeedbackTypes } from 'react-native-haptic-feedback';
import { Avatar, IconButton, List } from 'react-native-paper';
import { useAppDispatch } from '../hook';
import { setUser } from '../redux/slices';
import type { ListLRProps } from '../types/paperListItem';
import { Userprofile } from '../types/searchUsers';

export const UserItem = ({ item }: { item: Userprofile }) => {
    const dispatch = useAppDispatch();
    const navigation = useNavigation();

    const user = useMemo(() => ({
        username: item.nickname,
        id: item.userId,
    }), [item.nickname, item.userId]);

    const login = useCallback(async () => {
        dispatch(setUser(user));

        HapticFeedback.trigger(HapticFeedbackTypes.effectHeavyClick);
        ToastAndroid.show(
            `Logged in as ${item.nickname}`,
            ToastAndroid.LONG
        );
        navigation.goBack();
    }, [dispatch, item.nickname, navigation, user]);

    const renderAvatar = useCallback((props: ListLRProps) => (
        <Avatar.Image
            {...props}
            size={50}
            source={{ uri: item.avatarUrl }}
        />
    ), [item.avatarUrl]);

    const renderLoginButton = useCallback((props: ListLRProps) => (
        <IconButton {...props}
            icon="login"
            onPress={login}
        />
    ), [login]);

    return (
        <List.Item
            title={item.nickname}
            description={item.signature}
            left={renderAvatar}
            right={renderLoginButton}
        />
    );
};
