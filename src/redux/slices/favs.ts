import AsyncStorage from '@react-native-async-storage/async-storage';
import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { StorageKeys } from '../../App';
import { TrackType } from '../../services';
import { RootState } from '../store';

const initialState = {
    value: [] as TrackType[]
};

export const favsSlice = createSlice({
    name: StorageKeys.Favs,
    initialState,
    reducers: {
        setFavs: (state, action: PayloadAction<TrackType[]>) => {
            state.value = action.payload;
            AsyncStorage.setItem(StorageKeys.Favs, JSON.stringify(action.payload));
        },
        addFav: (state, action: PayloadAction<TrackType>) => {
            const existIndex = state.value.findIndex(
                (fav) => fav.id === action.payload.id
            );
            if (existIndex === -1) {
                state.value.push(action.payload);
                AsyncStorage.setItem(StorageKeys.Favs, JSON.stringify(state.value));
            }
        },
        removeFav: (state, action: PayloadAction<number>) => {
            state.value.splice(action.payload, 1);
            AsyncStorage.setItem(StorageKeys.Favs, JSON.stringify(state.value));
        },
        clearFavs: (state) => {
            state.value = [];
            AsyncStorage.removeItem(StorageKeys.Favs);
        }
    },
    extraReducers: (builder) => {
        builder.addCase(initFavs.fulfilled, (state, action) => {
            state.value = action.payload;
        });
    }
});

export const initFavs = createAsyncThunk(
    `${StorageKeys.Favs}/initFavs`,
    async () => {
        const favs = await AsyncStorage.getItem(StorageKeys.Favs);
        return favs ? JSON.parse(favs) : initialState.value;
    }
);

export const { addFav, clearFavs, removeFav, setFavs } = favsSlice.actions;

export const favs = (state: RootState) => state.favs.value;
