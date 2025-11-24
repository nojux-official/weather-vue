import express from 'express';
import cors from 'cors';
import Axios from 'axios';
import { setupCache } from 'axios-cache-interceptor';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const API_KEY = process.env.OPENWEATHER_API_KEY;
const PORT = process.env.PROXY_PORT || 3001;
const CACHE_TTL = 10 * 60 * 1000; // 10 minutes

app.use(cors());

const instance = Axios.create();
const axios = setupCache(instance);

const detectQueryType = (data) => {
  if (data.includes(',')) {
    const parts = data.split(',');
    
    // zip code with country code?
    //TODO: fix
    if (parts.length === 2 && /^\d+$/.test(parts[0].trim()) && /^[A-Z]{2}$/i.test(parts[1].trim())) {
      return { type: 'zip', zip: parts[0].trim(), countryCode: parts[1].trim() };
    }
    
    // coordinates (lat,lon both numeric)?
    if (parts.length === 2 && !isNaN(parts[0]) && !isNaN(parts[1])) {
      return { type: 'coords', lat: parts[0].trim(), lon: parts[1].trim() };
    }
  }

  return { type: 'city', city: data };
};

app.get('/weather', async (req, res) => {
  const { data } = req.query;

  if (!data) {
    return res.status(400).json({ error: 'Provide a city name, coordinates (lat,lon), or zip code' });
  }

  if (!API_KEY) {
    return res.status(500).json({ error: 'API key not configured' });
  }

  const query = detectQueryType(data);
  let url;

  try {
    if (query.type === 'city') {
      url = `https://api.openweathermap.org/data/2.5/weather?q=${query.city}&appid=${API_KEY}`;
    } else if (query.type === 'coords') {
      url = `https://api.openweathermap.org/data/2.5/weather?lat=${query.lat}&lon=${query.lon}&appid=${API_KEY}`;
    } else if (query.type === 'zip') {
      url = `https://api.openweathermap.org/data/2.5/weather?zip=${query.zip},${query.countryCode}&appid=${API_KEY}`;
    }

    const response = await axios.get(url, {
      cache: { ttl: CACHE_TTL }
    });

    res.json(response.data);
  } catch (error) {
    res.status(error.response?.status || 500).json({ 
      error: error.response?.data || 'Failed to fetch weather data' 
    });
  }
});

app.listen(PORT, () => {
  console.log(`Proxy server running on http://localhost:${PORT}`);
});