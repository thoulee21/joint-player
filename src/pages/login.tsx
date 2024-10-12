import { useNetInfoInstance } from '@react-native-community/netinfo';
import { useNavigation } from '@react-navigation/native';
import React, { useCallback, useState } from 'react';
import { StatusBar, StyleSheet } from 'react-native';
import HapticFeedback, { HapticFeedbackTypes } from 'react-native-haptic-feedback';
import { Searchbar } from 'react-native-paper';
import { BlurBackground } from '../components/BlurBackground';
import { LottieAnimation } from '../components/LottieAnimation';
import { UserList } from '../components/UserList';

export const Login = () => {
    const navigation = useNavigation();
    const { netInfo } = useNetInfoInstance();

    const [showQuery, setShowQuery] = useState('');
    const [searchQuery, setSearchQuery] = useState('');

    const search = useCallback(() => {
        if (netInfo.isConnected) {
            if (showQuery && searchQuery !== showQuery) {
                setSearchQuery(showQuery);
            }
        }
    }, [netInfo.isConnected, searchQuery, showQuery]);

    const openDrawer = useCallback(() => {
        HapticFeedback.trigger(HapticFeedbackTypes.effectHeavyClick);
        //@ts-expect-error
        navigation.openDrawer();
    }, [navigation]);

    return (
        <BlurBackground>
            <Searchbar
                style={styles.searchbar}
                placeholder="Search for a user"
                onChangeText={setShowQuery}
                value={showQuery}
                icon="menu"
                onIconPress={openDrawer}
                onSubmitEditing={search}
                selectTextOnFocus
            />

            {searchQuery
                ? <UserList searchQuery={searchQuery} />
                : <LottieAnimation
                    caption="Login to use your custom settings"
                    animation="sushi"
                />}
        </BlurBackground>
    );
};

const styles = StyleSheet.create({
    searchbar: {
        marginTop: StatusBar.currentHeight,
        marginHorizontal: '2%',
        backgroundColor: 'transparent'
    },
});
