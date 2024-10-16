import { useNavigation } from '@react-navigation/native';
import React, { useCallback, useState } from 'react';
import { StatusBar, StyleSheet } from 'react-native';
import { Searchbar, useTheme } from 'react-native-paper';
import { BlurBackground } from '../components/BlurBackground';
import { LottieAnimation } from '../components/LottieAnimation';
import { UserList } from '../components/UserList';

export const SwitchUser = () => {
    const navigation = useNavigation();
    const appTheme = useTheme();

    const [showQuery, setShowQuery] = useState('');
    const [searchQuery, setSearchQuery] = useState('');

    const search = useCallback(() => {
        if (showQuery && searchQuery !== showQuery) {
            setSearchQuery(showQuery);
        }
    }, [searchQuery, showQuery]);

    return (
        <BlurBackground>
            <Searchbar
                style={styles.searchbar}
                placeholder="Search for a user"
                onChangeText={setShowQuery}
                value={showQuery}
                icon="arrow-left"
                onIconPress={navigation.goBack}
                onSubmitEditing={search}
                selectTextOnFocus
                onClearIconPress={() => {
                    setSearchQuery('');
                    setShowQuery('');
                }}
            />

            {searchQuery
                ? <UserList searchQuery={searchQuery} />
                : <LottieAnimation
                    caption="Login to use your custom settings"
                    animation="welcome"
                    loop={false}
                    colorFilters={[
                        { keypath: 'ball', color: appTheme.colors.primary },
                        { keypath: 'welcome 1', color: appTheme.colors.primary },
                        { keypath: 'welcome 3', color: appTheme.colors.primary },
                        { keypath: 'welcome 2', color: appTheme.colors.onBackground },
                    ]}
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
