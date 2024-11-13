import {
    Action,
    ThunkAction,
    combineReducers,
    configureStore,
} from '@reduxjs/toolkit';
import * as Sentry from '@sentry/react-native';
import { persistReducer, persistStore } from 'redux-persist';
import { reduxStorage } from '../utils/reduxPersistMMKV';
import {
    blurRadiusSlice,
    darkModeSlice,
    devModeSlice,
    favsSlice,
    playlistsSlice,
    queueSlice,
    userSlice,
} from './slices';

const persistConfig = {
    key: 'root',
    storage: reduxStorage
};

const rootReducers = combineReducers({
    darkMode: darkModeSlice.reducer,
    blurRadius: blurRadiusSlice.reducer,
    devMode: devModeSlice.reducer,
    queue: queueSlice.reducer,
    favs: favsSlice.reducer,
    user: userSlice.reducer,
    playlists: playlistsSlice.reducer,
});

const persistedReducer = persistReducer(persistConfig, rootReducers);

const sentryReduxEnhancer = Sentry.createReduxEnhancer();

export const store = configureStore({
    reducer: persistedReducer,
    enhancers: (getDefaultEnhancers) => (
        getDefaultEnhancers().concat(sentryReduxEnhancer)
    ),
    middleware: (getDefaultMiddleware) => (
        getDefaultMiddleware({
            serializableCheck: false,
            immutableCheck: false,
        })
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

export const persister = persistStore(store);
