import { OrthographicCamera } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import { useMemo, useRef, useState } from 'react';
import * as THREE from 'three';
import { useStore } from '../store';

const GRID_SIZE = 40;
const INSTANCE_COUNT = GRID_SIZE * GRID_SIZE;
const CUBE_SIZE = 1;
const GAP = 0.1;
const SPACING = CUBE_SIZE + GAP;

const COLOR_CONCRETE = new THREE.Color('#E0E0E0');
const COLOR_ACTION = new THREE.Color('#FF5722');
const COLOR_NIGHT = new THREE.Color('#1A1A24');

export default function VoxelScene() {
  const meshRef = useRef<THREE.InstancedMesh>(null);
  const scrollProgress = useStore((state) => state.scrollProgress);
  const hoveredService = useStore((state) => state.hoveredService);
  const [hoveredInstance, setHoveredInstance] = useState<number | null>(null);

  const dummy = useMemo(() => new THREE.Object3D(), []);
  const targetHeights = useMemo(() => new Float32Array(INSTANCE_COUNT), []);
  const currentHeights = useMemo(() => new Float32Array(INSTANCE_COUNT).fill(-50), []); // Start below
  const currentScales = useMemo(() => new Float32Array(INSTANCE_COUNT).fill(1), []); // Track scales
  const baseColors = useMemo(() => new Float32Array(INSTANCE_COUNT * 3), []);
  const currentColors = useMemo(() => new Float32Array(INSTANCE_COUNT * 3), []);
  const colorObj = useMemo(() => new THREE.Color(), []);

  // Initialize colors and initial positions
  useMemo(() => {
    for (let i = 0; i < INSTANCE_COUNT; i++) {
      // Randomly assign some action orange blocks
      if (Math.random() > 0.95) {
        colorObj.copy(COLOR_ACTION);
      } else if (Math.random() > 0.98) {
        colorObj.copy(COLOR_NIGHT);
      } else {
        colorObj.copy(COLOR_CONCRETE);
      }
      colorObj.toArray(baseColors, i * 3);
      colorObj.toArray(currentColors, i * 3);
      
      // Initial random heights for the "rain down" effect
      currentHeights[i] = Math.random() * 100 + 50; 
      currentScales[i] = 1;
    }
  }, [baseColors, currentColors, currentHeights, currentScales, colorObj]);

  useFrame((state, delta) => {
    if (!meshRef.current) return;

    const time = state.clock.getElapsedTime();
    const progress = scrollProgress; // 0 to 1

    for (let i = 0; i < INSTANCE_COUNT; i++) {
      const x = (i % GRID_SIZE) - GRID_SIZE / 2;
      const z = Math.floor(i / GRID_SIZE) - GRID_SIZE / 2;
      const distFromCenter = Math.sqrt(x * x + z * z);

      let targetY = -10; // Default hidden below
      let targetScale = 1;

      // --- SECTION LOGIC ---
      
      // 1. HERO (Progress 0 - 0.2): Central Island
      if (progress < 0.2) {
        const p = Math.max(0, 1 - progress / 0.2);
        if (distFromCenter < 12) {
          // A stepped pyramid island
          targetY = Math.max(0, 6 - Math.floor(distFromCenter / 2)) * p;
        } else {
          targetY = -10; // Drop away
        }
      }
      
      // 2. VALUE PROP (Progress 0.15 - 0.4): Three Towers
      else if (progress >= 0.15 && progress < 0.4) {
        const p = Math.min(1, (progress - 0.15) / 0.2);
        
        // Tower 1
        const dist1 = Math.sqrt(Math.pow(x + 8, 2) + Math.pow(z - 8, 2));
        // Tower 2
        const dist2 = Math.sqrt(Math.pow(x - 8, 2) + Math.pow(z - 8, 2));
        // Tower 3
        const dist3 = Math.sqrt(Math.pow(x, 2) + Math.pow(z + 8, 2));

        if (dist1 < 3) targetY = (10 - dist1) * p;
        else if (dist2 < 3) targetY = (12 - dist2) * p;
        else if (dist3 < 4) targetY = (8 - dist3) * p;
        else targetY = (Math.sin(x * 0.5 + time) * Math.cos(z * 0.5 + time)) * 0.5 * p; // Wavy ground
      }
      
      // 3. SERVICES (Progress 0.35 - 0.6): Exploding Grid
      else if (progress >= 0.35 && progress < 0.6) {
        const p = Math.min(1, (progress - 0.35) / 0.2);
        // Base grid
        targetY = (Math.sin(x * 0.2) + Math.cos(z * 0.2)) * 2 * p;
        
        // Hover explosion
        if (hoveredService !== null) {
          // Create a ripple effect based on time and hover
          const ripple = Math.sin(distFromCenter * 0.5 - time * 5) * 2;
          targetY += ripple;
        }
      }
      
      // 4. PROCESS (Progress 0.55 - 0.8): Conveyor Belt
      else if (progress >= 0.55 && progress < 0.8) {
        const p = Math.min(1, (progress - 0.55) / 0.2);
        // Moving waves along X axis
        if (Math.abs(z) < 5) {
          targetY = (Math.sin(x * 0.5 - time * 4) * 2 + 2) * p;
        } else {
          targetY = -5 * p;
        }
      }
      
      // 5. PORTFOLIO & 6. CONTACT (Progress 0.75 - 1.0): Full City Zoom Out
      else {
        const p = Math.min(1, (progress - 0.75) / 0.25);
        // Perlin-noise-like city structure
        const heightMap = Math.sin(x * 0.3) * Math.cos(z * 0.3) * 5 + Math.sin(x * 0.1 + z * 0.2) * 8;
        targetY = Math.max(0, heightMap) * p;
        
        // Massive central block for contact form
        if (Math.abs(x) < 6 && Math.abs(z) < 6) {
          targetY = 2 * p; // Flat platform
        }
      }

      // Hover Effect (Magnetic Hooking)
      if (i === hoveredInstance) {
        targetY += 1.5; // Pop up slightly more
        targetScale = 1.25; // Scale up
        colorObj.copy(COLOR_ACTION);
      } else {
        colorObj.fromArray(baseColors, i * 3);
      }

      // Smooth lerp color
      const r = currentColors[i * 3];
      const g = currentColors[i * 3 + 1];
      const b = currentColors[i * 3 + 2];
      currentColors[i * 3] += (colorObj.r - r) * 10 * delta;
      currentColors[i * 3 + 1] += (colorObj.g - g) * 10 * delta;
      currentColors[i * 3 + 2] += (colorObj.b - b) * 10 * delta;

      // Smooth lerp current height to target height
      currentHeights[i] += (targetY - currentHeights[i]) * 8 * delta;
      
      // Smooth lerp scale
      currentScales[i] += (targetScale - currentScales[i]) * 12 * delta;

      // Update Matrix
      dummy.position.set(x * SPACING, currentHeights[i], z * SPACING);
      dummy.scale.set(currentScales[i], currentScales[i], currentScales[i]);
      dummy.updateMatrix();
      meshRef.current.setMatrixAt(i, dummy.matrix);
    }

    meshRef.current.instanceMatrix.needsUpdate = true;
    if (meshRef.current.instanceColor) {
      meshRef.current.instanceColor.needsUpdate = true;
    }
    
    // Camera Parallax & Zoom Out effect
    if (state.camera instanceof THREE.OrthographicCamera) {
      // Calculate subtle parallax based on scroll progress
      const targetX = 50 + Math.sin(progress * Math.PI) * 15;
      const targetY = 50 + progress * 15;
      const targetZ = 50 + Math.cos(progress * Math.PI) * 15 - 15;
      
      // Smoothly move camera to parallax position
      state.camera.position.x += (targetX - state.camera.position.x) * 2 * delta;
      state.camera.position.y += (targetY - state.camera.position.y) * 2 * delta;
      state.camera.position.z += (targetZ - state.camera.position.z) * 2 * delta;

      const targetZoom = progress > 0.8 ? 15 : 30; // Zoom out at the end
      state.camera.zoom += (targetZoom - state.camera.zoom) * 2 * delta;
      state.camera.updateProjectionMatrix();
      state.camera.lookAt(0, 0, 0);
    }
  });

  return (
    <>
      <OrthographicCamera 
        makeDefault 
        position={[50, 50, 50]} 
        zoom={30} 
        near={-100} 
        far={500} 
        onUpdate={(c) => c.lookAt(0, 0, 0)}
      />
      <ambientLight intensity={0.6} />
      <directionalLight 
        position={[10, 20, 5]} 
        intensity={1.5} 
        castShadow 
        shadow-mapSize={[2048, 2048]}
      />
      
      <instancedMesh 
        ref={meshRef} 
        args={[undefined, undefined, INSTANCE_COUNT]}
        castShadow
        receiveShadow
        onPointerMove={(e) => {
          e.stopPropagation();
          setHoveredInstance(e.instanceId ?? null);
        }}
        onPointerOut={() => setHoveredInstance(null)}
      >
        <boxGeometry args={[CUBE_SIZE, CUBE_SIZE, CUBE_SIZE]}>
          <instancedBufferAttribute attach="attributes-color" args={[currentColors, 3]} />
        </boxGeometry>
        <meshStandardMaterial 
          vertexColors 
          roughness={0.2} 
          metalness={0.1}
        />
      </instancedMesh>
    </>
  );
}
