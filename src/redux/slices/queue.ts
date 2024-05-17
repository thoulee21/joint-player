import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '../store';
import { TrackType } from '../../services';

interface QueueState {
    value: TrackType[];
}

const initialState: QueueState = {
    value: []
};

export const queueSlice = createSlice({
    name: 'queue',
    initialState,
    reducers: {
        // Use the PayloadAction type to declare the contents of `action.payload`
        setQueue: (state, action: PayloadAction<TrackType[]>) => {
            state.value = action.payload;
        },
        addToQueue: (state, action: PayloadAction<TrackType>) => {
            // Check if the track is already in the queue
            if (!state.value.find(track => track.id === action.payload.id)) {
                state.value.push(action.payload);
            }
        },
        removeFromQueue: (state, action: PayloadAction<number>) => {
            state.value.splice(action.payload, 1);
        },
        clearQueue: (state) => {
            state.value = [];
        }
    },
});

export const { setQueue, addToQueue, removeFromQueue, clearQueue } = queueSlice.actions;

export const queue = (state: RootState) => state.queue.value;
