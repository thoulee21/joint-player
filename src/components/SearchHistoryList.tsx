import Color from 'color';
import React, { useCallback } from 'react';
import { Alert, Animated, StyleSheet, View } from 'react-native';
import HapticFeedback, {
  HapticFeedbackTypes,
} from 'react-native-haptic-feedback';
import { Chip, IconButton, List, useTheme } from 'react-native-paper';
import { useAppDispatch, useAppSelector } from '../hook';
import {
  clearSearchHistory,
  removeSearchHistory,
  selectSearchHistory,
} from '../redux/slices';

export const SearchHistoryList = ({ setKeyword }: {
  setKeyword: (keyword: string) => void
}) => {
  const dispatch = useAppDispatch();
  const appTheme = useTheme();
  const searchHistory = useAppSelector(selectSearchHistory);

  const renderItem = useCallback((
    item: string, index: number
  ) => (
    <Chip
      compact
      mode="outlined"
      style={[styles.chip, {
        backgroundColor:
          Color(appTheme.colors.surface)
            .fade(0.4).toString(),
      }]}
      key={`${index}-${item}`}
      onPress={() => { setKeyword(item); }}
      onLongPress={() => {
        HapticFeedback.trigger(
          HapticFeedbackTypes.effectHeavyClick
        );
        Alert.alert(
          'Remove search history',
          'Do you want to remove this search history?',
          [
            { text: 'Cancel', style: 'cancel' },
            {
              text: 'OK', onPress: () => {
                dispatch(
                  removeSearchHistory(item)
                );
              },
            },
          ]
        );
      }}
    >{item}</Chip>
  ), [appTheme.colors.surface, dispatch, setKeyword]);

  if (searchHistory.length > 0) {
    return (
      <View style={styles.root}>
        <View style={styles.header}>
          <List.Subheader
            style={{ color: appTheme.colors.secondary }}
          >
            Search History
          </List.Subheader>

          <IconButton
            icon="delete-sweep-outline"
            disabled={searchHistory.length === 0}
            onPress={() => {
              dispatch(clearSearchHistory());
            }}
          />
        </View>

        <Animated.ScrollView>
          <View style={styles.list}>
            {searchHistory.map(renderItem)}
          </View>
        </Animated.ScrollView>
      </View>
    );
  }
};

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  list: {
    paddingHorizontal: 12,
    flexWrap: 'wrap',
    flexDirection: 'row',
  },
  chip: {
    margin: 3,
  },
});
