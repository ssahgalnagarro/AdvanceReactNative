import axios, { AxiosInstance } from 'axios';
import type { WeatherResponse } from '../types/weather';

const BASE_URL = 'https://api.openweathermap.org/data/2.5';

const client: AxiosInstance = axios.create({
  baseURL: BASE_URL,
  timeout: 10000,
});

export async function fetchWeather(
  latitude: number,
  longitude: number,
  apiKey: string,
): Promise<WeatherResponse> {
  const response = await client.get<WeatherResponse>('/weather', {
    params: {
      lat: latitude,
      lon: longitude,
      units: 'metric',
      appid: apiKey,
    },
  });
  return response.data;
}
