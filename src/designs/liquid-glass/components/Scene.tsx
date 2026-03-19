import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Environment, Float, MeshTransmissionMaterial, ContactShadows } from '@react-three/drei';
import { EffectComposer, SSAO, DepthOfField } from '@react-three/postprocessing';
import { useRef, useEffect } from 'react';
import * as THREE from 'three';
import { useAppStore } from '../store';

function MuseumObjects() {
  const torusRef = useRef<THREE.Mesh>(null);
  const sphereRef = useRef<THREE.Mesh>(null);
  const { hoveredService, ctaHovered } = useAppStore();
  const { scene, camera } = useThree();

  useEffect(() => {
    scene.background = new THREE.Color('#ffffff');
  }, [scene]);

  useFrame((state) => {
    const scrollY = window.scrollY;
    
    // Rotate and float based on scroll
    if (torusRef.current) {
      torusRef.current.rotation.y = scrollY * 0.001;
      torusRef.current.position.y = Math.sin(scrollY * 0.002) * 0.5;
    }
    
    if (sphereRef.current) {
      sphereRef.current.rotation.x = scrollY * 0.002;
      sphereRef.current.position.y = -5 + (scrollY * 0.005); // Rises from bottom
      // Only show when scrolling down to services
      sphereRef.current.visible = scrollY > 500;
    }
    
    // Camera zoom effect on service hover
    const targetFov = hoveredService !== null ? 30 : 45;
    if (camera instanceof THREE.PerspectiveCamera) {
      camera.fov = THREE.MathUtils.lerp(camera.fov, targetFov, 0.05);
      camera.updateProjectionMatrix();
    }

    // Background color transition on CTA hover (Vantablack)
    const targetColor = ctaHovered ? new THREE.Color('#000000') : new THREE.Color('#ffffff');
    if (scene.background instanceof THREE.Color) {
      scene.background.lerp(targetColor, 0.05);
    }
  });

  return (
    <>
      <Float speed={2} rotationIntensity={0.5} floatIntensity={1}>
        <mesh ref={torusRef} castShadow receiveShadow position={[0, 0, 0]}>
          <torusKnotGeometry args={[1.5, 0.4, 256, 64]} />
          <MeshTransmissionMaterial 
            backside
            samples={4}
            thickness={2}
            chromaticAberration={0.025}
            anisotropy={0.1}
            distortion={0.1}
            distortionScale={0.1}
            temporalDistortion={0.2}
            color="#ffffff"
          />
        </mesh>
      </Float>

      <Float speed={1.5} rotationIntensity={1} floatIntensity={2}>
        <mesh ref={sphereRef} castShadow receiveShadow position={[3, -5, -2]}>
          <sphereGeometry args={[1, 64, 64]} />
          <meshStandardMaterial color="#FAFAFA" roughness={0.1} metalness={0.8} />
        </mesh>
      </Float>

      <ContactShadows position={[0, -2.5, 0]} opacity={0.5} scale={10} blur={2} far={4} />
    </>
  );
}

export default function Scene() {
  return (
    <div className="fixed inset-0 pointer-events-none z-[-1]">
      <Canvas shadows dpr={[1, 2]} camera={{ position: [0, 0, 8], fov: 45 }}>
        <ambientLight intensity={0.5} />
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
        <MuseumObjects />
        <EffectComposer>
          <SSAO radius={0.4} intensity={50} luminanceInfluence={0.5} />
          <DepthOfField focusDistance={0} focalLength={0.02} bokehScale={2} height={480} />
        </EffectComposer>
      </Canvas>
    </div>
  );
}
