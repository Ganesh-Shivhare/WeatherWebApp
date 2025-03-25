import axios from 'axios';

const API_KEY = process.env.REACT_APP_WEATHER_API_KEY;
const BASE_URL = 'http://api.weatherapi.com/v1';

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

export const weatherService = {
  async getCurrentWeather(location: string): Promise<WeatherData> {
    const response = await axios.get(`${BASE_URL}/current.json`, {
      params: {
        key: API_KEY,
        q: location,
        aqi: 'no',
      },
    });
    return response.data;
  },

  async getCurrentLocationWeather(lat: number, lon: number): Promise<WeatherData> {
    const response = await axios.get(`${BASE_URL}/current.json`, {
      params: {
        key: API_KEY,
        q: `${lat},${lon}`,
        aqi: 'no',
      },
    });
    return response.data;
  },

  async getForecast(location: string): Promise<ForecastData> {
    const response = await axios.get(`${BASE_URL}/forecast.json`, {
      params: {
        key: API_KEY,
        q: location,
        days: 14,
        aqi: 'no',
        alerts: 'no',
      },
    });
    return response.data;
  },

  async searchLocation(query: string): Promise<LocationSearchResult[]> {
    const response = await axios.get(`${BASE_URL}/search.json`, {
      params: {
        key: API_KEY,
        q: query,
      },
    });
    return response.data;
  },
}; 