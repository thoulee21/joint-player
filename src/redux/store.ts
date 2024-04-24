import { Action, ThunkAction, configureStore } from '@reduxjs/toolkit';
import {
    blurRadiusSlice,
    darkModeSlice,
    devModeSlice,
    experimentalBlurSlice,
} from './slices';


export const store = configureStore({
    reducer: {
        experimentalBlur: experimentalBlurSlice.reducer,
        darkMode: darkModeSlice.reducer,
        blurRadius: blurRadiusSlice.reducer,
        devMode: devModeSlice.reducer,
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
