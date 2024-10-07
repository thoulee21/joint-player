import AsyncStorage from '@react-native-async-storage/async-storage';
import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { StorageKeys } from '../../App';
import { RootState } from '../store';

const initialState = {
    value: 50,
};

export const blurRadiusSlice = createSlice({
    name: StorageKeys.BlurRadius,
    initialState,
    reducers: {
        // Use the PayloadAction type to declare the contents of `action.payload`
        setBlurRadius: (state, action: PayloadAction<number>) => {
            state.value = action.payload;
            AsyncStorage.setItem(
                StorageKeys.BlurRadius, JSON.stringify(action.payload)
            );
        },
    },
    extraReducers: (builder) => {
        builder.addCase(initBlurRadius.fulfilled, (state, action) => {
            state.value = action.payload;
        });
    },
});

export const initBlurRadius = createAsyncThunk(
    `${StorageKeys.BlurRadius}/initBlurRadius`,
    async () => {
        const blurRadius = await AsyncStorage.getItem(StorageKeys.BlurRadius);
        return blurRadius ? Number(blurRadius) : initialState.value;
    }
);

export const { setBlurRadius } = blurRadiusSlice.actions;

// The function below is called a selector and allows us to select a value from
// the state. Selectors can also be defined inline where they're used instead of
// in the slice file. For example: `useSelector((state: RootState) => state.counter.value)`
export const blurRadius = (state: RootState) => state.blurRadius.value;
