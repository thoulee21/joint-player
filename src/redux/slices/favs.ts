import AsyncStorage from '@react-native-async-storage/async-storage';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { StorageKeys } from '../../App';
import { TrackType } from '../../services';
import { RootState } from '../store';

const initialState = {
    value: [] as TrackType[]
};

export const favsSlice = createSlice({
    name: 'favs',
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
});

export const { addFav, clearFavs, removeFav, setFavs } = favsSlice.actions;

export const favs = (state: RootState) => state.favs.value;
