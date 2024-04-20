import AsyncStorage from '@react-native-async-storage/async-storage';
import Color from 'color';
import React, { useContext, useState } from 'react';
import { StyleSheet, ToastAndroid } from 'react-native';
import { TextInput, useTheme } from 'react-native-paper';
import { PreferencesContext, StorageKeys } from '../App';

export function InitKeywordItem() {
  const prefs = useContext(PreferencesContext);
  const appTheme = useTheme();

  const { keyword, setKeyword } = prefs || { keyword: '', setKeyword: () => { } };
  const [savedCheck, setSavedCheck] = useState(false);

  const saveKeyword = async () => {
    await AsyncStorage.setItem(
      StorageKeys.Keyword, keyword || '',
    );

    setSavedCheck(true);
    ToastAndroid.show('Keyword saved!', ToastAndroid.SHORT);
  };

  return (
    <TextInput
      label="Set Initial Keyword"
      placeholder="A keyword to search when app opens"
      style={styles.input}
      value={keyword}
      onChangeText={(text) => {
        setKeyword(text);
        setSavedCheck(false);
      }}
      onSubmitEditing={saveKeyword}
      selectionColor={
        Color(appTheme.colors.inversePrimary)
          .fade(0.5).string()
      }
      selectTextOnFocus
      blurOnSubmit
      right={
        <TextInput.Icon
          icon={savedCheck ? 'content-save-check' : 'content-save'}
          onPress={saveKeyword}
          animated
        />
      }
    />
  );
}

const styles = StyleSheet.create({
  input: {
    backgroundColor: 'transparent',
  },
});
