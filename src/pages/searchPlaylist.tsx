import { DrawerActions, useNavigation } from '@react-navigation/native';
import Color from 'color';
import React, { useCallback, useState } from 'react';
import { StyleSheet } from 'react-native';
import { Searchbar, useTheme } from 'react-native-paper';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { BlurBackground } from '../components/BlurBackground';
import { PlaylistSearch } from '../components/PlaylistSearch';
import { SearchHistoryList } from '../components/SearchHistoryList';

export const SearchPlaylist = () => {
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();
  const appTheme = useTheme();

  const [keyword, setKeyword] = useState('');
  const [showKeyword, setShowKeyword] = useState('');

  const search = useCallback(() => {
    setKeyword(showKeyword);
  }, [showKeyword]);

  return (
    <BlurBackground
      style={{ paddingTop: insets.top }}
    >
      <Searchbar
        placeholder="Search for playlist"
        placeholderTextColor={appTheme.dark
          ? appTheme.colors.onSurfaceDisabled
          : appTheme.colors.backdrop}
        value={showKeyword}
        onChangeText={setShowKeyword}
        onSubmitEditing={search}
        style={[styles.searchbar, {
          backgroundColor: Color(
            appTheme.colors.secondaryContainer
          ).fade(0.3).string(),
        }]}
        icon="menu"
        onIconPress={() => {
          navigation.dispatch(
            DrawerActions.toggleDrawer()
          );
        }}
        blurOnSubmit
        selectTextOnFocus
        selectionColor={Color(
          appTheme.colors.inversePrimary
        ).fade(0.5).string()}
        autoFocus
      />

      {keyword ? (
        <PlaylistSearch keyword={keyword} />
      ) : (
        <SearchHistoryList setKeyword={setKeyword} />
      )}
    </BlurBackground>
  );
};

const styles = StyleSheet.create({
  searchbar: {
    margin: '2%',
  },
});
