import React, { useCallback, useState } from "react";
import { FlatList, StyleSheet, View } from "react-native";
import HapticFeedBack, {
  HapticFeedbackTypes,
} from "react-native-haptic-feedback";
import {
  Button,
  Dialog,
  RadioButton,
  Text,
  TouchableRipple,
  useTheme,
} from "react-native-paper";

type DialogProps = {
  btns: string[];
  visible: boolean;
  close: () => void;
  setValue: (res: string | null) => void;
  defaultValue?: string;
};

export const DialogWithRadioBtns = ({
  btns,
  visible,
  close,
  setValue,
  defaultValue,
}: DialogProps) => {
  const appTheme = useTheme();

  if (!defaultValue) {
    defaultValue = btns[btns.length - 1];
  }
  const [checkedItem, setCheckedItem] = useState(defaultValue);

  const renderItem = useCallback(
    ({ item }: { item: string }) => (
      <TouchableRipple
        onPress={() => {
          HapticFeedBack.trigger(HapticFeedbackTypes.effectHeavyClick);
          setCheckedItem(item);
        }}
      >
        <View style={styles.row}>
          <View pointerEvents="none">
            <RadioButton
              value={item}
              status={checkedItem === item ? "checked" : "unchecked"}
            />
          </View>
          <Text style={styles.btnText}>{item}</Text>
        </View>
      </TouchableRipple>
    ),
    [checkedItem],
  );

  return (
    <Dialog
      visible={visible}
      onDismiss={close}
      dismissable={false}
      dismissableBackButton={false}
    >
      <Dialog.Icon icon="video-switch-outline" size={60} />
      <Dialog.Title style={styles.title}>Choose resolution</Dialog.Title>

      <Dialog.ScrollArea style={styles.btnsContainer}>
        <FlatList
          data={btns}
          renderItem={renderItem}
          inverted
          keyExtractor={(item) => item}
          extraData={checkedItem}
        />
      </Dialog.ScrollArea>

      <Dialog.Actions>
        <Button textColor={appTheme.colors.outline} onPress={close}>
          Cancel
        </Button>
        <Button
          onPress={() => {
            HapticFeedBack.trigger(HapticFeedbackTypes.effectTick);
            setValue(checkedItem);
            close();
          }}
        >
          OK
        </Button>
      </Dialog.Actions>
    </Dialog>
  );
};

const styles = StyleSheet.create({
  title: {
    textAlign: "center",
  },
  btnsContainer: {
    paddingHorizontal: 0,
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
