import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Storage } from '../../utils/storage';
import { StorageKeys } from '../../utils/storageKeys';
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
            Storage.set(StorageKeys.User, action.payload);
        },
        resetUser: (state) => {
            state.username = initialState.username;
            state.id = initialState.id;
            Storage.remove(StorageKeys.User);
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
        const user = await Storage.get(StorageKeys.User);
        return user ?? initialState;
    }
);

export const { setUser, resetUser } = userSlice.actions;

export const selectUser = (state: RootState) => state.user;
