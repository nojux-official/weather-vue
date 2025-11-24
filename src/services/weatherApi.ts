import Axios from 'axios';
import { setupCache } from 'axios-cache-interceptor';
import type { WeatherForecast } from '@/App.vue';

const SERVER_BASE = 'http://127.0.0.1:3001';

const instance = Axios.create();
const axios = setupCache(instance);

function fetchWeather(query: string) {
  return axios.get(`${SERVER_BASE}/weather?data=${query}`, {
    responseType: 'json',
  });
}
export interface WeatherForecast {
  id: string
  city: string
  country: string
  zip: string
  coordinates: string
  temperature: number
  humidity: number
  windSpeed: number
  pressure: number
  sunrise: string
  sunset: string
  weatherCondition: string
  weatherImage: string
}


function parseWeatherData(data: any): WeatherForecast {
  return {
    id: data.id,
    city: data.name,
    country: data.sys.country,
    zip: data.zip || '',
    coordinates: `${data.coord.lat},${data.coord.lon}`,
    temperature: data.main.temp,
    humidity: data.main.humidity,
    windSpeed: data.wind.speed,
    pressure: data.main.pressure,
    sunrise: new Date(data.sys.sunrise * 1000).toISOString(),
    sunset: new Date(data.sys.sunset * 1000).toISOString(),
    weatherCondition: data.weather[0].main,
    weatherImage: `https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`
  };
}

export { fetchWeather, parseWeatherData };
