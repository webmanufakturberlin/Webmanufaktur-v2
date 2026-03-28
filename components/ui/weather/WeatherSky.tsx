import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { useWeatherStore } from '../../../stores/weatherStore';
import type { TimePhase, WeatherCondition } from '../../../types';

// Sky color palettes: [top, mid, bottom]
const SKY_PALETTES: Record<string, [string, string, string]> = {
  clear_day:          ['#1a6fcc', '#5da3e8', '#a3dcfc'],
  clear_sunrise:      ['#2a3a6a', '#d4755a', '#f5c77e'],
  clear_sunset:       ['#1a2040', '#c45a3a', '#f0a050'],
  clear_night:        ['#050510', '#0a0a20', '#101030'],
  clear_dawn:         ['#0f1530', '#2a3a60', '#5a7090'],
  clear_dusk:         ['#0f1530', '#3a2a50', '#6a5070'],
  clouds_few_day:     ['#4a7aaa', '#7a9ab8', '#a0bccc'],
  clouds_heavy_day:   ['#5a6070', '#7a8088', '#9098a0'],
  clouds_heavy_night: ['#060608', '#0a0a10', '#101018'],
  rain_day:           ['#3a4050', '#5a6070', '#7a8088'],
  rain_night:         ['#030306', '#060610', '#0a0a18'],
  snow_day:           ['#687888', '#8898a8', '#a8b8c8'],
  snow_night:         ['#080810', '#101020', '#181828'],
  thunderstorm_day:   ['#1a1a22', '#2a2a32', '#3a3a42'],
  thunderstorm_night: ['#020204', '#040408', '#060610'],
  fog_day:            ['#8a8a8a', '#9a9a9a', '#aaaaaa'],
  fog_night:          ['#0a0a10', '#101018', '#181820'],
  drizzle_day:        ['#4a5868', '#6a7888', '#8a98a0'],
};

function getSkyKey(weather: WeatherCondition, phase: TimePhase): string {
  const isNight = phase === 'night' || phase === 'dusk' || phase === 'dawn';
  const timeSuffix = phase === 'sunrise' ? '_sunrise' : phase === 'sunset' ? '_sunset' : phase === 'dawn' ? '_dawn' : phase === 'dusk' ? '_dusk' : isNight ? '_night' : '_day';

  const specific = `${weather}${timeSuffix}`;
  if (SKY_PALETTES[specific]) return specific;

  const fallback = `${weather}_${isNight ? 'night' : 'day'}`;
  if (SKY_PALETTES[fallback]) return fallback;

  return isNight ? 'clear_night' : 'clear_day';
}

// Gradient sky dome shader
const skyVertexShader = `
  varying float vY;
  void main() {
    vY = normalize(position).y;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

const skyFragmentShader = `
  uniform vec3 topColor;
  uniform vec3 midColor;
  uniform vec3 bottomColor;

  varying float vY;

  void main() {
    float t = vY * 0.5 + 0.5; // normalize -1..1 to 0..1
    vec3 color;
    if (t > 0.5) {
      color = mix(midColor, topColor, (t - 0.5) * 2.0);
    } else {
      color = mix(bottomColor, midColor, t * 2.0);
    }
    gl_FragColor = vec4(color, 1.0);
  }
`;

const LERP_SPEED = 0.02;
const tmpColor = new THREE.Color();

// Stars component
function Stars() {
  const pointsRef = useRef<THREE.Points>(null);

  const { positions, opacities } = useMemo(() => {
    const count = 200;
    const pos = new Float32Array(count * 3);
    const ops = new Float32Array(count);
    for (let i = 0; i < count; i++) {
      // Random points on a sphere (radius 480)
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(Math.random() * 0.8 + 0.2); // bias toward upper hemisphere
      const r = 480;
      pos[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      pos[i * 3 + 1] = r * Math.cos(phi);
      pos[i * 3 + 2] = r * Math.sin(phi) * Math.sin(theta);
      ops[i] = 0.3 + Math.random() * 0.7;
    }
    return { positions: pos, opacities: ops };
  }, []);

  useFrame(() => {
    if (!pointsRef.current) return;
    const { isNight, timePhase } = useWeatherStore.getState();
    const material = pointsRef.current.material as THREE.PointsMaterial;

    // Stars visible during night, dawn, dusk; hidden during day
    let targetOpacity = 0;
    if (timePhase === 'night') targetOpacity = 1;
    else if (timePhase === 'dusk' || timePhase === 'dawn') targetOpacity = 0.5;
    else if (timePhase === 'sunrise' || timePhase === 'sunset') targetOpacity = 0.15;

    material.opacity += (targetOpacity - material.opacity) * LERP_SPEED;
    material.visible = material.opacity > 0.01;
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" array={positions} count={200} itemSize={3} />
      </bufferGeometry>
      <pointsMaterial
        size={2.5}
        color="#ffffff"
        transparent
        opacity={0}
        sizeAttenuation={false}
        depthWrite={false}
      />
    </points>
  );
}

// Moon component
function Moon() {
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame(() => {
    if (!meshRef.current) return;
    const { isNight, timePhase } = useWeatherStore.getState();
    const material = meshRef.current.material as THREE.MeshBasicMaterial;

    let targetOpacity = 0;
    if (timePhase === 'night') targetOpacity = 0.9;
    else if (timePhase === 'dusk' || timePhase === 'dawn') targetOpacity = 0.4;

    material.opacity += (targetOpacity - material.opacity) * LERP_SPEED;
    material.visible = material.opacity > 0.01;
  });

  return (
    <mesh ref={meshRef} position={[150, 200, -100]}>
      <sphereGeometry args={[8, 16, 16]} />
      <meshBasicMaterial color="#f0e8c0" transparent opacity={0} depthWrite={false} />
    </mesh>
  );
}

export default function WeatherSky() {
  const matRef = useRef<THREE.ShaderMaterial>(null);

  const uniforms = useMemo(() => ({
    topColor: { value: new THREE.Color('#1a6fcc') },
    midColor: { value: new THREE.Color('#5da3e8') },
    bottomColor: { value: new THREE.Color('#a3dcfc') },
  }), []);

  useFrame(() => {
    if (!matRef.current) return;
    const { timePhase, weatherCondition } = useWeatherStore.getState();
    const key = getSkyKey(weatherCondition, timePhase);
    const palette = SKY_PALETTES[key] || SKY_PALETTES.clear_day;

    tmpColor.set(palette[0]);
    matRef.current.uniforms.topColor.value.lerp(tmpColor, LERP_SPEED);
    tmpColor.set(palette[1]);
    matRef.current.uniforms.midColor.value.lerp(tmpColor, LERP_SPEED);
    tmpColor.set(palette[2]);
    matRef.current.uniforms.bottomColor.value.lerp(tmpColor, LERP_SPEED);
  });

  return (
    <>
      <mesh scale={[-1, 1, 1]}>
        <sphereGeometry args={[500, 32, 16]} />
        <shaderMaterial
          ref={matRef}
          uniforms={uniforms}
          vertexShader={skyVertexShader}
          fragmentShader={skyFragmentShader}
          side={THREE.BackSide}
          depthWrite={false}
        />
      </mesh>
      <Stars />
      <Moon />
    </>
  );
}
