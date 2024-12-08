import {
  Action,
  ThunkAction,
  combineReducers,
  configureStore,
} from '@reduxjs/toolkit';
import * as Sentry from '@sentry/react-native';
import { persistReducer, persistStore } from 'redux-persist';
import { reduxStorage } from '../utils/reduxPersistMMKV';
import { StateKeys } from '../utils/stateKeys';
import {
  blurRadiusSlice,
  darkModeSlice,
  devModeSlice,
  favsSlice,
  localeSlice,
  playlistsSlice,
  queueSlice,
  repeatModeSlice,
  rippleEffectsSlice,
  searchHistorySlice,
  userSlice,
} from './slices';

const rootReducers = combineReducers({
  darkMode: darkModeSlice.reducer,
  blurRadius: blurRadiusSlice.reducer,
  devMode: devModeSlice.reducer,
  queue: queueSlice.reducer,
  favs: favsSlice.reducer,
  user: userSlice.reducer,
  playlists: playlistsSlice.reducer,
  searchHistory: searchHistorySlice.reducer,
  rippleEffect: rippleEffectsSlice.reducer,
  repeatMode: repeatModeSlice.reducer,
  locale: localeSlice.reducer,
});

const persistedReducer = persistReducer(
  {
    key: 'root',
    storage: reduxStorage,
    blacklist: [
      StateKeys.DarkMode,
    ],
  },
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
