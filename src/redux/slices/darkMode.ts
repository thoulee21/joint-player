import { createSlice } from '@reduxjs/toolkit';
import { Appearance } from 'react-native';
import { RootState } from '../store';

// Define the initial state using that type
const initialState = {
    enabled: Appearance.getColorScheme() === 'dark',
};

export const darkModeSlice = createSlice({
    name: 'darkMode',
    // `createSlice` will infer the state type from the `initialState` argument
    initialState,
    reducers: {
        toggleDarkMode: (state) => {
            state.enabled = !state.enabled;
        },
    },
});

export const { toggleDarkMode } = darkModeSlice.actions;


// Other code such as selectors can use the imported `RootState` type
export const selectDarkModeEnabled = (state: RootState) => state.darkMode.enabled;

