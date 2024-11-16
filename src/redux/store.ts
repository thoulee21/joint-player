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

const createPersistConfig = (key: string, blacklist: string[] = []) => ({
  key,
  storage: reduxStorage,
  blacklist,
});

const rootReducers = combineReducers({
  darkMode: persistReducer(
    createPersistConfig(StateKeys.DarkMode, ['value']),
    darkModeSlice.reducer
  ),
  blurRadius: persistReducer(
    createPersistConfig(StateKeys.BlurRadius),
    blurRadiusSlice.reducer
  ),
  devMode: persistReducer(
    createPersistConfig(StateKeys.DevMode),
    devModeSlice.reducer
  ),
  queue: persistReducer(
    createPersistConfig(StateKeys.Queue),
    queueSlice.reducer
  ),
  favs: persistReducer(
    createPersistConfig(StateKeys.Favs),
    favsSlice.reducer
  ),
  user: persistReducer(
    createPersistConfig(StateKeys.User),
    userSlice.reducer
  ),
  playlists: persistReducer(
    createPersistConfig(StateKeys.Playlists),
    playlistsSlice.reducer
  ),
  searchHistory: persistReducer(
    createPersistConfig(StateKeys.SearchHistory),
    searchHistorySlice.reducer
  ),
  rippleEffect: persistReducer(
    createPersistConfig(StateKeys.RippleEffect),
    rippleEffectsSlice.reducer
  ),
  dimezisBlur: persistReducer(
    createPersistConfig(StateKeys.DimezisBlur, ['value']),
    dimezisBlurSlice.reducer
  ),
});

const persistedReducer = persistReducer(
  createPersistConfig('root'),
  rootReducers
);

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
