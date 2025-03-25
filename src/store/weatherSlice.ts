import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { WeatherData, ForecastData, LocationSearchResult } from '../services/weatherService';

interface WeatherState {
  currentWeather: WeatherData | null;
  forecast: ForecastData | null;
  recentSearches: string[];
  searchResults: LocationSearchResult[];
  loading: boolean;
  error: string | null;
}

const initialState: WeatherState = {
  currentWeather: null,
  forecast: null,
  recentSearches: JSON.parse(localStorage.getItem('recentSearches') || '[]'),
  searchResults: [],
  loading: false,
  error: null,
};

const weatherSlice = createSlice({
  name: 'weather',
  initialState,
  reducers: {
    setCurrentWeather: (state, action: PayloadAction<WeatherData>) => {
      state.currentWeather = action.payload;
    },
    setForecast: (state, action: PayloadAction<ForecastData>) => {
      state.forecast = action.payload;
    },
    addRecentSearch: (state, action: PayloadAction<string>) => {
      const newSearches = [action.payload, ...state.recentSearches.filter(s => s !== action.payload)].slice(0, 5);
      state.recentSearches = newSearches;
      localStorage.setItem('recentSearches', JSON.stringify(newSearches));
    },
    removeRecentSearch: (state, action: PayloadAction<string>) => {
      state.recentSearches = state.recentSearches.filter(s => s !== action.payload);
      localStorage.setItem('recentSearches', JSON.stringify(state.recentSearches));
    },
    setSearchResults: (state, action: PayloadAction<LocationSearchResult[]>) => {
      state.searchResults = action.payload;
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
  },
});

export const {
  setCurrentWeather,
  setForecast,
  addRecentSearch,
  removeRecentSearch,
  setSearchResults,
  setLoading,
  setError,
} = weatherSlice.actions;

export default weatherSlice.reducer; 