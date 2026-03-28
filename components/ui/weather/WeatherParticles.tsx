import React, { useRef, useMemo, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { useWeatherStore } from '../../../stores/weatherStore';

const IS_MOBILE = typeof window !== 'undefined' && (window.innerWidth < 768 || navigator.maxTouchPoints > 0);

// Rain system
function Rain() {
  const pointsRef = useRef<THREE.Points>(null);
  const opacityRef = useRef(0);
  const COUNT = IS_MOBILE ? 1500 : 3000;
  const SPREAD = 300;
  const HEIGHT_MIN = 0;
  const HEIGHT_MAX = 180;

  const positions = useMemo(() => {
    const arr = new Float32Array(COUNT * 3);
    for (let i = 0; i < COUNT; i++) {
      arr[i * 3] = (Math.random() - 0.5) * SPREAD;
      arr[i * 3 + 1] = Math.random() * (HEIGHT_MAX - HEIGHT_MIN) + HEIGHT_MIN;
      arr[i * 3 + 2] = (Math.random() - 0.5) * SPREAD;
    }
    return arr;
  }, [COUNT]);

  useFrame(() => {
    if (!pointsRef.current) return;
    const { weatherCondition, windStrength, raw } = useWeatherStore.getState();
    const windDeg = raw?.windDeg ?? 0;

    const shouldRain = weatherCondition === 'rain' || weatherCondition === 'drizzle' || weatherCondition === 'thunderstorm';
    const targetOpacity = shouldRain ? (weatherCondition === 'drizzle' ? 0.4 : 0.6) : 0;
    opacityRef.current += (targetOpacity - opacityRef.current) * 0.02;

    const material = pointsRef.current.material as THREE.PointsMaterial;
    material.opacity = opacityRef.current;
    material.visible = opacityRef.current > 0.01;

    if (!material.visible) return;

    const posAttr = pointsRef.current.geometry.attributes.position as THREE.BufferAttribute;
    const arr = posAttr.array as Float32Array;

    const fallSpeed = weatherCondition === 'drizzle' ? 1.2 : 2.0;
    const windRad = ((windDeg || 0) * Math.PI) / 180;
    const windX = Math.sin(windRad) * windStrength * 0.5;
    const windZ = Math.cos(windRad) * windStrength * 0.5;

    for (let i = 0; i < COUNT; i++) {
      arr[i * 3] += windX;
      arr[i * 3 + 1] -= fallSpeed;
      arr[i * 3 + 2] += windZ;

      // Reset particles that fell below ground
      if (arr[i * 3 + 1] < HEIGHT_MIN) {
        arr[i * 3] = (Math.random() - 0.5) * SPREAD;
        arr[i * 3 + 1] = HEIGHT_MAX;
        arr[i * 3 + 2] = (Math.random() - 0.5) * SPREAD;
      }
    }

    posAttr.needsUpdate = true;
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" array={positions} count={COUNT} itemSize={3} />
      </bufferGeometry>
      <pointsMaterial
        size={IS_MOBILE ? 0.2 : 0.3}
        color="#aabbcc"
        transparent
        opacity={0}
        depthWrite={false}
        sizeAttenuation
      />
    </points>
  );
}

// Snow system
function Snow() {
  const pointsRef = useRef<THREE.Points>(null);
  const opacityRef = useRef(0);
  const timeRef = useRef(0);
  const COUNT = IS_MOBILE ? 1000 : 2000;
  const SPREAD = 300;
  const HEIGHT_MIN = 0;
  const HEIGHT_MAX = 160;

  const positions = useMemo(() => {
    const arr = new Float32Array(COUNT * 3);
    for (let i = 0; i < COUNT; i++) {
      arr[i * 3] = (Math.random() - 0.5) * SPREAD;
      arr[i * 3 + 1] = Math.random() * (HEIGHT_MAX - HEIGHT_MIN) + HEIGHT_MIN;
      arr[i * 3 + 2] = (Math.random() - 0.5) * SPREAD;
    }
    return arr;
  }, [COUNT]);

  useFrame((_, delta) => {
    if (!pointsRef.current) return;
    const { weatherCondition, windStrength } = useWeatherStore.getState();

    const shouldSnow = weatherCondition === 'snow';
    const targetOpacity = shouldSnow ? 0.8 : 0;
    opacityRef.current += (targetOpacity - opacityRef.current) * 0.02;

    const material = pointsRef.current.material as THREE.PointsMaterial;
    material.opacity = opacityRef.current;
    material.visible = opacityRef.current > 0.01;

    if (!material.visible) return;

    timeRef.current += delta;

    const posAttr = pointsRef.current.geometry.attributes.position as THREE.BufferAttribute;
    const arr = posAttr.array as Float32Array;

    for (let i = 0; i < COUNT; i++) {
      // Slow fall with sine drift
      arr[i * 3] += Math.sin(timeRef.current + i * 0.7) * 0.02 + windStrength * 0.15;
      arr[i * 3 + 1] -= 0.3;
      arr[i * 3 + 2] += Math.cos(timeRef.current + i * 1.1) * 0.02;

      if (arr[i * 3 + 1] < HEIGHT_MIN) {
        arr[i * 3] = (Math.random() - 0.5) * SPREAD;
        arr[i * 3 + 1] = HEIGHT_MAX;
        arr[i * 3 + 2] = (Math.random() - 0.5) * SPREAD;
      }
    }

    posAttr.needsUpdate = true;
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" array={positions} count={COUNT} itemSize={3} />
      </bufferGeometry>
      <pointsMaterial
        size={IS_MOBILE ? 0.4 : 0.6}
        color="#ffffff"
        transparent
        opacity={0}
        depthWrite={false}
        sizeAttenuation
      />
    </points>
  );
}

// Lightning flash (for thunderstorms)
function Lightning() {
  const meshRef = useRef<THREE.Mesh>(null);
  const timerRef = useRef(Math.random() * 10 + 5);
  const flashPhaseRef = useRef(-1); // -1 = waiting, 0+ = flash progress in seconds

  useFrame((_, delta) => {
    if (!meshRef.current) return;
    const { weatherCondition } = useWeatherStore.getState();
    const material = meshRef.current.material as THREE.MeshBasicMaterial;

    if (weatherCondition !== 'thunderstorm') {
      material.opacity = 0;
      material.visible = false;
      timerRef.current = Math.random() * 10 + 5;
      flashPhaseRef.current = -1;
      return;
    }

    material.visible = true;

    if (flashPhaseRef.current < 0) {
      // Waiting for next flash
      timerRef.current -= delta;
      material.opacity = 0;

      if (timerRef.current <= 0) {
        flashPhaseRef.current = 0;
      }
    } else {
      // Flash sequence: double flash over ~400ms
      const t = flashPhaseRef.current;
      let intensity = 0;

      if (t < 0.05) intensity = t / 0.05; // ramp up
      else if (t < 0.1) intensity = 1 - (t - 0.05) / 0.05; // ramp down
      else if (t < 0.15) intensity = 0; // pause
      else if (t < 0.2) intensity = (t - 0.15) / 0.05 * 0.7; // second flash
      else if (t < 0.3) intensity = 0.7 * (1 - (t - 0.2) / 0.1); // fade
      else {
        // Flash done, reset timer
        flashPhaseRef.current = -1;
        timerRef.current = Math.random() * 10 + 5;
        intensity = 0;
      }

      material.opacity = intensity * 0.3;
      flashPhaseRef.current += delta;
    }
  });

  return (
    <mesh ref={meshRef} position={[0, 100, 0]}>
      <planeGeometry args={[1000, 1000]} />
      <meshBasicMaterial
        color="#ffffff"
        transparent
        opacity={0}
        depthWrite={false}
        side={THREE.DoubleSide}
      />
    </mesh>
  );
}

export default function WeatherParticles() {
  return (
    <>
      <Rain />
      <Snow />
      <Lightning />
    </>
  );
}
