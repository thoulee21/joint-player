import { createSlice } from '@reduxjs/toolkit';
import { Platform } from 'react-native';
import { RootState } from '../store';

const initialState = {
  value: Platform.select({
    android: true,
    ios: false,
    default: false,
  }),
};

export const rippleEffectsSlice = createSlice({
  name: 'rippleEffects',
  initialState,
  reducers: {
    toggleRippleEffect: (state) => {
      state.value = !state.value;
    },
    setRippleEffect: (state, action) => {
      state.value = action.payload;
    },
  },
});

export const { toggleRippleEffect, setRippleEffect } = rippleEffectsSlice.actions;


// Other code such as selectors can use the imported `RootState` type
export const selectRippleEffect = (state: RootState) => state.rippleEffect.value;

