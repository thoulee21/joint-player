import { createSlice } from '@reduxjs/toolkit';
import { StateKeys } from '../../utils/stateKeys';
import { RootState } from '../store';

const initialState = {
    value: __DEV__,
};

export const devModeSlice = createSlice({
    name: StateKeys.DevMode,
    // `createSlice` will infer the state type from the `initialState` argument
    initialState,
    reducers: {
        toggleDevModeValue: (state) => {
            state.value = !state.value;
        },
        setDevModeValue: (state, action) => {
            state.value = action.payload;
        },
    },
});

export const { toggleDevModeValue, setDevModeValue } = devModeSlice.actions;


// Other code such as selectors can use the imported `RootState` type
export const selectDevModeEnabled = (state: RootState) => state.devMode.value;

