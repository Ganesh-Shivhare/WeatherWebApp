import { useEffect, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../store/store';
import {
  setCurrentWeather,
  setForecast,
  setLoading,
  setError,
  setSearchResults,
} from '../store/weatherSlice';
import { weatherService } from '../services/weatherService';

export const useWeather = (location?: string) => {
  const dispatch = useDispatch();
  const { currentWeather, forecast, loading, error } = useSelector(
    (state: RootState) => state.weather
  );

  const fetchWeatherData = useCallback(async (locationName: string) => {
    dispatch(setLoading(true));
    dispatch(setError(null));

    try {
      const [currentData, forecastData] = await Promise.all([
        weatherService.getCurrentWeather(locationName),
        weatherService.getForecast(locationName),
      ]);

      dispatch(setCurrentWeather(currentData));
      dispatch(setForecast(forecastData));
      return currentData;
    } catch (err) {
      dispatch(setError('Failed to fetch weather data'));
      throw err;
    } finally {
      dispatch(setLoading(false));
    }
  }, [dispatch]);

  const searchLocations = useCallback(async (query: string) => {
    if (!query.trim()) {
      dispatch(setSearchResults([]));
      return;
    }

    try {
      const results = await weatherService.searchLocation(query);
      dispatch(setSearchResults(results));
    } catch (err) {
      console.error('Failed to fetch search results:', err);
    }
  }, [dispatch]);

  useEffect(() => {
    if (location) {
      fetchWeatherData(location);
    }
  }, [location, fetchWeatherData]);

  return {
    currentWeather,
    forecast,
    loading,
    error,
    fetchWeatherData,
    searchLocations,
  };
}; 