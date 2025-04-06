import React, { useState } from "react";
import { Animated, StyleSheet, View } from "react-native";
import {
  Button,
  Dialog,
  IconButton,
  List,
  Portal,
  Text,
  useTheme,
} from "react-native-paper";
import { useAppDispatch, useAppSelector } from "../hook";
import { clearSearchHistory, selectSearchHistory } from "../redux/slices";
import { HistoryItem } from "./HistoryItem";

export const SearchHistoryList = ({
  setKeyword,
  onPressHistory,
}: {
  setKeyword: (keyword: string) => void;
  onPressHistory: () => void;
}) => {
  const dispatch = useAppDispatch();
  const appTheme = useTheme();

  const searchHistory = useAppSelector(selectSearchHistory);
  const [dialogVisible, setDialogVisible] = useState(false);

  return (
    <>
      {searchHistory.length > 0 && (
        <View style={styles.root}>
          <View style={styles.header}>
            <List.Subheader style={{ color: appTheme.colors.secondary }}>
              Search History
            </List.Subheader>

            <IconButton
              icon="delete-sweep-outline"
              disabled={searchHistory.length === 0}
              onPress={() => setDialogVisible(true)}
            />
          </View>

          <Animated.ScrollView>
            <View style={styles.list}>
              {searchHistory.map((item: string, index: number) => (
                <React.Fragment key={`${index}-${item}`}>
                  <HistoryItem
                    item={item}
                    setKeyword={setKeyword}
                    onPressHistory={onPressHistory}
                  />
                </React.Fragment>
              ))}
            </View>
          </Animated.ScrollView>
        </View>
      )}

      <Portal>
        <Dialog
          visible={dialogVisible}
          onDismiss={() => setDialogVisible(false)}
        >
          <Dialog.Icon icon="information" size={40} />
          <Dialog.Title>Clear Search History</Dialog.Title>
          <Dialog.Content>
            <Text>Do you want to clear all search history?</Text>
          </Dialog.Content>

          <Dialog.Actions>
            <Button
              textColor={appTheme.colors.outline}
              onPress={() => setDialogVisible(false)}
            >
              Cancel
            </Button>
            <Button
              textColor={appTheme.colors.error}
              onPress={() => {
                setDialogVisible(false);
                dispatch(clearSearchHistory());
              }}
            >
              OK
            </Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>
    </>
  );
};

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  list: {
    paddingHorizontal: 12,
    flexWrap: "wrap",
    flexDirection: "row",
  },
});
