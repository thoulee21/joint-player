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
        'darkMode',
        'queue',
    ]
};

const rootReducers = combineReducers({
    darkMode: persistReducer({
        ...persistConfig,
        key: 'darkMode'
    }, darkModeSlice.reducer),
    blurRadius: persistReducer({
        ...persistConfig,
        key: 'blurRadius'
    }, blurRadiusSlice.reducer),
    devMode: persistReducer({
        ...persistConfig,
        key: 'devMode'
    }, devModeSlice.reducer),
    queue: persistReducer({
        ...persistConfig,
        key: 'queue'
    }, queueSlice.reducer),
    favs: persistReducer({
        ...persistConfig,
        key: 'favs'
    }, favsSlice.reducer),
    user: persistReducer({
        ...persistConfig,
        key: 'user'
    }, userSlice.reducer),
    playlists: persistReducer({
        ...persistConfig,
        key: 'playlists'
    }, playlistsSlice.reducer),
    searchHistory: persistReducer({
        ...persistConfig,
        key: 'searchHistory'
    }, searchHistorySlice.reducer),
    rippleEffect: persistReducer({
        ...persistConfig,
        key: 'rippleEffect'
    }, rippleEffectsSlice.reducer),
    dimezisBlur: persistReducer({
        ...persistConfig,
        key: 'dimezisBlur'
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
