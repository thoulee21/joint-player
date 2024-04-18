import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { useContext, useState } from 'react';
import { StyleSheet, ToastAndroid } from 'react-native';
import { List, TextInput } from 'react-native-paper';
import { PreferencesContext, StorageKeys } from '../App';

export function InitKeywordItem() {
  const prefs = useContext(PreferencesContext);
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
    <List.Section>
      <TextInput
        label="Initial Keyword"
        placeholder="Enter a keyword"
        mode="outlined"
        style={styles.input}
        value={keyword}
        onChangeText={(text) => {
          setKeyword(text);
          setSavedCheck(false);
        }}
        onSubmitEditing={saveKeyword}
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
    </List.Section>
  );
}

const styles = StyleSheet.create({
  input: {
    marginHorizontal: '2%'
  },
});