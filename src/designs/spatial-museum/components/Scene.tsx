import React, { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Environment, Float, MeshTransmissionMaterial } from '@react-three/drei';
import { EffectComposer, SSAO, Noise } from '@react-three/postprocessing';
import * as THREE from 'three';
import { useStore } from '../store';

const FloatingShape = ({ position, geometry, materialProps, index }: any) => {
  const ref = useRef<THREE.Mesh>(null);
  const { scrollProgress } = useStore();

  useFrame((state) => {
    if (!ref.current) return;

    const t = state.clock.getElapsedTime();
    ref.current.position.y += Math.sin(t * 0.5 + index) * 0.002;
    ref.current.rotation.x += 0.001;
    ref.current.rotation.y += 0.002;

    const mouseWorld = new THREE.Vector3(
      (state.mouse.x * state.viewport.width) / 2,
      (state.mouse.y * state.viewport.height) / 2,
      0
    );

    const dist = ref.current.position.distanceTo(mouseWorld);
    if (dist < 4) {
      const dir = ref.current.position.clone().sub(mouseWorld).normalize();
      ref.current.position.add(dir.multiplyScalar(0.02));
    }

    const targetPos = new THREE.Vector3(
      position[0] + Math.sin(scrollProgress * Math.PI * 2 + index) * 2,
      position[1] + Math.cos(scrollProgress * Math.PI * 2 + index) * 2,
      position[2]
    );
    ref.current.position.lerp(targetPos, 0.01);
  });

  return (
    <Float speed={1.5} rotationIntensity={0.5} floatIntensity={1}>
      <mesh ref={ref} position={position} geometry={geometry} castShadow receiveShadow>
        <MeshTransmissionMaterial {...materialProps} />
      </mesh>
    </Float>
  );
};

export const Scene = () => {
  const geometries = useMemo(() => [
    new THREE.IcosahedronGeometry(1.5, 0),
    new THREE.TorusGeometry(1.2, 0.4, 16, 32),
    new THREE.SphereGeometry(1.2, 32, 32),
    new THREE.OctahedronGeometry(1.5, 0),
    new THREE.CylinderGeometry(0.8, 0.8, 2, 32),
  ], []);

  const materialProps = {
    transmission: 1,
    thickness: 1.5,
    roughness: 0.1,
    ior: 1.5,
    color: '#c8c0f8',
    attenuationColor: '#c0b8f0',
    attenuationDistance: 2,
  };

  return (
    <div className="fixed inset-0 z-[1] pointer-events-none bg-[#EEEAF8]">
      <Canvas shadows dpr={[1, 2]} camera={{ position: [0, 0, 10], fov: 45 }}>
        <color attach="background" args={['#EEEAF8']} />
        <ambientLight intensity={0.4} />
        <directionalLight
          castShadow
          position={[10, 20, 10]}
          intensity={1.5}
          shadow-mapSize={[2048, 2048]}
          shadow-camera-far={50}
          shadow-camera-left={-10}
          shadow-camera-right={10}
          shadow-camera-top={10}
          shadow-camera-bottom={-10}
        />
        <Environment preset="studio" />
        <FloatingShape position={[-4, 2, -2]} geometry={geometries[0]} materialProps={materialProps} index={0} />
        <FloatingShape position={[4, -2, -4]} geometry={geometries[1]} materialProps={materialProps} index={1} />
        <FloatingShape position={[-3, -3, -1]} geometry={geometries[2]} materialProps={materialProps} index={2} />
        <FloatingShape position={[5, 3, -3]} geometry={geometries[3]} materialProps={materialProps} index={3} />
        <FloatingShape position={[0, 0, -5]} geometry={geometries[4]} materialProps={materialProps} index={4} />
        <EffectComposer enableNormalPass>
          <SSAO radius={0.4} intensity={50} luminanceInfluence={0.5} color={new THREE.Color('black')} />
          <Noise opacity={0.02} />
        </EffectComposer>
      </Canvas>
    </div>
  );
};
