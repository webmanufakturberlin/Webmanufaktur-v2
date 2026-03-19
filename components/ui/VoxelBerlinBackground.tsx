import React, { useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import * as THREE from 'three';

const VoxelCity = () => {
    const cityGroup = useMemo(() => {
        const group = new THREE.Group();
        
        const voxelData: Record<string, THREE.Vector3[]> = {};
        const C = {
            parkDark: 0x1f471b, parkMid: 0x2e5c27, parkLight: 0x437a38,
            road: 0x5a5c5f, roadMarkings: 0xeeeeee,
            gateSand: 0xc8b99c, gateDark: 0xa8997c,
            reichstagStone: 0xd0d0d0, reichstagRoof: 0xa0a0a0, reichstagGlass: 0x88ccff,
            tvConcrete: 0xb0b0b0, tvSphere: 0xd8d8d8, tvRed: 0xcc2222, tvWhite: 0xf0f0f0,
            domStone: 0xbcad98, domGreen: 0x4a8f71, domGold: 0xd4af37,
            bldg1: 0xe0e0e0, bldg2: 0xcccccc, bldg3: 0x8b7b6c, bldgGlassDark: 0x222233
        };

        function addVoxel(x: number, y: number, z: number, colorHex: number, isGlass = false) {
            const key = `${colorHex}_${isGlass}`;
            if (!voxelData[key]) voxelData[key] = [];
            voxelData[key].push(new THREE.Vector3(x, y, z));
        }

        function buildBlock(startX: number, startY: number, startZ: number, sizeX: number, sizeY: number, sizeZ: number, color: number) {
            for(let x=0; x<sizeX; x++) {
                for(let y=0; y<sizeY; y++) {
                    for(let z=0; z<sizeZ; z++) {
                        addVoxel(startX + x, startY + y, startZ + z, color);
                    }
                }
            }
        }

        function buildSphere(cx: number, cy: number, cz: number, radius: number, color: number, isGlass=false) {
            for (let x = -radius; x <= radius; x++) {
                for (let y = -radius; y <= radius; y++) {
                    for (let z = -radius; z <= radius; z++) {
                        if (Math.sqrt(x*x + y*y + z*z) <= radius) {
                            addVoxel(cx + x, cy + y, cz + z, color, isGlass);
                        }
                    }
                }
            }
        }

        // Base Ground Plane
        buildBlock(-80, -2, -100, 160, 2, 180, C.parkDark);

        // 1. Tiergarten
        for(let x=-70; x<=70; x++) {
            for(let z=-10; z<=80; z++) {
                if (x > 8 && x < 22 && z > -5) continue;
                let height = 2 + Math.floor(Math.sin(x * 0.15) * Math.cos(z * 0.15) * 3);
                height += Math.floor(Math.random() * 3);
                height = Math.max(1, height);
                let col = C.parkMid;
                if (Math.random() > 0.7) col = C.parkLight;
                if (height < 3) col = C.parkDark;
                for(let y=0; y<height; y++) addVoxel(x, y, z, col);
            }
        }

        // 2. Road
        buildBlock(10, 0, -2, 12, 1, 80, C.road);
        for(let z=0; z<78; z+=4) {
            addVoxel(15, 0.5, z, C.roadMarkings);
            addVoxel(16, 0.5, z, C.roadMarkings);
        }

        // 3. Brandenburg Gate
        const gX = 8; const gZ = -5;
        for(let i=0; i<6; i++) {
            buildBlock(gX + i*3, 0, gZ, 2, 8, 4, C.gateSand);
            buildBlock(gX - 0.5 + i*3, 0, gZ - 0.5, 3, 1, 5, C.gateDark);
            buildBlock(gX - 0.5 + i*3, 8, gZ - 0.5, 3, 1, 5, C.gateDark);
        }
        buildBlock(gX - 1, 9, gZ - 1, 19, 3, 6, C.gateSand);
        buildBlock(gX + 7, 12, gZ + 1, 3, 2, 3, 0x444444);
        buildBlock(gX + 6, 14, gZ, 5, 2, 2, 0x222222);

        // 4. Reichstag
        const rX = -35; const rZ = -15;
        buildBlock(rX, 0, rZ, 26, 9, 16, C.reichstagStone);
        const corners = [[0,0], [22,0], [0,12], [22,12]];
        corners.forEach(c => buildBlock(rX + c[0], 9, rZ + c[1], 4, 2, 4, C.reichstagStone));
        const domeRad = 6;
        for(let x=-domeRad; x<=domeRad; x++) {
            for(let y=0; y<=domeRad; y++) {
                for(let z=-domeRad; z<=domeRad; z++) {
                    const distSq = x*x + y*y + z*z;
                    if (distSq <= domeRad*domeRad && distSq > (domeRad-1.5)*(domeRad-1.5)) {
                        addVoxel(rX + 13 + x, 9 + y, rZ + 8 + z, C.reichstagGlass, true);
                    }
                }
            }
        }
        buildBlock(rX + 11, 9, rZ + 6, 4, 4, 4, C.reichstagStone);

        // 5. TV Tower
        const tvX = -5; const tvZ = -50;
        buildBlock(tvX, 0, tvZ, 3, 45, 3, C.tvConcrete);
        buildSphere(tvX + 1.5, 49, tvZ + 1.5, 6, C.tvSphere);
        for(let y=55; y<85; y++) {
            const isRed = Math.floor(y / 3) % 2 === 0;
            addVoxel(tvX + 1, y, tvZ + 1, isRed ? C.tvRed : C.tvWhite);
        }

        // 6. Berliner Dom
        const dX = 30; const dZ = -30;
        buildBlock(dX, 0, dZ, 18, 14, 16, C.domStone);
        const mainDomRad = 7;
        for (let x = -mainDomRad; x <= mainDomRad; x++) {
            for (let y = 0; y <= mainDomRad; y++) {
                for (let z = -mainDomRad; z <= mainDomRad; z++) {
                    if (x*x + y*y + z*z <= mainDomRad*mainDomRad) {
                        addVoxel(dX + 9 + x, 14 + y, dZ + 8 + z, C.domGreen);
                    }
                }
            }
        }
        buildBlock(dX + 8, 14 + mainDomRad, dZ + 7, 2, 4, 2, C.domGold);
        const domCorners = [[-1,-1], [15,-1], [-1,13], [15,13]];
        domCorners.forEach(c => {
            buildBlock(dX + c[0], 10, dZ + c[1], 4, 6, 4, C.domStone);
            buildSphere(dX + c[0] + 1.5, 16, dZ + c[1] + 1.5, 2, C.domGreen);
        });

        // 7. Dark Modern Skyscraper
        buildBlock(-18, 0, -45, 8, 32, 5, C.bldgGlassDark);

        // 8. General Cityscape
        const bldgColors = [C.bldg1, C.bldg2, C.bldg3, 0xbbbbbb, 0xdadada];
        for (let i = 0; i < 100; i++) {
            const bx = (Math.random() - 0.5) * 140;
            const bz = -20 - Math.random() * 60;
            if (bx > rX-5 && bx < rX+30 && bz > rZ-5 && bz < rZ+20) continue;
            if (bx > gX-10 && bx < gX+30 && bz > gZ-10 && bz < gZ+10) continue;
            if (bx > dX-5 && bx < dX+25 && bz > dZ-5 && bz < dZ+20) continue;
            if (bx > tvX-10 && bx < tvX+10 && bz > tvZ-10 && bz < tvZ+10) continue;

            const w = Math.floor(Math.random() * 8) + 3;
            const d = Math.floor(Math.random() * 8) + 3;
            const h = Math.floor(Math.random() * (Math.random() > 0.8 ? 20 : 10)) + 3; 
            const col = bldgColors[Math.floor(Math.random() * bldgColors.length)];
            buildBlock(bx, 0, bz, w, h, d, col);
        }

        const geometry = new THREE.BoxGeometry(1, 1, 1);
        const dummy = new THREE.Object3D();

        for (const key in voxelData) {
            const parts = key.split('_');
            const colorHex = parseInt(parts[0], 10);
            const isGlass = parts[1] === 'true';
            const positions = voxelData[key];

            const material = new THREE.MeshStandardMaterial({
                color: colorHex,
                roughness: isGlass ? 0.1 : 0.8,
                metalness: isGlass ? 0.5 : 0.0,
                transparent: isGlass,
                opacity: isGlass ? 0.5 : 1.0,
            });

            const instancedMesh = new THREE.InstancedMesh(geometry, material, positions.length);
            instancedMesh.castShadow = !isGlass;
            instancedMesh.receiveShadow = true;

            for (let i = 0; i < positions.length; i++) {
                dummy.position.copy(positions[i]);
                dummy.updateMatrix();
                instancedMesh.setMatrixAt(i, dummy.matrix);
            }
            instancedMesh.instanceMatrix.needsUpdate = true;
            group.add(instancedMesh);
        }
        
        return group;
    }, []);

    // We let OrbitControls handle the cinematic 360 rotation around the TV Tower
    // No manual useFrame camera panning is needed here.
    
    return <primitive object={cityGroup} />;
};

export default function VoxelBerlinBackground() {
    return (
        <div className="absolute inset-0 z-[1] bg-[#a3dcfc] overflow-hidden pointer-events-none">
            <Canvas 
                shadows 
                camera={{ position: [10, 52, 10], fov: 50 }}
                gl={{ antialias: true, powerPreference: "high-performance" }}
                className="w-full h-full"
            >
                <color attach="background" args={['#a3dcfc']} />
                <fogExp2 attach="fog" args={['#a3dcfc', 0.006]} />
                
                <ambientLight intensity={0.6} />
                <directionalLight 
                    position={[80, 150, 50]} 
                    intensity={1.2} 
                    castShadow
                    shadow-mapSize={[2048, 2048]}
                >
                    <orthographicCamera attach="shadow-camera" args={[-100, 100, 100, -100, 10, 300]} />
                </directionalLight>

                <VoxelCity />
                
                {/* 360 Rotation perfectly anchored to the TV Tower sphere */}
                <OrbitControls 
                    target={[-5, 45, -50]}
                    enableDamping
                    dampingFactor={0.05}
                    maxPolarAngle={Math.PI / 2 - 0.05}
                    enableZoom={false}
                    enablePan={false}
                    enableRotate={false}
                    autoRotate={true}
                    autoRotateSpeed={0.5}
                />
            </Canvas>
            
            {/* Reduced Vignette Overlay to make voxels pop while still maintaining some readability edge */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,rgba(255,255,255,0.3)_100%)] pointer-events-none" />
            
            {/* Narrower bottom gradient to blend into the next section softly without washing out the scene */}
            <div className="absolute inset-0 bg-gradient-to-t from-white/90 via-transparent to-transparent pointer-events-none" />
        </div>
    );
}
