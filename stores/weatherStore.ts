import { create } from 'zustand';
import { fetchBerlinWeather } from '../services/weatherService';
import type { WeatherResponse, TimePhase, WeatherCondition } from '../types';

// Transition durations in seconds
const GOLDEN_HOUR = 30 * 60; // 30 minutes
const TWILIGHT = 40 * 60;    // 40 minutes

export interface WeatherState {
  raw: WeatherResponse | null;
  timePhase: TimePhase;
  sunProgress: number;
  weatherCondition: WeatherCondition;
  cloudDensity: number;
  fogDensity: number;
  windStrength: number;
  isNight: boolean;
  isLoading: boolean;
  lastFetch: number | null;
  error: string | null;

  fetchWeather: () => Promise<void>;
  updateTimePhase: () => void;
  startPolling: () => () => void;
}

function calcTimePhase(now: number, sunrise: number, sunset: number): TimePhase {
  if (now < sunrise - TWILIGHT) return 'night';
  if (now < sunrise - GOLDEN_HOUR) return 'dawn';
  if (now < sunrise + GOLDEN_HOUR) return 'sunrise';
  if (now < sunset - GOLDEN_HOUR) return 'day';
  if (now < sunset + GOLDEN_HOUR) return 'sunset';
  if (now < sunset + TWILIGHT) return 'dusk';
  return 'night';
}

function calcSunProgress(now: number, sunrise: number, sunset: number): number {
  if (now <= sunrise) return 0;
  if (now >= sunset) return 1;
  return (now - sunrise) / (sunset - sunrise);
}

function mapCondition(conditionId: number, clouds: number): WeatherCondition {
  if (conditionId >= 200 && conditionId < 300) return 'thunderstorm';
  if (conditionId >= 300 && conditionId < 400) return 'drizzle';
  if (conditionId >= 500 && conditionId < 600) return 'rain';
  if (conditionId >= 600 && conditionId < 700) return 'snow';
  if (conditionId >= 700 && conditionId < 800) return 'fog';
  if (conditionId === 800) return 'clear';
  // 801-804: clouds
  if (clouds > 60) return 'clouds_heavy';
  return 'clouds_few';
}

// Fallback sunrise/sunset for Berlin based on month (approximate)
function getFallbackSunTimes(): { sunrise: number; sunset: number } {
  const now = new Date();
  const month = now.getMonth(); // 0-11
  // Approximate Berlin sunrise/sunset hours (UTC) per month
  const sunriseHours = [7.5, 7, 6, 5.5, 4.5, 4, 4.5, 5, 5.5, 6.5, 7, 7.5];
  const sunsetHours = [16, 17, 18, 19, 20, 21, 21, 20, 19, 17.5, 16, 15.5];

  // Use UTC midnight to match UTC-based sunrise/sunset hours
  const todayUnix = Math.floor(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate()) / 1000);

  return {
    sunrise: todayUnix + Math.floor(sunriseHours[month] * 3600),
    sunset: todayUnix + Math.floor(sunsetHours[month] * 3600),
  };
}

export const useWeatherStore = create<WeatherState>((set, get) => ({
  raw: null,
  timePhase: 'day',
  sunProgress: 0.5,
  weatherCondition: 'clear',
  cloudDensity: 0,
  fogDensity: 0.003,
  windStrength: 0,
  isNight: false,
  isLoading: false,
  lastFetch: null,
  error: null,

  fetchWeather: async () => {
    set({ isLoading: true, error: null });

    const data = await fetchBerlinWeather();

    if (data) {
      set({ raw: data, lastFetch: Date.now(), isLoading: false });
      get().updateTimePhase();
    } else {
      set({ isLoading: false, error: 'Fetch failed' });
      // Still update time phase with fallback sun times
      get().updateTimePhase();
    }
  },

  updateTimePhase: () => {
    const { raw } = get();
    const nowUnix = Math.floor(Date.now() / 1000);

    let sunrise: number;
    let sunset: number;

    if (raw && raw.sunrise && raw.sunset) {
      sunrise = raw.sunrise;
      sunset = raw.sunset;
    } else {
      const fallback = getFallbackSunTimes();
      sunrise = fallback.sunrise;
      sunset = fallback.sunset;
    }

    const timePhase = calcTimePhase(nowUnix, sunrise, sunset);
    const sunProgress = calcSunProgress(nowUnix, sunrise, sunset);
    const isNight = timePhase === 'night' || timePhase === 'dusk' || timePhase === 'dawn';

    let weatherCondition: WeatherCondition = 'clear';
    let cloudDensity = 0;
    let fogDensity = 0.003;
    let windStrength = 0;

    if (raw) {
      weatherCondition = mapCondition(raw.conditionId, raw.clouds);
      cloudDensity = raw.clouds / 100;
      windStrength = Math.min(raw.windSpeed / 15, 1); // normalize: 15 m/s = 1.0

      // Fog density based on visibility + weather condition
      const visFactor = 1 - Math.min(raw.visibility / 10000, 1);
      fogDensity = 0.003 + visFactor * 0.012; // 0.003 (clear) to 0.015 (zero visibility)

      if (weatherCondition === 'fog') fogDensity = Math.max(fogDensity, 0.012);
      if (weatherCondition === 'rain' || weatherCondition === 'thunderstorm') fogDensity = Math.max(fogDensity, 0.007);
      if (weatherCondition === 'snow') fogDensity = Math.max(fogDensity, 0.009);
      if (isNight) fogDensity = Math.max(fogDensity, 0.005);
    }

    set({
      timePhase,
      sunProgress,
      isNight,
      weatherCondition,
      cloudDensity,
      fogDensity,
      windStrength,
    });
  },

  startPolling: () => {
    // Fetch immediately
    get().fetchWeather();

    // Poll weather every 10 minutes
    const weatherInterval = setInterval(() => {
      get().fetchWeather();
    }, 10 * 60 * 1000);

    // Update time phase every 60 seconds (for smooth day/night transitions)
    const timeInterval = setInterval(() => {
      get().updateTimePhase();
    }, 60 * 1000);

    return () => {
      clearInterval(weatherInterval);
      clearInterval(timeInterval);
    };
  },
}));
