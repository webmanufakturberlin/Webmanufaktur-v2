import React, { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { MeshTransmissionMaterial, Environment } from '@react-three/drei';
import * as THREE from 'three';
import { useAppStore } from '../../store';

const Monolith = ({ position, rotationOffset }: { position: [number, number, number], rotationOffset: number }) => {
  const meshRef = useRef<THREE.Mesh>(null);
  const scrollProgress = useAppStore((state) => state.scrollProgress);

  useFrame((state) => {
    if (!meshRef.current) return;

    // Slow, heavy rotation based on time and scroll
    meshRef.current.rotation.y = rotationOffset + state.clock.elapsedTime * 0.05 + scrollProgress * Math.PI * 2;
    meshRef.current.rotation.x = state.clock.elapsedTime * 0.02 + scrollProgress * Math.PI;

    // Slight mouse reactivity
    meshRef.current.position.x = THREE.MathUtils.lerp(meshRef.current.position.x, position[0] + state.pointer.x * 2, 0.05);
    meshRef.current.position.y = THREE.MathUtils.lerp(meshRef.current.position.y, position[1] + state.pointer.y * 2, 0.05);
  });

  return (
    <mesh ref={meshRef} position={position}>
      <boxGeometry args={[4, 8, 2]} />
      <MeshTransmissionMaterial
        backside
        samples={16}
        thickness={3}
        chromaticAberration={0.1}
        anisotropy={0.5}
        distortion={0.2}
        distortionScale={0.5}
        temporalDistortion={0.1}
        color="#ffffff"
        roughness={0.1}
        transmission={1}
        ior={1.5}
      />
    </mesh>
  );
};

export const WebGLScene = () => {
  return (
    <div className="fixed inset-0 z-[-1] pointer-events-none">
      <Canvas camera={{ position: [0, 0, 15], fov: 45 }} dpr={[1, 2]}>
        <ambientLight intensity={0.5} />
        <directionalLight position={[10, 10, 10]} intensity={1} />
        <Environment preset="city" />

        <Monolith position={[-5, 0, -5]} rotationOffset={0} />
        <Monolith position={[5, 2, -10]} rotationOffset={Math.PI / 4} />
        <Monolith position={[0, -5, -8]} rotationOffset={Math.PI / 2} />
      </Canvas>
    </div>
  );
};
