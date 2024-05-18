import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { TrackType } from '../../services';
import { RootState } from '../store';

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
            //去除重复后添加
            const existIndex = state.value.findIndex(
                (track) => track.id === action.payload.id
            );
            if (existIndex === -1) {
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
