import AsyncStorage from '@react-native-async-storage/async-storage';
import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { StorageKeys } from '../../App';
import { RootState } from '../store';

export interface UserType {
    username: string;
    id: number;
}

const initialState = {
    username: 'thouLee',
    id: 1492028517,
};

export const userSlice = createSlice({
    name: StorageKeys.User,
    initialState,
    reducers: {
        setUser: (state, action: PayloadAction<UserType>) => {
            state.username = action.payload.username;
            state.id = action.payload.id;

            AsyncStorage.setItem(
                StorageKeys.User,
                JSON.stringify(action.payload)
            );
        },
    },
    extraReducers: (builder) => {
        builder.addCase(initUser.fulfilled, (state, action) => {
            state.username = action.payload.username;
            state.id = action.payload.id;
        });
    },
});

export const initUser = createAsyncThunk(
    `${StorageKeys.User}/initUser`,
    async () => {
        const user = await AsyncStorage.getItem(StorageKeys.User);
        return user ? JSON.parse(user) : initialState;
    }
);

export const { setUser } = userSlice.actions;

export const selectUser = (state: RootState) => state.user;
