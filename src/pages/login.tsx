import React, { Suspense, useState } from 'react';
import { StatusBar, StyleSheet } from 'react-native';
import { ActivityIndicator, Searchbar } from 'react-native-paper';
import { BlurBackground, UserList } from '../components';
import { useAppSelector } from '../hook';
import { selectUser } from '../redux/slices';

export const Login = () => {
    const user = useAppSelector(selectUser);

    const [showQuery, setShowQuery] = useState(user.username);
    const [searchQuery, setSearchQuery] = useState(user.username);

    const search = () => {
        if (showQuery && searchQuery !== showQuery) {
            setSearchQuery(showQuery);
        }
    };

    return (
        <BlurBackground>
            <Searchbar
                style={styles.searchbar}
                placeholder="Search for a user"
                onChangeText={setShowQuery}
                value={showQuery}
                onIconPress={search}
                onSubmitEditing={search}
                selectTextOnFocus
            />

            <Suspense fallback={
                <ActivityIndicator
                    size="large"
                    style={styles.loading}
                />
            }>
                <UserList searchQuery={searchQuery} />
            </Suspense>
        </BlurBackground>
    );
};

const styles = StyleSheet.create({
    searchbar: {
        marginTop: StatusBar.currentHeight,
        marginHorizontal: '2%',
        backgroundColor: 'transparent'
    },
    loading: {
        marginTop: '20%'
    },
});
