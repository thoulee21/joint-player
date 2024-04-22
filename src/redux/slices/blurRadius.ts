import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '../store';

interface BlurRadiusState {
    value: number;
}

const initialState: BlurRadiusState = {
    value: 50,
};

export const blurRadiusSlice = createSlice({
    name: 'blurRadius',
    initialState,
    reducers: {
        // Use the PayloadAction type to declare the contents of `action.payload`
        setBlurRadius: (state, action: PayloadAction<number>) => {
            state.value = action.payload;
        },
    },
});

export const { setBlurRadius } = blurRadiusSlice.actions;

// The function below is called a selector and allows us to select a value from
// the state. Selectors can also be defined inline where they're used instead of
// in the slice file. For example: `useSelector((state: RootState) => state.counter.value)`
export const blurRadius = (state: RootState) => state.blurRadius.value;
