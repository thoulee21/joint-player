import { useNavigation } from '@react-navigation/native';
import Color from 'color';
import React, { useCallback, useEffect, useState } from 'react';
import { StyleSheet } from 'react-native';
import HapticFeedback, { HapticFeedbackTypes } from 'react-native-haptic-feedback';
import { Searchbar, useTheme } from 'react-native-paper';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { BlurBackground } from '../components/BlurBackground';
import { LottieAnimation } from '../components/LottieAnimation';
import { SearchSongList } from '../components/SearchSongList';
import { Storage } from '../utils/storage';
import { StorageKeys } from '../utils/storageKeys';

export const Search = () => {
    const navigation = useNavigation();
    const appTheme = useTheme();
    const insets = useSafeAreaInsets();

    const [keyword, setKeyword] = useState('');
    const [placeholder, setPlaceholder] = useState('');
    const [showQuery, setShowQuery] = useState('');

    useEffect(() => {
        const restoreInitKeyword = async () => {
            const storedKeyword =
                await Storage.get(StorageKeys.Keyword);
            if (storedKeyword) {
                setPlaceholder(storedKeyword);
            }
        };

        restoreInitKeyword();
    }, []);

    const searchSongs = useCallback(async () => {
        if (showQuery) {
            Storage.set(StorageKeys.Keyword, showQuery);
            setKeyword(showQuery);
        } else if (placeholder) {
            setShowQuery(placeholder);
            setKeyword(placeholder);
        }
    }, [placeholder, showQuery]);

    return (
        <BlurBackground style={{ paddingTop: insets.top }}>
            <Searchbar
                placeholder={placeholder || 'Search for songs'}
                placeholderTextColor={appTheme.dark
                    ? appTheme.colors.onSurfaceDisabled
                    : appTheme.colors.backdrop}
                style={[styles.searchbar, {
                    backgroundColor: Color(
                        appTheme.colors.secondaryContainer
                    ).fade(0.3).string(),
                }]}
                inputStyle={{ color: appTheme.colors.onSurface }}
                onChangeText={setShowQuery}
                value={showQuery}
                onSubmitEditing={searchSongs}
                icon="arrow-left"
                iconColor={appTheme.colors.onSurface}
                onIconPress={navigation.goBack}
                traileringIcon="magnify"
                onTraileringIconPress={() => {
                    HapticFeedback.trigger(
                        HapticFeedbackTypes.effectHeavyClick
                    );
                    searchSongs();
                }}
                blurOnSubmit
                selectTextOnFocus
                selectionColor={Color(
                    appTheme.colors.inversePrimary
                ).fade(0.5).string()}
                autoFocus
            />

            {keyword ? (
                <SearchSongList keyword={keyword} />
            ) : (
                <LottieAnimation
                    caption="Search for songs"
                    animation="rocket"
                />
            )}
        </BlurBackground>
    );
};

const styles = StyleSheet.create({
    searchbar: {
        marginVertical: '1%',
        marginHorizontal: '4%',
    },
});
