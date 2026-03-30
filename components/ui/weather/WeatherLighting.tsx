import React, { useRef } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import { useWeatherStore } from '../../../stores/weatherStore';
import type { TimePhase, WeatherCondition } from '../../../types';

// Lighting presets: [ambientColor, ambientIntensity, dirColor, dirIntensity, hemiSky, hemiGround, hemiIntensity, fogColor, fogDensity]
interface LightPreset {
  ambient: { color: string; intensity: number };
  directional: { color: string; intensity: number };
  hemisphere: { sky: string; ground: string; intensity: number };
  fog: { color: string; density: number };
}

const PRESETS: Record<string, LightPreset> = {
  clear_day:          { ambient: { color: '#606060', intensity: 1.2 }, directional: { color: '#fff5e0', intensity: 2.5 }, hemisphere: { sky: '#87ceeb', ground: '#3a2a20', intensity: 0.8 }, fog: { color: '#a3dcfc', density: 0.003 } },
  clear_sunrise:      { ambient: { color: '#705040', intensity: 1.0 }, directional: { color: '#ff9060', intensity: 3.0 }, hemisphere: { sky: '#d4755a', ground: '#201510', intensity: 0.6 }, fog: { color: '#d4956a', density: 0.004 } },
  clear_sunset:       { ambient: { color: '#604030', intensity: 1.0 }, directional: { color: '#ff8040', intensity: 3.0 }, hemisphere: { sky: '#c45a3a', ground: '#201510', intensity: 0.6 }, fog: { color: '#c08060', density: 0.004 } },
  clear_night:        { ambient: { color: '#101830', intensity: 0.3 }, directional: { color: '#4060a0', intensity: 0.5 }, hemisphere: { sky: '#050510', ground: '#050505', intensity: 0.15 }, fog: { color: '#080818', density: 0.005 } },
  clear_dawn:         { ambient: { color: '#202840', intensity: 0.5 }, directional: { color: '#6080b0', intensity: 1.0 }, hemisphere: { sky: '#2a3a60', ground: '#101010', intensity: 0.3 }, fog: { color: '#3a4a6a', density: 0.005 } },
  clear_dusk:         { ambient: { color: '#201828', intensity: 0.4 }, directional: { color: '#5040a0', intensity: 0.8 }, hemisphere: { sky: '#2a2040', ground: '#080808', intensity: 0.25 }, fog: { color: '#2a2040', density: 0.005 } },
  clouds_few_day:     { ambient: { color: '#606060', intensity: 1.4 }, directional: { color: '#e0e0d0', intensity: 1.8 }, hemisphere: { sky: '#8a9aaa', ground: '#2a2520', intensity: 0.7 }, fog: { color: '#b0c4d4', density: 0.003 } },
  clouds_heavy_day:   { ambient: { color: '#707070', intensity: 1.8 }, directional: { color: '#c0c0c0', intensity: 0.8 }, hemisphere: { sky: '#808890', ground: '#2a2520', intensity: 0.5 }, fog: { color: '#a0b4c4', density: 0.003 } },
  rain_day:           { ambient: { color: '#606870', intensity: 2.0 }, directional: { color: '#a0b0c0', intensity: 1.2 }, hemisphere: { sky: '#8090a0', ground: '#2a2520', intensity: 0.6 }, fog: { color: '#9aacbb', density: 0.004 } },
  rain_night:         { ambient: { color: '#080810', intensity: 0.25 }, directional: { color: '#203050', intensity: 0.3 }, hemisphere: { sky: '#040408', ground: '#030303', intensity: 0.1 }, fog: { color: '#060610', density: 0.009 } },
  snow_day:           { ambient: { color: '#707880', intensity: 1.6 }, directional: { color: '#c8d0d8', intensity: 1.0 }, hemisphere: { sky: '#8090a0', ground: '#404850', intensity: 0.6 }, fog: { color: '#a0aab8', density: 0.008 } },
  snow_night:         { ambient: { color: '#182030', intensity: 0.4 }, directional: { color: '#405060', intensity: 0.4 }, hemisphere: { sky: '#101820', ground: '#080810', intensity: 0.2 }, fog: { color: '#151d28', density: 0.009 } },
  thunderstorm_day:   { ambient: { color: '#303038', intensity: 1.2 }, directional: { color: '#606068', intensity: 0.5 }, hemisphere: { sky: '#3a3a40', ground: '#101010', intensity: 0.3 }, fog: { color: '#404048', density: 0.009 } },
  thunderstorm_night: { ambient: { color: '#060608', intensity: 0.2 }, directional: { color: '#101018', intensity: 0.2 }, hemisphere: { sky: '#030306', ground: '#020202', intensity: 0.08 }, fog: { color: '#050508', density: 0.010 } },
  fog_day:            { ambient: { color: '#808080', intensity: 2.0 }, directional: { color: '#a0a0a0', intensity: 0.4 }, hemisphere: { sky: '#a0a0a0', ground: '#606060', intensity: 0.5 }, fog: { color: '#a8a8a8', density: 0.015 } },
  fog_night:          { ambient: { color: '#181820', intensity: 0.4 }, directional: { color: '#303040', intensity: 0.2 }, hemisphere: { sky: '#101018', ground: '#080808', intensity: 0.15 }, fog: { color: '#101018', density: 0.013 } },
  drizzle_day:        { ambient: { color: '#586068', intensity: 1.6 }, directional: { color: '#a0a8b0', intensity: 1.0 }, hemisphere: { sky: '#7890a0', ground: '#1a1818', intensity: 0.55 }, fog: { color: '#9aabb8', density: 0.004 } },
};

function getPresetKey(weather: WeatherCondition, phase: TimePhase): string {
  const isNightPhase = phase === 'night' || phase === 'dusk' || phase === 'dawn';
  const timeSuffix = phase === 'sunrise' ? '_sunrise' : phase === 'sunset' ? '_sunset' : phase === 'dawn' ? '_dawn' : phase === 'dusk' ? '_dusk' : isNightPhase ? '_night' : '_day';

  // Try specific key first, fall back to day/night variant
  const specificKey = `${weather}${timeSuffix}`;
  if (PRESETS[specificKey]) return specificKey;

  const fallbackKey = `${weather}_${isNightPhase ? 'night' : 'day'}`;
  if (PRESETS[fallbackKey]) return fallbackKey;

  return isNightPhase ? 'clear_night' : 'clear_day';
}

const LERP_SPEED = 0.02;

const tmpColor = new THREE.Color();

export default function WeatherLighting() {
  const ambientRef = useRef<THREE.AmbientLight>(null);
  const dirRef = useRef<THREE.DirectionalLight>(null);
  const hemiRef = useRef<THREE.HemisphereLight>(null);
  const { scene } = useThree();

  useFrame(() => {
    const { timePhase, weatherCondition, sunProgress, fogDensity: storeFogDensity } = useWeatherStore.getState();
    const key = getPresetKey(weatherCondition, timePhase);
    const preset = PRESETS[key];

    // Ambient light
    if (ambientRef.current) {
      tmpColor.set(preset.ambient.color);
      ambientRef.current.color.lerp(tmpColor, LERP_SPEED);
      ambientRef.current.intensity += (preset.ambient.intensity - ambientRef.current.intensity) * LERP_SPEED;
    }

    // Directional light (sun position from sunProgress)
    if (dirRef.current) {
      tmpColor.set(preset.directional.color);
      dirRef.current.color.lerp(tmpColor, LERP_SPEED);
      dirRef.current.intensity += (preset.directional.intensity - dirRef.current.intensity) * LERP_SPEED;

      // Sun arc: east -> top -> west
      const angle = sunProgress * Math.PI;
      const targetX = -Math.cos(angle) * 100;
      const targetY = Math.sin(angle) * 80 + 10; // +10 so even at horizon it's slightly above
      const targetZ = 50;
      dirRef.current.position.x += (targetX - dirRef.current.position.x) * LERP_SPEED;
      dirRef.current.position.y += (targetY - dirRef.current.position.y) * LERP_SPEED;
      dirRef.current.position.z += (targetZ - dirRef.current.position.z) * LERP_SPEED;
    }

    // Hemisphere light
    if (hemiRef.current) {
      tmpColor.set(preset.hemisphere.sky);
      hemiRef.current.color.lerp(tmpColor, LERP_SPEED);
      tmpColor.set(preset.hemisphere.ground);
      hemiRef.current.groundColor.lerp(tmpColor, LERP_SPEED);
      hemiRef.current.intensity += (preset.hemisphere.intensity - hemiRef.current.intensity) * LERP_SPEED;
    }

    // Fog
    const fog = scene.fog as THREE.FogExp2 | null;
    if (fog) {
      tmpColor.set(preset.fog.color);
      fog.color.lerp(tmpColor, LERP_SPEED);
      const targetDensity = Math.max(preset.fog.density, storeFogDensity);
      fog.density += (targetDensity - fog.density) * LERP_SPEED;
    }
  });

  return (
    <>
      <ambientLight ref={ambientRef} intensity={1.5} color="#504040" />
      <directionalLight
        ref={dirRef}
        position={[-100, 60, 50]}
        intensity={2.5}
        color="#ffd0a0"
      />
      <hemisphereLight ref={hemiRef} args={['#a3dcfc', '#201510', 0.8]} />
    </>
  );
}
