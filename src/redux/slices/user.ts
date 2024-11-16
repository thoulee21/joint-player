import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { StateKeys } from '../../utils/storageKeys';
import { RootState } from '../store';

export interface UserType {
    username: string;
    id: number;
}

export const initialState = {
    //TODO: initial user shouldn't be a hardcoded value
    username: 'thouLee',
    id: 1492028517,
};

export const userSlice = createSlice({
    name: StateKeys.User,
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
