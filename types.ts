import React from 'react';

export interface ChatMessage {
    role: 'user' | 'model';
    text: string;
}

export interface FeatureCardProps {
    title: string;
    description: string;
    icon: React.ReactNode;
    delay?: number;
}

export interface WeatherResponse {
    condition: string;
    conditionId: number;
    temp: number;
    feelsLike: number;
    humidity: number;
    windSpeed: number;
    windDeg: number;
    clouds: number;
    visibility: number;
    sunrise: number;
    sunset: number;
    dt: number;
    icon: string;
}

export type TimePhase = 'night' | 'dawn' | 'sunrise' | 'day' | 'sunset' | 'dusk';
export type WeatherCondition = 'clear' | 'clouds_few' | 'clouds_heavy' | 'rain' | 'drizzle' | 'snow' | 'thunderstorm' | 'fog';