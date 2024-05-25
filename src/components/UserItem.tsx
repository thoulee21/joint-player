import AsyncStorage from '@react-native-async-storage/async-storage';
import React from 'react';
import { ToastAndroid } from 'react-native';
import HapticFeedback, { HapticFeedbackTypes } from 'react-native-haptic-feedback';
import { Avatar, List } from 'react-native-paper';
import { StorageKeys } from '../App';
import { useAppDispatch } from '../hook';
import { setUser } from '../redux/slices';
import { Userprofile } from '../types/searchUsers';

export const UserItem = ({ item }: { item: Userprofile; }) => {
    const dispatch = useAppDispatch();

    const login = () => {
        const user = {
            username: item.nickname,
            id: item.userId
        };

        dispatch(setUser(user));
        AsyncStorage.setItem(
            StorageKeys.User, JSON.stringify(user)
        );

        HapticFeedback.trigger(
            HapticFeedbackTypes.effectHeavyClick
        );
        ToastAndroid.show(
            `Logged in as ${item.nickname}`,
            ToastAndroid.SHORT
        );
    };

    return (
        <List.Item
            title={item.nickname}
            description={item.signature}
            onPress={login}
            left={(props) => (
                <Avatar.Image {...props}
                    size={40}
                    source={{ uri: item.avatarUrl }} />
            )} />
    );
};
