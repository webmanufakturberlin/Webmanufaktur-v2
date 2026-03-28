/// <reference types="vite/client" />

import type { WeatherResponse } from '../types';

// Fallback key hardcoded — OWM free tier, only public weather data, no security risk
const OWM_KEY = import.meta.env.VITE_OPENWEATHERMAP_API_KEY || '390f07098e428d0aa2f12d099d47b3cf';
const IS_DEV = import.meta.env.DEV;

const BERLIN_LAT = 52.52;
const BERLIN_LON = 13.405;

async function fetchWeatherDirect(): Promise<WeatherResponse> {

  const url = `https://api.openweathermap.org/data/2.5/weather?lat=${BERLIN_LAT}&lon=${BERLIN_LON}&units=metric&appid=${OWM_KEY}`;
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
  if (IS_DEV) {
    // Dev: direct OWM call (no backend proxy available)
    try {
      return await fetchWeatherDirect();
    } catch (e: any) {
      console.warn('Weather direct fetch failed:', e?.message);
      return null;
    }
  }

  // Production: backend proxy first (same-origin, no CORS issues)
  try {
    return await fetchWeatherBackend();
  } catch (backendError: any) {
    console.warn('Weather backend proxy failed:', backendError?.message);
  }

  // Fallback: try direct OWM (may fail due to CORS)
  try {
    return await fetchWeatherDirect();
  } catch (directError: any) {
    console.warn('Weather direct fetch also failed:', directError?.message);
  }

  return null;
}
