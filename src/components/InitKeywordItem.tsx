import AsyncStorage from '@react-native-async-storage/async-storage';
import Color from 'color';
import React, { useEffect, useState } from 'react';
import { StyleSheet, ToastAndroid } from 'react-native';
import { TextInput, useTheme } from 'react-native-paper';
import { StorageKeys } from '../App';

export function InitKeywordItem() {
  const appTheme = useTheme();

  const [keyword, setKeyword] = useState('');
  const [savedCheck, setSavedCheck] = useState(false);

  useEffect(() => {
    const restoreKeyword = async () => {
      const storedKeyword = await AsyncStorage.getItem(StorageKeys.Keyword);
      if (storedKeyword) {
        setKeyword(storedKeyword);
      }
    };

    restoreKeyword();
  }, []);

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
