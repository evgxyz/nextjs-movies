
import {createSlice, PayloadAction, createAsyncThunk} from '@reduxjs/toolkit';
import {RootState} from '@/store';
import {ReqStatus} from '@/units/status';
import {
  FilmSearchOptions, filmSearchOptionsDefault,
  FilmSearchParams, filmSearchParamsDefault,
  FilmSearchResults, filmSearchResultsDefault
} from '@/units/film';
import {
  apiFetchFilmSearchResults, 
  apiFetchFilmSearchOptions,
} from '@/api/filmApi';

interface FilmSearchState {
  options: FilmSearchOptions,
  params: FilmSearchParams,
  results: FilmSearchResults,
  reqStatus: ReqStatus,
}

const filmSearchStateDefault: FilmSearchState = {
  options: filmSearchOptionsDefault,
  params: filmSearchParamsDefault,
  results: filmSearchResultsDefault,
  reqStatus: ReqStatus.NONE,
}

const filmSearchSlice = createSlice({
  name: 'filmSearch',

  initialState: structuredClone(filmSearchStateDefault),

  reducers: {
    setFilmSearchParams: (state, action: PayloadAction<FilmSearchParams>) => {
      state.params = action.payload;
    },

    updateFilmSearchParams: (state, action: PayloadAction<FilmSearchParams>) => {
      state.params = Object.assign(state.params, action.payload);
    },
  },

  extraReducers: builder => {
    builder
      //fetchFilmSearchOptions
      .addCase(
        fetchFilmSearchOptions.pending, 
        (state) => {
          state.options = structuredClone(filmSearchOptionsDefault);
          state.reqStatus = ReqStatus.LOADING;
        }
      )
      .addCase(
        fetchFilmSearchOptions.fulfilled, 
        (state, action) => {
          state.options = action.payload;
          state.reqStatus = ReqStatus.OK;
        }
      )
      .addCase(
        fetchFilmSearchOptions.rejected, 
        (state, action) => {
          state.reqStatus = action.payload ?? ReqStatus.ERROR;
        }
      )
      //fetchFilmSearchResults
      .addCase(
        fetchFilmSearchResults.pending, 
        (state) => {
          state.results = structuredClone(filmSearchResultsDefault);
          state.reqStatus = ReqStatus.LOADING;
        }
      )
      .addCase(
        fetchFilmSearchResults.fulfilled, 
        (state, action) => {
          state.results = action.payload;
          state.reqStatus = ReqStatus.OK;
        }
      )
      .addCase(
        fetchFilmSearchResults.rejected, 
        (state, action) => {
          state.reqStatus = action.payload ?? ReqStatus.ERROR;
        }
      )
  }
});

export const fetchFilmSearchOptions = 
createAsyncThunk<FilmSearchOptions, void, {state: RootState, rejectValue: ReqStatus}>(
    'filmSearch/fetchFilmSearchOptions',
    async function (_unused, ThunkAPI) {
      const lang = ThunkAPI.getState().settings.lang;
      const {reqStatus, options} = await apiFetchFilmSearchOptions(lang);
      if (reqStatus === ReqStatus.OK && options) {
        return ThunkAPI.fulfillWithValue(options)
      } else {
        return ThunkAPI.rejectWithValue(reqStatus)
      } 
    }
);

export const fetchFilmSearchResults = 
  createAsyncThunk<FilmSearchResults, void, {state: RootState, rejectValue: ReqStatus}>(
    'filmSearch/fetchFilmSearchResults',
    async function (_unused, ThunkAPI) {
      const lang = ThunkAPI.getState().settings.lang;
      const params = ThunkAPI.getState().filmSearch.params;
      const {reqStatus, results} = await apiFetchFilmSearchResults(params, lang);
      if (reqStatus === ReqStatus.OK && results) {
        return ThunkAPI.fulfillWithValue(results)
      } else {
        return ThunkAPI.rejectWithValue(reqStatus)
      } 
    }
);

export const {
  setFilmSearchParams,
  updateFilmSearchParams,
} = filmSearchSlice.actions;

export const filmSearchReducer = filmSearchSlice.reducer; 
