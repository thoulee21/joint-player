import { useNavigation } from "@react-navigation/native";
import React, { useCallback, useLayoutEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { FlatList, StyleSheet, View } from "react-native";
import HapticFeedBack, {
  HapticFeedbackTypes,
} from "react-native-haptic-feedback";
import { Button, RadioButton, Text, TouchableRipple } from "react-native-paper";
import { useAppDispatch, useAppSelector } from "../hook";
import { selectLocale, setLocale, type Languages } from "../redux/slices";

export const LocalesScreen = () => {
  const dispatch = useAppDispatch();
  const navigation = useNavigation();
  const { t } = useTranslation();

  const locale = useAppSelector(selectLocale);
  const [lng, setLng] = useState(locale);

  const renderSaveButton = useCallback(
    (props: any) => {
      return (
        <Button
          {...props}
          onPress={() => {
            // 保存语言
            dispatch(setLocale(lng as Languages));
            navigation.goBack();
          }}
        >
          {t("locales.save")}
        </Button>
      );
    },
    [dispatch, lng, navigation, t],
  );

  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: renderSaveButton,
    });
  }, [navigation, renderSaveButton]);

  const langs = useMemo(
    () => [
      {
        label: t("locales.system"),
        value: "locale",
      },
      {
        label: "English",
        value: "en-US",
      },
      {
        label: "简体中文",
        value: "zh-CN",
      },
      {
        label: "繁體中文",
        value: "zh-TW",
      },
    ],
    [t],
  );

  const renderItem = useCallback(
    ({ item }: { item: { label: string; value: string } }) => (
      <TouchableRipple
        onPress={() => {
          HapticFeedBack.trigger(HapticFeedbackTypes.effectHeavyClick);
          setLng(item.value);
        }}
      >
        <View style={styles.row}>
          <View pointerEvents="none">
            <RadioButton
              value={item.value}
              status={lng === item.value ? "checked" : "unchecked"}
            />
          </View>
          <Text style={styles.btnText}>{item.label}</Text>
        </View>
      </TouchableRipple>
    ),
    [lng],
  );

  return (
    <FlatList
      data={langs}
      renderItem={renderItem}
      keyExtractor={(item) => item.value}
      extraData={lng}
    />
  );
};

const styles = StyleSheet.create({
  label: {
    textAlign: "left",
    paddingLeft: 10,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  btnText: {
    paddingLeft: 8,
  },
});
