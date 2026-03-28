/// <reference types="vite/client" />

import type { WeatherResponse } from '../types';

const DEV_API_KEY = import.meta.env.VITE_OPENWEATHERMAP_API_KEY;
const IS_DEV = import.meta.env.DEV;

const BERLIN_LAT = 52.52;
const BERLIN_LON = 13.405;

async function fetchWeatherDirect(): Promise<WeatherResponse> {
  if (!DEV_API_KEY) {
    throw new Error('VITE_OPENWEATHERMAP_API_KEY not set for dev mode');
  }

  const url = `https://api.openweathermap.org/data/2.5/weather?lat=${BERLIN_LAT}&lon=${BERLIN_LON}&units=metric&appid=${DEV_API_KEY}`;
  const response = await fetch(url, { signal: AbortSignal.timeout(10000) });

  if (!response.ok) {
    throw new Error(`OWM API returned ${response.status}`);
  }

  const raw = await response.json();

  return {
    condition: raw.weather?.[0]?.main || 'Clear',
    conditionId: raw.weather?.[0]?.id || 800,
    temp: Math.round(raw.main?.temp ?? 15),
    feelsLike: Math.round(raw.main?.feels_like ?? 15),
    humidity: raw.main?.humidity ?? 50,
    windSpeed: raw.wind?.speed ?? 0,
    windDeg: raw.wind?.deg ?? 0,
    clouds: raw.clouds?.all ?? 0,
    visibility: raw.visibility ?? 10000,
    sunrise: raw.sys?.sunrise ?? 0,
    sunset: raw.sys?.sunset ?? 0,
    dt: raw.dt ?? Math.floor(Date.now() / 1000),
    icon: raw.weather?.[0]?.icon || '01d',
  };
}

async function fetchWeatherBackend(): Promise<WeatherResponse> {
  const response = await fetch('/api/weather', {
    signal: AbortSignal.timeout(10000),
  });

  if (!response.ok) {
    throw new Error(`Backend returned ${response.status}`);
  }

  return response.json();
}

export async function fetchBerlinWeather(): Promise<WeatherResponse | null> {
  try {
    if (IS_DEV) {
      return await fetchWeatherDirect();
    }
    return await fetchWeatherBackend();
  } catch (error: any) {
    console.warn('Weather fetch failed:', error?.message);
    return null;
  }
}
