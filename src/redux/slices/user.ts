import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { StorageKeys } from '../../utils/storageKeys';
import { RootState } from '../store';

export interface UserType {
    username: string;
    id: number;
}

export const initialState = {
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
        },
        resetUser: (state) => {
            state.username = initialState.username;
            state.id = initialState.id;
        },
    },
});

export const { setUser, resetUser } = userSlice.actions;

export const selectUser = (state: RootState) => state.user;
