import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { StateKeys } from '../../utils/stateKeys';
import { RootState } from '../store';

const initialState = {
  value: [] as string[],
};

export const searchHistorySlice = createSlice({
  name: StateKeys.SearchHistory,
  initialState,
  reducers: {
    setSearchHistory: (state, action: PayloadAction<string[]>) => {
      state.value = action.payload;
    },
    addSearchHistory: (state, action: PayloadAction<string>) => {
      const existIndex = state.value.findIndex(
        (history) => history === action.payload
      );
      if (existIndex === -1) {
        state.value.push(action.payload);
      }
    },
    removeSearchHistory: (state, action: PayloadAction<string>) => {
      state.value = state.value.filter(
        (history) => history !== action.payload
      );
    },
    clearSearchHistory: (state) => {
      state.value = [];
    },
  },
});

export const { addSearchHistory, clearSearchHistory, removeSearchHistory, setSearchHistory } = searchHistorySlice.actions;

export const selectSearchHistory = (state: RootState) => state.searchHistory.value;
