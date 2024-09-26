import { createSlice } from '@reduxjs/toolkit';
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
    name: 'user',
    initialState,
    reducers: {
        setUser: (state, action) => {
            state.username = action.payload.username;
            state.id = action.payload.id;
        },
    },
});

export const { setUser } = userSlice.actions;

export const selectUser = (state: RootState) => state.user;
