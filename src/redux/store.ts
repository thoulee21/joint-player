import {
    Action,
    ThunkAction,
    combineReducers,
    configureStore,
} from '@reduxjs/toolkit';
import * as Sentry from '@sentry/react-native';
import { persistReducer, persistStore } from 'redux-persist';
import { reduxStorage } from '../utils/reduxPersistMMKV';
import { StateKeys } from '../utils/storageKeys';
import {
    blurRadiusSlice,
    darkModeSlice,
    devModeSlice,
    dimezisBlurSlice,
    favsSlice,
    playlistsSlice,
    queueSlice,
    rippleEffectsSlice,
    searchHistorySlice,
    userSlice,
} from './slices';

const persistConfig = {
    key: 'root',
    storage: reduxStorage,
    blacklist: [
        StateKeys.DarkMode,
        StateKeys.DimezisBlur,
    ]
};

const rootReducers = combineReducers({
    darkMode: persistReducer({
        ...persistConfig,
        key: StateKeys.DarkMode
    }, darkModeSlice.reducer),
    blurRadius: persistReducer({
        ...persistConfig,
        key: StateKeys.BlurRadius
    }, blurRadiusSlice.reducer),
    devMode: persistReducer({
        ...persistConfig,
        key: StateKeys.DevMode
    }, devModeSlice.reducer),
    queue: persistReducer({
        ...persistConfig,
        key: StateKeys.Queue
    }, queueSlice.reducer),
    favs: persistReducer({
        ...persistConfig,
        key: StateKeys.Favs
    }, favsSlice.reducer),
    user: persistReducer({
        ...persistConfig,
        key: StateKeys.User
    }, userSlice.reducer),
    playlists: persistReducer({
        ...persistConfig,
        key: StateKeys.Playlists
    }, playlistsSlice.reducer),
    searchHistory: persistReducer({
        ...persistConfig,
        key: StateKeys.SearchHistory
    }, searchHistorySlice.reducer),
    rippleEffect: persistReducer({
        ...persistConfig,
        key: StateKeys.RippleEffect
    }, rippleEffectsSlice.reducer),
    dimezisBlur: persistReducer({
        ...persistConfig,
        key: StateKeys.DimezisBlur
    }, dimezisBlurSlice.reducer),
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
