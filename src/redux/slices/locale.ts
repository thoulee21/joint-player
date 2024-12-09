import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import i18next from 'i18next';
import { getLocales } from 'react-native-localize';
import { StateKeys } from '../../utils/stateKeys';
import { RootState } from '../store';

export type Languages = 'locale' | 'en-US' | 'zh-CN' | 'zh-TW';

const initialState = {
  value: 'locale',
};

export const localeSlice = createSlice({
  name: StateKeys.Locale,
  initialState,
  reducers: {
    // Use the PayloadAction type to declare the contents of `action.payload`
    setLocale: (state, action: PayloadAction<Languages>) => {
      state.value = action.payload;

      const locales = getLocales();
      i18next.changeLanguage(
        action.payload === 'locale'
          ? locales[0].languageTag
          : action.payload
      );
    },
  },
});

export const { setLocale } = localeSlice.actions;

// The function below is called a selector and allows us to select a value from
// the state. Selectors can also be defined inline where they're used instead of
// in the slice file. For example: `useSelector((state: RootState) => state.counter.value)`
export const selectLocale = (state: RootState) => state.locale.value;
