import { createSlice } from '@reduxjs/toolkit';
import { RootState } from '../store';

// Define a type for the slice state
interface ExperimentalBlurState {
    enabled: boolean;
}

// Define the initial state using that type
const initialState: ExperimentalBlurState = {
    enabled: false,
};

export const experimentalBlurSlice = createSlice({
    name: 'experimentalBlur',
    // `createSlice` will infer the state type from the `initialState` argument
    initialState,
    reducers: {
        toggleBlur: (state) => {
            state.enabled = !state.enabled;
        },
    },
});

export const { toggleBlur } = experimentalBlurSlice.actions;

// Other code such as selectors can use the imported `RootState` type
export const selectBlurEnabled = (state: RootState) => state.experimentalBlur.enabled;

