import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Storage } from '../../utils/storage';
import { StorageKeys } from '../../utils/storageKeys';
import { RootState } from '../store';

export type PlaylistType = {
    playlistID: number;
    name: string;
}

const initialState = {
    value: [] as PlaylistType[],
};

export const playlistsSlice = createSlice({
    name: StorageKeys.Playlists,
    initialState,
    reducers: {
        setPlaylists: (state, action: PayloadAction<PlaylistType[]>) => {
            state.value = action.payload;
            Storage.set(StorageKeys.Playlists, action.payload);
        },
        addPlaylist: (state, action: PayloadAction<PlaylistType>) => {
            const existIndex = state.value.findIndex(
                (playlist) => playlist.playlistID === action.payload.playlistID
            );
            if (existIndex === -1) {
                state.value.push(action.payload);
                Storage.set(StorageKeys.Playlists, state.value);
            }
        },
        removePlaylist: (state, action: PayloadAction<PlaylistType>) => {
            state.value = state.value.filter(
                (playlist) => playlist.playlistID !== action.payload.playlistID
            );
            Storage.set(StorageKeys.Playlists, state.value);
        },
        clearPlaylists: (state) => {
            state.value = [];
            Storage.set(StorageKeys.Playlists, [] as PlaylistType[]);
        },
    },
    extraReducers: (builder) => {
        builder.addCase(initPlaylists.fulfilled, (state, action) => {
            state.value = action.payload;
        });
    },
});

export const initPlaylists = createAsyncThunk(
    `${StorageKeys.Playlists}/initPlaylists`,
    async () => {
        const playlists = await Storage.get(StorageKeys.Playlists);
        return playlists ?? initialState.value;
    }
);

export const { addPlaylist, clearPlaylists, removePlaylist, setPlaylists } = playlistsSlice.actions;

export const selectPlaylists = (state: RootState) => state.playlists.value;
