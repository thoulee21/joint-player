import { createSlice } from '@reduxjs/toolkit';
import { StateKeys } from '../../utils/storageKeys';
import { RootState } from '../store';

const initialState = {
    value: false,
};

export const darkModeSlice = createSlice({
    name: StateKeys.DarkMode,
    // `createSlice` will infer the state type from the `initialState` argument
    initialState,
    reducers: {
        setDarkMode: (state, action) => {
            state.value = action.payload;
        },
    },
});

export const { setDarkMode } = darkModeSlice.actions;


// Other code such as selectors can use the imported `RootState` type
export const selectDarkModeEnabled = (state: RootState) => state.darkMode.value;

