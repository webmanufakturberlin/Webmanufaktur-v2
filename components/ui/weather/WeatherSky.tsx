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

// Sun component
function Sun() {
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame(() => {
    if (!meshRef.current) return;
    const { timePhase, weatherCondition, sunProgress } = useWeatherStore.getState();
    const material = meshRef.current.material as THREE.MeshBasicMaterial;

    // Visibility: bright on clear, dim on few clouds, hidden otherwise
    let targetOpacity = 0;
    if (weatherCondition === 'clear') {
      if (timePhase === 'day') targetOpacity = 1.0;
      else if (timePhase === 'sunrise' || timePhase === 'sunset') targetOpacity = 0.85;
      else if (timePhase === 'dawn' || timePhase === 'dusk') targetOpacity = 0.3;
    } else if (weatherCondition === 'clouds_few') {
      if (timePhase === 'day') targetOpacity = 0.35;
      else if (timePhase === 'sunrise' || timePhase === 'sunset') targetOpacity = 0.2;
    }

    material.opacity += (targetOpacity - material.opacity) * LERP_SPEED;
    material.visible = material.opacity > 0.01;

    // Sun color: warm yellow at day, orange-red at sunrise/sunset
    let targetColor = '#fffbe0';
    if (timePhase === 'sunrise') targetColor = '#ff9060';
    else if (timePhase === 'sunset') targetColor = '#ff7040';
    else if (timePhase === 'dawn' || timePhase === 'dusk') targetColor = '#ffb060';
    tmpColor.set(targetColor);
    material.color.lerp(tmpColor, LERP_SPEED);

    // Position along same arc as directional light
    const angle = sunProgress * Math.PI;
    meshRef.current.position.x = -Math.cos(angle) * 350;
    meshRef.current.position.y = Math.sin(angle) * 280 + 40;
    meshRef.current.position.z = -200;
  });

  return (
    <mesh ref={meshRef} position={[350, 40, -200]}>
      <sphereGeometry args={[12, 16, 16]} />
      <meshBasicMaterial color="#fffbe0" transparent opacity={0} depthWrite={false} />
    </mesh>
  );
}

// Cloud layer component — flat planes at Fernsehturm height (~Y=85-105)
const CLOUD_PLANES = [
  { x:   0, z:   0, rx: 0.05, rz: 0.0,  sx: 280, sz: 200 },
  { x:  60, z: -40, rx: 0.0,  rz: 0.04, sx: 200, sz: 160 },
  { x: -80, z:  30, rx: 0.03, rz: 0.0,  sx: 220, sz: 140 },
  { x:  30, z:  70, rx: 0.0,  rz: 0.06, sx: 180, sz: 130 },
  { x: -50, z: -60, rx: 0.04, rz: 0.02, sx: 160, sz: 120 },
];

function CloudLayer() {
  const ref0 = useRef<THREE.Mesh>(null);
  const ref1 = useRef<THREE.Mesh>(null);
  const ref2 = useRef<THREE.Mesh>(null);
  const ref3 = useRef<THREE.Mesh>(null);
  const ref4 = useRef<THREE.Mesh>(null);
  const refs = [ref0, ref1, ref2, ref3, ref4];

  useFrame((_, delta) => {
    const { weatherCondition, timePhase, windStrength } = useWeatherStore.getState();
    const isNightPhase = timePhase === 'night' || timePhase === 'dawn' || timePhase === 'dusk';

    let targetOpacity = 0;
    let cloudColor = '#e8eef0';

    if (weatherCondition === 'clouds_few') {
      targetOpacity = isNightPhase ? 0.08 : 0.15;
    } else if (weatherCondition === 'clouds_heavy') {
      targetOpacity = isNightPhase ? 0.25 : 0.45;
      cloudColor = '#c8d4dc';
    } else if (weatherCondition === 'rain' || weatherCondition === 'drizzle') {
      targetOpacity = isNightPhase ? 0.3 : 0.5;
      cloudColor = '#909aaa';
    } else if (weatherCondition === 'thunderstorm') {
      targetOpacity = isNightPhase ? 0.5 : 0.7;
      cloudColor = '#404050';
    } else if (weatherCondition === 'snow') {
      targetOpacity = isNightPhase ? 0.2 : 0.35;
      cloudColor = '#d8e0e8';
    }

    refs.forEach((ref, i) => {
      if (!ref.current) return;
      const mat = ref.current.material as THREE.MeshBasicMaterial;
      mat.opacity += (targetOpacity - mat.opacity) * LERP_SPEED;
      mat.visible = mat.opacity > 0.005;
      tmpColor.set(cloudColor);
      mat.color.lerp(tmpColor, LERP_SPEED * 0.5);
      // Slow drift based on wind
      ref.current.position.x += windStrength * 0.08 * delta;
      if (ref.current.position.x > 250) ref.current.position.x -= 500;
    });
  });

  return (
    <>
      {CLOUD_PLANES.map((p, i) => (
        <mesh
          key={i}
          ref={refs[i]}
          position={[p.x, 88 + i * 4, p.z]}
          rotation={[p.rx, 0, p.rz]}
          scale={[p.sx, 1, p.sz]}
        >
          <planeGeometry args={[1, 1]} />
          <meshBasicMaterial color="#e8eef0" transparent opacity={0} depthWrite={false} side={THREE.DoubleSide} />
        </mesh>
      ))}
    </>
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
      <Sun />
      <Moon />
      <CloudLayer />
    </>
  );
}
