import { createSlice } from '@reduxjs/toolkit';
import { RootState } from '../store';

const initialState = {
  value: false,
};

export const dimezisBlurSlice = createSlice({
  name: 'dimezisBlur',
  initialState,
  reducers: {
    toggleDimezisBlur: (state) => {
      state.value = !state.value;
    },
    setDimezisBlur: (state, action) => {
      state.value = action.payload;
    },
  },
});

export const { toggleDimezisBlur, setDimezisBlur } = dimezisBlurSlice.actions;

// Other code such as selectors can use the imported `RootState` type
export const selectDimezisBlur = (state: RootState) => state.dimezisBlur.value;
