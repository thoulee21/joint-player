import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { useEffect, useState } from 'react';
import { StyleSheet, ToastAndroid } from 'react-native';
import { TextInput } from 'react-native-paper';
import { StorageKeys } from '../App';

export function InitKeywordItem() {
  const [keyword, setKeyword] = useState<string | undefined>();
  const [saved, setSaved] = useState<boolean>(true);

  useEffect(() => {
    async function loadKeyword() {
      const storedKeyword = await AsyncStorage.getItem(StorageKeys.Keyword);
      if (storedKeyword) {
        setKeyword(storedKeyword);
      }
    }

    loadKeyword();
  }, []);

  const saveKeyword = async () => {
    await AsyncStorage.setItem(
      StorageKeys.Keyword, keyword || '',
    );
    setSaved(true);
    ToastAndroid.show('Keyword saved!', ToastAndroid.SHORT);
  };

  return (
    <TextInput
      label="Initial Keyword"
      placeholder="Enter a keyword"
      mode="outlined"
      style={styles.input}
      value={keyword}
      onChangeText={(text) => {
        setKeyword(text);
        setSaved(false);
      }}
      onSubmitEditing={saveKeyword}
      selectTextOnFocus
      blurOnSubmit
      right={
        <TextInput.Icon
          icon={saved ? 'content-save-check' : 'content-save'}
          onPress={saveKeyword}
          animated
        />
      }
    />
  );
}

const styles = StyleSheet.create({
  input: {
    marginHorizontal: '2%'
  },
});