import { useNetInfoInstance } from '@react-native-community/netinfo';
import { useNavigation } from '@react-navigation/native';
import React, { useCallback, useState } from 'react';
import { StatusBar, StyleSheet } from 'react-native';
import { Searchbar } from 'react-native-paper';
import { BlurBackground, UserList } from '../components';
import { useAppSelector } from '../hook';
import { selectUser } from '../redux/slices';

export const Login = () => {
    const navigation = useNavigation();

    const { netInfo } = useNetInfoInstance();
    const user = useAppSelector(selectUser);

    const [showQuery, setShowQuery] = useState(user.username);
    const [searchQuery, setSearchQuery] = useState(user.username);

    const search = useCallback(() => {
        if (netInfo.isConnected) {
            if (showQuery && searchQuery !== showQuery) {
                setSearchQuery(showQuery);
            }
        }
    }, [netInfo.isConnected, searchQuery, showQuery]);

    return (
        <BlurBackground>
            <Searchbar
                style={styles.searchbar}
                placeholder="Search for a user"
                onChangeText={setShowQuery}
                value={showQuery}
                icon="menu"
                // @ts-expect-error
                onIconPress={navigation.openDrawer}
                onSubmitEditing={search}
                selectTextOnFocus
            />
            <UserList searchQuery={searchQuery} />
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
