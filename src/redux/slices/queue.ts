import { PayloadAction, createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import TrackPlayer from "react-native-track-player";
import { TrackType } from "../../services/GetTracksService";
import { StateKeys } from "../../utils/stateKeys";
import { RootState } from "../store";

const initialState = {
  value: [] as TrackType[],
};

export const setQueueAsync = createAsyncThunk(
  `${StateKeys.Queue}/setQueueAsync`,
  async (tracks: TrackType[], { dispatch }) => {
    await TrackPlayer.setQueue(tracks);
    dispatch(setQueue(tracks));
  },
);

export const addToQueueAsync = createAsyncThunk(
  `${StateKeys.Queue}/addToQueueAsync`,
  async (track: TrackType, { getState, dispatch }) => {
    const state = getState() as RootState;
    const existIndex = state.queue.value.findIndex((t) => t.id === track.id);
    if (existIndex === -1) {
      await TrackPlayer.add(track);
      dispatch(addToQueue(track));
    }
    return existIndex === -1;
  },
);

export const removeFromQueueAsync = createAsyncThunk(
  `${StateKeys.Queue}/removeFromQueueAsync`,
  async (index: number, { dispatch }) => {
    await TrackPlayer.remove(index);
    dispatch(removeFromQueue(index));
  },
);

export const clearQueueAsync = createAsyncThunk(
  `${StateKeys.Queue}/clearQueueAsync`,
  async (_, { dispatch }) => {
    await TrackPlayer.reset();
    dispatch(clearQueue());
  },
);

export const clearAddOneAsync = createAsyncThunk(
  `${StateKeys.Queue}/clearAddOneAsync`,
  async (track: TrackType, { dispatch }) => {
    TrackPlayer.setQueue([track]);
    dispatch(clearAddOne(track));
  },
);

export const queueSlice = createSlice({
  name: StateKeys.Queue,
  initialState,
  reducers: {
    setQueue: (state, action: PayloadAction<TrackType[]>) => {
      state.value = action.payload;
    },
    addToQueue: (state, action: PayloadAction<TrackType>) => {
      state.value.push(action.payload);
    },
    removeFromQueue: (state, action: PayloadAction<number>) => {
      state.value.splice(action.payload, 1);
    },
    clearQueue: (state) => {
      state.value = [];
    },
    clearAddOne: (state, action: PayloadAction<TrackType>) => {
      state.value = [];
      state.value.push(action.payload);
    },
  },
});

export const {
  setQueue,
  addToQueue,
  removeFromQueue,
  clearQueue,
  clearAddOne,
} = queueSlice.actions;

export const queue = (state: RootState) => state.queue.value;
