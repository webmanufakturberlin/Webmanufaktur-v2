/// <reference types="vite/client" />

import type { WeatherResponse } from '../types';

// All weather requests go through the backend proxy at /api/weather.
// For dev, `vercel dev` handles /api/* routes (see vite.config.ts proxy).

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
    return await fetchWeatherBackend();
  } catch {
    return null;
  }
}
