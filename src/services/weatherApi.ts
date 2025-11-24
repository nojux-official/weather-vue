import Axios from 'axios';
import { setupCache } from 'axios-cache-interceptor';

const SERVER_BASE = 'http://127.0.0.1:3001';

const instance = Axios.create();
const axios = setupCache(instance);

function fetchWeather(query: string) {
  return axios.get(`${SERVER_BASE}/weather?data=${query}`, {
    responseType: 'json',
  });
}

export { fetchWeather };
