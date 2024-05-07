import { createSlice } from '@reduxjs/toolkit';
import { RootState } from '../store';

// Define the initial state using that type
const initialState = {
    enabled: false,
};

export const darkModeSlice = createSlice({
    name: 'darkMode',
    // `createSlice` will infer the state type from the `initialState` argument
    initialState,
    reducers: {
        setDarkMode: (state, action) => {
            state.enabled = action.payload;
        },
    },
});

export const { setDarkMode } = darkModeSlice.actions;


// Other code such as selectors can use the imported `RootState` type
export const selectDarkModeEnabled = (state: RootState) => state.darkMode.enabled;

