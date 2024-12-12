import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import TrackPlayer from 'react-native-track-player';
import { StateKeys } from '../../utils/stateKeys';
import { RootState } from '../store';

const initialState = {
  value: 2,
};

export const repeatModeSlice = createSlice({
  name: StateKeys.RepeatMode,
  initialState,
  reducers: {
    // Use the PayloadAction type to declare the contents of `action.payload`
    setRepeatMode: (state, action: PayloadAction<number>) => {
      state.value = action.payload;
      TrackPlayer.setRepeatMode(action.payload);
    },
  },
});

export const { setRepeatMode } = repeatModeSlice.actions;

// The function below is called a selector and allows us to select a value from
// the state. Selectors can also be defined inline where they're used instead of
// in the slice file. For example: `useSelector((state: RootState) => state.counter.value)`
export const selectRepeatMode = (state: RootState) => state.repeatMode.value;
