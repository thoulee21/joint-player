import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { TrackType } from '../../services/GetTracksService';
import { Storage } from '../../utils/storage';
import { StorageKeys } from '../../utils/storageKeys';
import { RootState } from '../store';

const initialState = {
    value: [] as TrackType[],
};

export const favsSlice = createSlice({
    name: StorageKeys.Favs,
    initialState,
    reducers: {
        setFavs: (state, action: PayloadAction<TrackType[]>) => {
            state.value = action.payload;
            Storage.set(StorageKeys.Favs, action.payload);
        },
        addFav: (state, action: PayloadAction<TrackType>) => {
            const existIndex = state.value.findIndex(
                (fav) => fav.id === action.payload.id
            );
            if (existIndex === -1) {
                state.value.push(action.payload);
                Storage.set(StorageKeys.Favs, state.value);
            }
        },
        removeFav: (state, action: PayloadAction<TrackType>) => {
            state.value = state.value.filter(
                (fav) => fav.id !== action.payload.id
            );
            Storage.set(StorageKeys.Favs, state.value);
        },
        clearFavs: (state) => {
            state.value = [];
            Storage.set(StorageKeys.Favs, [] as TrackType[]);
        },
    },
    extraReducers: (builder) => {
        builder.addCase(initFavs.fulfilled, (state, action) => {
            state.value = action.payload;
        });
    },
});

export const initFavs = createAsyncThunk(
    `${StorageKeys.Favs}/initFavs`,
    async () => {
        const favs = await Storage.get(StorageKeys.Favs);
        return favs ?? initialState.value;
    }
);

export const { addFav, clearFavs, removeFav, setFavs } = favsSlice.actions;

export const favs = (state: RootState) => state.favs.value;
