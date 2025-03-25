import axios from 'axios';

const API_KEY = process.env.REACT_APP_WEATHER_API_KEY;
const BASE_URL = 'https://api.weatherapi.com/v1';

export interface WeatherData {
  location: {
    name: string;
    region: string;
    country: string;
    lat: number;
    lon: number;
    localtime: string;
  };
  current: {
    temp_c: number;
    temp_f: number;
    condition: {
      text: string;
      icon: string;
    };
    humidity: number;
    wind_kph: number;
    feelslike_c: number;
    pressure_mb: number;
    precip_mm: number;
    uv: number;
    sunrise: string;
    sunset: string;
    last_updated: string;
  };
}

interface HourlyForecast {
  time: string;
  temp_c: number;
  condition: {
    text: string;
    icon: string;
  };
}

interface ForecastDay {
  date: string;
  date_epoch: number;
  day: {
    maxtemp_c: number;
    mintemp_c: number;
    avgtemp_c: number;
    maxwind_kph: number;
    totalprecip_mm: number;
    avghumidity: number;
    condition: {
      text: string;
      icon: string;
    };
  };
  astro: {
    sunrise: string;
    sunset: string;
    moon_phase: string;
  };
  hour: HourlyForecast[];
}

interface Alert {
  headline: string;
  desc: string;
  effective: string;
  expires: string;
}

export interface ForecastData extends WeatherData {
  forecast: {
    forecastday: ForecastDay[];
  };
  alerts?: {
    alert: Alert[];
  };
}

export interface LocationSearchResult {
  id: number;
  name: string;
  region: string;
  country: string;
  lat: number;
  lon: number;
  url: string;
}

// Add a connection check utility
const checkConnection = (): boolean => {
  return navigator.onLine;
};

export const weatherService = {
  async getCurrentWeather(location: string): Promise<WeatherData> {
    if (!checkConnection()) {
      throw new Error('No internet connection available');
    }
    
    try {
      const response = await axios.get(`${BASE_URL}/current.json`, {
        params: {
          key: API_KEY,
          q: location,
          aqi: 'no',
        },
        timeout: 10000, // 10 second timeout
      });
      return response.data;
    } catch (error: any) {
      console.error('Error fetching current weather:', error);
      if (error.response) {
        // The request was made and the server responded with a status code
        // that falls out of the range of 2xx
        throw new Error(`API Error: ${error.response.status} - ${error.response.data.error?.message || 'Unknown error'}`);
      } else if (error.request) {
        // The request was made but no response was received
        throw new Error('Network error: No response from server');
      } else {
        // Something happened in setting up the request that triggered an Error
        throw new Error(`Request error: ${error.message}`);
      }
    }
  },

  async getCurrentLocationWeather(lat: number, lon: number): Promise<WeatherData> {
    if (!checkConnection()) {
      throw new Error('No internet connection available');
    }
    
    try {
      const response = await axios.get(`${BASE_URL}/current.json`, {
        params: {
          key: API_KEY,
          q: `${lat},${lon}`,
          aqi: 'no',
        },
        timeout: 10000, // 10 second timeout
      });
      return response.data;
    } catch (error: any) {
      console.error('Error fetching location weather:', error);
      if (error.response) {
        throw new Error(`API Error: ${error.response.status} - ${error.response.data.error?.message || 'Unknown error'}`);
      } else if (error.request) {
        throw new Error('Network error: No response from server');
      } else {
        throw new Error(`Request error: ${error.message}`);
      }
    }
  },

  async getForecast(location: string): Promise<ForecastData> {
    if (!checkConnection()) {
      throw new Error('No internet connection available');
    }
    
    try {
      const response = await axios.get(`${BASE_URL}/forecast.json`, {
        params: {
          key: API_KEY,
          q: location,
          days: 14,
          aqi: 'no',
          alerts: 'no',
        },
        timeout: 10000, // 10 second timeout
      });
      return response.data;
    } catch (error: any) {
      console.error('Error fetching forecast:', error);
      if (error.response) {
        throw new Error(`API Error: ${error.response.status} - ${error.response.data.error?.message || 'Unknown error'}`);
      } else if (error.request) {
        throw new Error('Network error: No response from server');
      } else {
        throw new Error(`Request error: ${error.message}`);
      }
    }
  },

  async searchLocation(query: string): Promise<LocationSearchResult[]> {
    if (!checkConnection()) {
      throw new Error('No internet connection available');
    }
    
    try {
      const response = await axios.get(`${BASE_URL}/search.json`, {
        params: {
          key: API_KEY,
          q: query,
        },
        timeout: 10000, // 10 second timeout
      });
      return response.data;
    } catch (error: any) {
      console.error('Error searching locations:', error);
      if (error.response) {
        throw new Error(`API Error: ${error.response.status} - ${error.response.data.error?.message || 'Unknown error'}`);
      } else if (error.request) {
        throw new Error('Network error: No response from server');
      } else {
        throw new Error(`Request error: ${error.message}`);
      }
    }
  },
}; 