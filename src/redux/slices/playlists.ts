import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { StateKeys } from '../../utils/storageKeys';
import { RootState } from '../store';

export type PlaylistType = {
    playlistID: number;
    name: string;
}

const initialState = {
    value: [] as PlaylistType[],
};

export const playlistsSlice = createSlice({
    name: StateKeys.Playlists,
    initialState,
    reducers: {
        setPlaylists: (state, action: PayloadAction<PlaylistType[]>) => {
            state.value = action.payload;
        },
        addPlaylist: (state, action: PayloadAction<PlaylistType>) => {
            const existIndex = state.value.findIndex(
                (playlist) => playlist.playlistID === action.payload.playlistID
            );
            if (existIndex === -1) {
                state.value.push(action.payload);
            }
        },
        removePlaylist: (state, action: PayloadAction<PlaylistType>) => {
            state.value = state.value.filter(
                (playlist) => playlist.playlistID !== action.payload.playlistID
            );
        },
        clearPlaylists: (state) => {
            state.value = [];
        },
    },
});

export const { addPlaylist, clearPlaylists, removePlaylist, setPlaylists } = playlistsSlice.actions;

export const selectPlaylists = (state: RootState) => state.playlists.value;
