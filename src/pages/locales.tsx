import { useNavigation } from '@react-navigation/native';
import React, { useCallback, useLayoutEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { StyleSheet } from 'react-native';
import { Button, RadioButton } from 'react-native-paper';
import { useAppDispatch, useAppSelector } from '../hook';
import { selectLocale, setLocale, type Languages } from '../redux/slices';

export const LocalesScreen = () => {
  const dispatch = useAppDispatch();
  const navigation = useNavigation();
  const { t } = useTranslation();

  const locale = useAppSelector(selectLocale);
  const [lng, setLng] = useState(locale);

  const renderSaveButton = useCallback((
    props: any
  ) => {
    return (
      <Button
        {...props}
        onPress={() => {
          // 保存语言
          dispatch(
            setLocale(lng as Languages)
          );
          navigation.goBack();
        }}
      >
        {t('locales.save')}
      </Button>
    );
  }, [dispatch, lng, navigation, t]);

  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: renderSaveButton
    });
  }, [navigation, renderSaveButton]);

  return (
    <RadioButton.Group
      onValueChange={
        (value) => setLng(value)
      }
      value={lng}
    >
      <RadioButton.Item
        label={t('locales.system')}
        value="locale"
        position="leading"
        labelStyle={styles.label}
      />
      <RadioButton.Item
        label="简体中文"
        value="zh-CN"
        position="leading"
        labelStyle={styles.label}
      />
      <RadioButton.Item
        label="English"
        value="en-US"
        position="leading"
        labelStyle={styles.label}
      />
    </RadioButton.Group>
  );
};

const styles = StyleSheet.create({
  label: {
    textAlign: 'left',
    paddingLeft: 10,
  }
});
