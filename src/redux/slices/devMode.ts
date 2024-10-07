import { createSlice } from '@reduxjs/toolkit';
import { RootState } from '../store';

const initialState = {
    enabled: __DEV__,
};

export const devModeSlice = createSlice({
    name: 'devMode',
    // `createSlice` will infer the state type from the `initialState` argument
    initialState,
    reducers: {
        toggleDevModeValue: (state) => {
            state.enabled = !state.enabled;
        },
        setDevModeValue: (state, action) => {
            state.enabled = action.payload;
        },
    },
});

export const { toggleDevModeValue, setDevModeValue } = devModeSlice.actions;


// Other code such as selectors can use the imported `RootState` type
export const selectDevModeEnabled = (state: RootState) => state.devMode.enabled;

