import { Action, ThunkAction, configureStore } from '@reduxjs/toolkit';
import * as Sentry from '@sentry/react-native';
import {
    blurRadiusSlice,
    darkModeSlice,
    devModeSlice,
    experimentalBlurSlice,
    queueSlice,
} from './slices';

const sentryReduxEnhancer = Sentry.createReduxEnhancer();

export const store = configureStore({
    reducer: {
        experimentalBlur: experimentalBlurSlice.reducer,
        darkMode: darkModeSlice.reducer,
        blurRadius: blurRadiusSlice.reducer,
        devMode: devModeSlice.reducer,
        queue: queueSlice.reducer,
    },
    enhancers: (getDefaultEnhancers) => {
        return getDefaultEnhancers().concat(sentryReduxEnhancer);
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
