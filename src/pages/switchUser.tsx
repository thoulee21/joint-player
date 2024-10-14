import { useNavigation } from '@react-navigation/native';
import React, { useCallback, useState } from 'react';
import { StatusBar, StyleSheet } from 'react-native';
import HapticFeedback, {
    HapticFeedbackTypes
} from 'react-native-haptic-feedback';
import { Searchbar } from 'react-native-paper';
import { BlurBackground } from '../components/BlurBackground';
import { LottieAnimation } from '../components/LottieAnimation';
import { UserList } from '../components/UserList';

export const SwitchUser = () => {
    const navigation = useNavigation();

    const [showQuery, setShowQuery] = useState('');
    const [searchQuery, setSearchQuery] = useState('');

    const search = useCallback(() => {
        if (showQuery && searchQuery !== showQuery) {
            setSearchQuery(showQuery);
        }
    }, [searchQuery, showQuery]);

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
