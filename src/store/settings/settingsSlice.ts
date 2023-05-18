
import {createSlice, PayloadAction} from '@reduxjs/toolkit';
import {Lang, isLang, langDefault} from '@/units/lang';
import cookie from 'js-cookie';

interface Settings {
  cookies: Record<string, string>,
  lang: Lang,
}

const settingsDefault: Settings = {
  cookies: {},
  lang: langDefault,
}

export const settingsSlice = createSlice({
  name: 'settings',

  initialState: structuredClone(settingsDefault),

  reducers: {
    setSettingsFromCookies: (state, action: PayloadAction<Record<string, string>>) => {
      const {lang} = action.payload;
      if (isLang(lang)) {
        state.lang = lang as Lang;
        cookie.set('lang', lang);
      }
    },

    setLang: (state, action: PayloadAction<Lang>) => {
      const lang = action.payload;
      state.lang = lang;
      cookie.set('lang', lang);
    },
  },
});

export const { 
  setSettingsFromCookies, 
  setLang 
} = settingsSlice.actions;

export const settingsReducer = settingsSlice.reducer;


