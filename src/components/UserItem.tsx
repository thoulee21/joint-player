import { useNavigation } from '@react-navigation/native';
import React from 'react';
import { ToastAndroid } from 'react-native';
import HapticFeedback, { HapticFeedbackTypes } from 'react-native-haptic-feedback';
import { Avatar, IconButton, List } from 'react-native-paper';
import { useAppDispatch } from '../hook';
import { setUser } from '../redux/slices';
import { Userprofile } from '../types/searchUsers';

export const UserItem = ({ item }: { item: Userprofile }) => {
    const dispatch = useAppDispatch();
    const navigation = useNavigation();

    const user = {
        username: item.nickname,
        id: item.userId
    };

    const login = async () => {
        dispatch(setUser(user));

        HapticFeedback.trigger(HapticFeedbackTypes.effectHeavyClick);
        ToastAndroid.show(`Logged in as ${item.nickname}`, ToastAndroid.LONG);

        navigation.goBack();
        //@ts-expect-error
        navigation.openDrawer();
    };

    return (
        <List.Item
            title={item.nickname}
            description={item.signature}
            left={(props) =>
                <Avatar.Image {...props}
                    size={40}
                    source={{ uri: item.avatarUrl }}
                />
            }
            right={(props) =>
                <IconButton {...props}
                    icon="login"
                    onPress={login}
                />
            }
        />
    );
};
