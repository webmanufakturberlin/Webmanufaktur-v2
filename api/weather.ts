import type { VercelRequest, VercelResponse } from '@vercel/node';
import type { WeatherResponse } from '../types';

// In-memory cache (resets on cold start, which is fine)
let cache: { data: WeatherResponse; fetchedAt: number } | null = null;
const CACHE_TTL = 10 * 60 * 1000; // 10 minutes

const BERLIN_LAT = 52.52;
const BERLIN_LON = 13.405;

export default async function handler(req: VercelRequest, res: VercelResponse) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // Return cached data if fresh
  const now = Date.now();
  if (cache && now - cache.fetchedAt < CACHE_TTL) {
    return res.status(200).json(cache.data);
  }

  // Fallback key hardcoded — OWM free tier, only public weather data, no security risk
  const apiKey = process.env.OPENWEATHERMAP_API_KEY || '390f07098e428d0aa2f12d099d47b3cf';
  if (!apiKey) {
    // Return stale cache if available
    if (cache) return res.status(200).json(cache.data);
    return res.status(500).json({ error: 'Weather service not configured' });
  }

  try {
    const url = `https://api.openweathermap.org/data/2.5/weather?lat=${BERLIN_LAT}&lon=${BERLIN_LON}&units=metric&appid=${apiKey}`;
    const response = await fetch(url, { signal: AbortSignal.timeout(8000) });

    if (!response.ok) {
      throw new Error(`OWM API returned ${response.status}`);
    }

    const raw = await response.json();

    const data: WeatherResponse = {
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

    cache = { data, fetchedAt: now };
    return res.status(200).json(data);
  } catch {
    // Return stale cache on failure
    if (cache) return res.status(200).json(cache.data);
    return res.status(503).json({ error: 'Weather service unavailable' });
  }
}
