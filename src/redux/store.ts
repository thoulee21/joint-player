import { Action, ThunkAction, configureStore } from '@reduxjs/toolkit';
import * as Sentry from '@sentry/react-native';
import {
    blurRadiusSlice,
    darkModeSlice,
    devModeSlice,
    favsSlice,
    queueSlice,
    userSlice,
} from './slices';

const sentryReduxEnhancer = Sentry.createReduxEnhancer();

export const store = configureStore({
    reducer: {
        darkMode: darkModeSlice.reducer,
        blurRadius: blurRadiusSlice.reducer,
        devMode: devModeSlice.reducer,
        queue: queueSlice.reducer,
        favs: favsSlice.reducer,
        user: userSlice.reducer,
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
