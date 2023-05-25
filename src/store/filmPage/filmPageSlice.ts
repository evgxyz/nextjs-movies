
import {createSlice, PayloadAction, createAsyncThunk} from '@reduxjs/toolkit';
import {RootState} from '@/store';
import {ReqStatus} from '@/units/status';
import {Film, FilmId, filmDefault} from '@/units/film';
import {apiFetchFilmPage} from '@/api/filmApi';

interface FilmPageState {
  film: Film,
  reqStatus: {
    film: ReqStatus,
  }
}

const filmPageStateDefault: FilmPageState = {
  film: filmDefault,
  reqStatus: {
    film: ReqStatus.NONE
  },
}

const filmPageSlice = createSlice({
  name: 'filmPage',

  initialState: structuredClone(filmPageStateDefault),

  reducers: {
    setFilmPageState: (state, action: PayloadAction<FilmPageState>) => {
      state = action.payload;
    },
  },

  extraReducers: builder => {
    builder
      .addCase(
        fetchFilmPage.pending, 
        (state) => {
          state.reqStatus.film = ReqStatus.LOADING;
        }
      )
      .addCase(
        fetchFilmPage.fulfilled, 
        (state, action) => {
          state.film = action.payload;
          state.reqStatus.film = ReqStatus.OK;
        }
      )
      .addCase(
        fetchFilmPage.rejected, 
        (state, action) => {
          state.film = filmDefault;
          state.reqStatus.film = action.payload ?? ReqStatus.ERROR;
        }
      )
  }
});

export const fetchFilmPage = 
  createAsyncThunk<Film, {filmId: FilmId}, {state: RootState, rejectValue: ReqStatus}>(
    'filmPage/fetchFilmPage',
    async function ({filmId}, ThunkAPI) {
      const lang = ThunkAPI.getState().settings.lang;
      const {reqStatus, film} = await apiFetchFilmPage(filmId, lang);
      if (reqStatus === ReqStatus.OK && film) {
        return ThunkAPI.fulfillWithValue(film)
      } else {
        return ThunkAPI.rejectWithValue(reqStatus)
      } 
    }
);

export const {setFilmPageState} = filmPageSlice.actions;

export const filmPageReducer = filmPageSlice.reducer; 
