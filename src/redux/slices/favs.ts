import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { TrackType } from "../../services/GetTracksService";
import { StateKeys } from "../../utils/stateKeys";
import { RootState } from "../store";

const initialState = {
  value: [] as TrackType[],
};

export const favsSlice = createSlice({
  name: StateKeys.Favs,
  initialState,
  reducers: {
    setFavs: (state, action: PayloadAction<TrackType[]>) => {
      state.value = action.payload;
    },
    addFav: (state, action: PayloadAction<TrackType>) => {
      const existIndex = state.value.findIndex(
        (fav) => fav.id === action.payload.id,
      );
      if (existIndex === -1) {
        state.value.push(action.payload);
      }
    },
    removeFav: (state, action: PayloadAction<TrackType>) => {
      state.value = state.value.filter((fav) => fav.id !== action.payload.id);
    },
    clearFavs: (state) => {
      state.value = [];
    },
  },
});

export const { addFav, clearFavs, removeFav, setFavs } = favsSlice.actions;

export const favs = (state: RootState) => state.favs.value;
