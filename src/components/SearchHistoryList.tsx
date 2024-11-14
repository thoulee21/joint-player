import Color from 'color';
import React, { useCallback } from 'react';
import { StyleSheet, View } from 'react-native';
import { Chip, IconButton, List, useTheme } from 'react-native-paper';
import { useAppDispatch, useAppSelector } from '../hook';
import { clearSearchHistory, selectSearchHistory } from '../redux/slices';
import { LottieAnimation } from './LottieAnimation';

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
      style={[
        styles.chip, {
          backgroundColor: Color(
            appTheme.colors.surface
          ).fade(0.4).string(),
        }
      ]}
      key={`${index}-${item}`}
      onPress={() => {
        setKeyword(item);
      }}
    >
      {item}
    </Chip>
  ), [appTheme.colors.surface, setKeyword]);

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

      <View style={styles.list}>
        {searchHistory.length > 0 ? (
          searchHistory.map(renderItem)
        ) : (
          <LottieAnimation
            animation="rocket"
            caption="No search history"
          />
        )}
      </View>
    </View>
  );
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
