import { Action, ThunkAction, configureStore } from '@reduxjs/toolkit';
import * as Sentry from '@sentry/react-native';
import {
    blurRadiusSlice,
    darkModeSlice,
    devModeSlice,
    favsSlice,
    playlistsSlice,
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
        playlists: playlistsSlice.reducer,
    },
    enhancers: (getDefaultEnhancers) => (
        getDefaultEnhancers().concat(sentryReduxEnhancer)
    ),
    middleware: (getDefaultMiddleware) => (
        getDefaultMiddleware({ serializableCheck: false })
    ),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export type AppThunk<ReturnType = void> = ThunkAction<
    ReturnType,
    RootState,
    unknown,
    Action<string>
>;
