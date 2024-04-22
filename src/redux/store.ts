import { Action, ThunkAction, configureStore } from '@reduxjs/toolkit';
import { darkModeSlice, experimentalBlurSlice } from './slices';

export const store = configureStore({
    reducer: {
        experimentalBlur: experimentalBlurSlice.reducer,
        darkMode: darkModeSlice.reducer,
    },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export type AppThunk<ReturnType = void> = ThunkAction<
    ReturnType,
    RootState,
    unknown,
    Action<string>
>;
