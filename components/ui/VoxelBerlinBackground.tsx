import React, { useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';

// Palette from Voxel-Berlin3
const PALETTE = {
    towerBody: 0xd0c8c0,
    towerDark: 0x504b48,
    towerAntennaRed: 0x903020,
    domRoof: 0x405540,
    domBody: 0x45403a,
    domGold: 0xc0a040,
    hotelBody: 0x70757a,
    gateSand: 0xc8b99c,
    gateDark: 0xa8997c,
    gateQuadriga: 0x444444,
    reichstagStone: 0x8a8078,
    reichstagRoof: 0x6a6258,
    siegessauleBase: 0x8a8078,
    siegessauleGold: 0xc0a040,
    residentialWarm: [0x8b6b52, 0x9a7b62, 0x7a5c44, 0x6b4d38],
    residentialCool: [0x5a6068, 0x6a7078, 0x4a5058, 0x7a8088],
    cityColors: [0x302a25, 0x453d35, 0x5a5048, 0x6e635a, 0x403a35, 0x2a2520, 0x504a45],
    windowDark: 0x15100c,
    windowLit: 0xffe8a0,
    parkDark: 0x1f471b,
    parkMid: 0x2e5c27,
    parkLight: 0x437a38,
    treeTrunk: 0x3d2b1f,
    water: 0x3a7ab5,
    pathGravel: 0x8a8070,
};

const VOXEL_GAP = 0.92;

const VoxelCity = () => {
    const { geometry, material, voxelCount, matrices, colors } = useMemo(() => {
        const voxels: { x: number; y: number; z: number; color: number }[] = [];

        function addVoxel(x: number, y: number, z: number, colorHex: number) {
            voxels.push({ x: Math.round(x), y: Math.round(y), z: Math.round(z), color: colorHex });
        }

        function buildBlock(startX: number, startY: number, startZ: number, width: number, height: number, depth: number, colorHex: number) {
            for (let x = 0; x < width; x++) {
                for (let y = 0; y < height; y++) {
                    for (let z = 0; z < depth; z++) {
                        addVoxel(startX + x, startY + y, startZ + z, colorHex);
                    }
                }
            }
        }

        function buildSphere(cx: number, cy: number, cz: number, radius: number, colorHex: number) {
            const r2 = radius * radius;
            for (let x = -radius; x <= radius; x++) {
                for (let y = -radius; y <= radius; y++) {
                    for (let z = -radius; z <= radius; z++) {
                        if (x * x + y * y + z * z <= r2) {
                            addVoxel(cx + x, cy + y, cz + z, colorHex);
                        }
                    }
                }
            }
        }

        function buildCylinder(cx: number, cy: number, cz: number, radius: number, height: number, colorHex: number) {
            const r2 = radius * radius;
            for (let y = 0; y < height; y++) {
                for (let x = -radius; x <= radius; x++) {
                    for (let z = -radius; z <= radius; z++) {
                        if (x * x + z * z <= r2) {
                            addVoxel(cx + x, cy + y, cz + z, colorHex);
                        }
                    }
                }
            }
        }

        // --- TV Tower (Fernsehturm) — focal point, realistic detail ---
        function buildTVTower(tx: number, tz: number) {
            // Wide base / pedestal
            buildCylinder(tx, 0, tz, 4, 4, PALETTE.towerBody);
            buildCylinder(tx, 4, tz, 3, 6, PALETTE.towerBody);
            // Main shaft — tapers slightly
            buildCylinder(tx, 10, tz, 2, 60, PALETTE.towerBody);
            // Sphere — shimmering effect with alternating bright/dark voxels
            const sphereY = 73;
            const sphereR = 7;
            const r2 = sphereR * sphereR;
            for (let x = -sphereR; x <= sphereR; x++) {
                for (let y = -sphereR; y <= sphereR; y++) {
                    for (let z = -sphereR; z <= sphereR; z++) {
                        if (x * x + y * y + z * z <= r2) {
                            // Glittering: mix bright highlight, medium, and dark facets
                            const hash = Math.abs(x * 73 + y * 137 + z * 211) % 10;
                            let col: number;
                            if (hash < 2) col = 0xf0f0f8;       // bright highlight
                            else if (hash < 5) col = 0xd8d8e0;  // light silver
                            else if (hash < 8) col = PALETTE.towerDark; // dark facet
                            else col = 0xc0c0c8;                // medium
                            addVoxel(tx + x, sphereY + y, tz + z, col);
                        }
                    }
                }
            }
            // Neck above sphere
            buildCylinder(tx, sphereY + 7, tz, 1, 8, PALETTE.towerBody);
            // Observation ring around sphere equator
            for (let a = 0; a < 16; a++) {
                const ax = Math.round(Math.cos(a * Math.PI / 8) * (sphereR + 1));
                const az = Math.round(Math.sin(a * Math.PI / 8) * (sphereR + 1));
                addVoxel(tx + ax, sphereY, tz + az, 0xeeeeee);
                addVoxel(tx + ax, sphereY - 1, tz + az, 0xeeeeee);
            }
            // Antenna spire — red/white stripes
            const spireStartY = sphereY + 15;
            const spireHeight = 35;
            for (let y = 0; y < spireHeight; y++) {
                const color = Math.floor(y / 3) % 2 === 0 ? PALETTE.towerAntennaRed : PALETTE.towerBody;
                addVoxel(tx, spireStartY + y, tz, color);
                if (y < 12) {
                    addVoxel(tx + 1, spireStartY + y, tz, color);
                    addVoxel(tx, spireStartY + y, tz + 1, color);
                    addVoxel(tx - 1, spireStartY + y, tz, color);
                    addVoxel(tx, spireStartY + y, tz - 1, color);
                }
            }
        }

        // --- Berliner Dom (Cathedral) ---
        function buildCathedral(cx: number, cz: number) {
            const baseW = 24;
            const baseD = 18;
            const baseY = 12;
            buildBlock(cx - baseW / 2, 0, cz - baseD / 2, baseW, baseY, baseD, PALETTE.domBody);
            const domeY = baseY + 6;
            buildCylinder(cx, baseY, cz, 7, 6, PALETTE.domBody);
            buildSphere(cx, domeY, cz, 8, PALETTE.domRoof);
            addVoxel(cx, domeY + 9, cz, PALETTE.domGold);
            addVoxel(cx, domeY + 10, cz, PALETTE.domGold);
            addVoxel(cx, domeY + 11, cz, PALETTE.domGold);
            addVoxel(cx - 1, domeY + 10, cz, PALETTE.domGold);
            addVoxel(cx + 1, domeY + 10, cz, PALETTE.domGold);
            const offsets = [[-10, -7], [10, -7], [-10, 7], [10, 7]];
            offsets.forEach(offset => {
                const ox = cx + offset[0];
                const oz = cz + offset[1];
                buildCylinder(ox, baseY, oz, 3, 5, PALETTE.domBody);
                buildSphere(ox, baseY + 4, oz, 3.5, PALETTE.domRoof);
                addVoxel(ox, baseY + 8, oz, PALETTE.domGold);
            });
        }

        // --- Hotel Park Inn ---
        function buildHotelParkInn(hx: number, hz: number) {
            const w = 18;
            const d = 6;
            const h = 45;
            buildBlock(hx - w / 2, 0, hz - d / 2, w, h, d, PALETTE.hotelBody);
            for (let y = 3; y < h - 2; y += 2) {
                for (let x = -w / 2 + 1; x < w / 2 - 1; x += 2) {
                    addVoxel(hx + x, y, hz + d / 2, PALETTE.windowDark);
                }
            }
        }

        // --- Brandenburger Tor ---
        function buildBrandenburgGate(gx: number, gz: number) {
            // 6 columns
            for (let i = 0; i < 6; i++) {
                buildBlock(gx + i * 3, 0, gz, 2, 8, 4, PALETTE.gateSand);
                buildBlock(gx - 0.5 + i * 3, 0, gz - 0.5, 3, 1, 5, PALETTE.gateDark);
                buildBlock(gx - 0.5 + i * 3, 8, gz - 0.5, 3, 1, 5, PALETTE.gateDark);
            }
            // Top entablature
            buildBlock(gx - 1, 9, gz - 1, 19, 3, 6, PALETTE.gateSand);
            // Quadriga base + sculpture
            buildBlock(gx + 7, 12, gz + 1, 3, 2, 3, PALETTE.gateQuadriga);
            buildBlock(gx + 6, 14, gz, 5, 2, 2, 0x222222);
        }

        // --- Reichstag ---
        function buildReichstag(rx: number, rz: number) {
            // Main body
            buildBlock(rx, 0, rz, 26, 9, 16, PALETTE.reichstagStone);
            // Corner towers
            const corners = [[0, 0], [22, 0], [0, 12], [22, 12]];
            corners.forEach(c => buildBlock(rx + c[0], 9, rz + c[1], 4, 3, 4, PALETTE.reichstagStone));
            // Glass dome
            const domeRad = 6;
            for (let x = -domeRad; x <= domeRad; x++) {
                for (let y = 0; y <= domeRad; y++) {
                    for (let z = -domeRad; z <= domeRad; z++) {
                        const distSq = x * x + y * y + z * z;
                        if (distSq <= domeRad * domeRad && distSq > (domeRad - 1.5) * (domeRad - 1.5)) {
                            addVoxel(rx + 13 + x, 10 + y, rz + 8 + z, PALETTE.reichstagRoof);
                        }
                    }
                }
            }
        }

        // --- Siegessäule (Victory Column) ---
        function buildSiegessaule(sx: number, sz: number) {
            // Base platform
            buildBlock(sx - 4, 0, sz - 4, 8, 3, 8, PALETTE.siegessauleBase);
            // Column shaft
            buildCylinder(sx, 3, sz, 2, 30, PALETTE.siegessauleBase);
            // Capital
            buildCylinder(sx, 33, sz, 3, 2, PALETTE.siegessauleBase);
            // Victoria (golden figure on top)
            buildCylinder(sx, 35, sz, 1, 5, PALETTE.siegessauleGold);
            addVoxel(sx - 1, 38, sz, PALETTE.siegessauleGold);
            addVoxel(sx + 1, 38, sz, PALETTE.siegessauleGold);
            addVoxel(sx, 40, sz, PALETTE.siegessauleGold);
        }

        // --- Residential blocks (Altbau / Plattenbau style) ---
        function buildResidentialBlock(rx: number, rz: number, w: number, d: number, h: number, warm: boolean) {
            const palette = warm ? PALETTE.residentialWarm : PALETTE.residentialCool;
            const bodyColor = palette[Math.floor(Math.random() * palette.length)];
            buildBlock(rx, 0, rz, w, h, d, bodyColor);
            for (let y = 2; y < h - 1; y += 2) {
                for (let x = 1; x < w - 1; x += 2) {
                    const winColor = Math.random() > 0.7 ? PALETTE.windowLit : PALETTE.windowDark;
                    addVoxel(rx + x, y, rz + d, winColor);
                    addVoxel(rx + x, y, rz - 1, winColor);
                }
            }
            if (h > 6) {
                buildBlock(rx + 1, h, rz + 1, w - 2, 1, d - 2, bodyColor);
            }
        }

        // --- Tree ---
        function buildTree(tx: number, tz: number, tall: boolean) {
            const trunkH = tall ? 4 + Math.floor(Math.random() * 3) : 2 + Math.floor(Math.random() * 2);
            buildCylinder(tx, 0, tz, 0, trunkH, PALETTE.treeTrunk);
            const crownR = tall ? 3 : 2;
            const crownColor = Math.random() > 0.4 ? PALETTE.parkMid : (Math.random() > 0.5 ? PALETTE.parkLight : PALETTE.parkDark);
            buildSphere(tx, trunkH + crownR, tz, crownR, crownColor);
        }

        // --- Park area ---
        function buildPark(px: number, pz: number, w: number, d: number) {
            // Grass ground
            for (let x = 0; x < w; x++) {
                for (let z = 0; z < d; z++) {
                    const col = Math.random() > 0.6 ? PALETTE.parkLight : (Math.random() > 0.5 ? PALETTE.parkMid : PALETTE.parkDark);
                    addVoxel(px + x, 0, pz + z, col);
                }
            }
            // Gravel paths (cross pattern)
            const midX = Math.floor(w / 2);
            const midZ = Math.floor(d / 2);
            for (let x = 0; x < w; x++) {
                addVoxel(px + x, 0, pz + midZ, PALETTE.pathGravel);
                addVoxel(px + x, 0, pz + midZ + 1, PALETTE.pathGravel);
            }
            for (let z = 0; z < d; z++) {
                addVoxel(px + midX, 0, pz + z, PALETTE.pathGravel);
                addVoxel(px + midX + 1, 0, pz + z, PALETTE.pathGravel);
            }
            // Scatter trees
            const treeCount = Math.floor((w * d) / 25);
            for (let i = 0; i < treeCount; i++) {
                const tx = px + 2 + Math.floor(Math.random() * (w - 4));
                const tz = pz + 2 + Math.floor(Math.random() * (d - 4));
                // Skip if on path
                if (Math.abs(tx - (px + midX)) < 2 || Math.abs(tz - (pz + midZ)) < 2) continue;
                buildTree(tx, tz, Math.random() > 0.4);
            }
            // Optional pond
            if (w > 14 && d > 14 && Math.random() > 0.4) {
                const pondX = px + Math.floor(w * 0.25);
                const pondZ = pz + Math.floor(d * 0.25);
                const pondR = Math.min(3, Math.floor(Math.min(w, d) / 6));
                for (let x = -pondR; x <= pondR; x++) {
                    for (let z = -pondR; z <= pondR; z++) {
                        if (x * x + z * z <= pondR * pondR) {
                            addVoxel(pondX + x, 0, pondZ + z, PALETTE.water);
                        }
                    }
                }
            }
        }

        // --- Tree-lined street ---
        function buildTreeStreet(sx: number, sz: number, length: number, horizontal: boolean) {
            for (let i = 0; i < length; i += 6) {
                const tx = horizontal ? sx + i : sx;
                const tz = horizontal ? sz : sz + i;
                buildTree(tx, tz, true);
            }
        }

        // --- Spree River ---
        // Flows W→E: south of Reichstag(-58,-17), past Brandenburg Gate(-55,-5),
        // curves south to Museum Island / Dom(7,1), past TV Tower(15,-5), then east
        function buildSpreeRiver(): Set<string> {
            const points = [
                new THREE.Vector2(-160, -10),
                new THREE.Vector2(-120, -8),
                new THREE.Vector2(-70, -10),    // approaching Reichstag from west
                new THREE.Vector2(-55, -8),     // south of Reichstag, near Gate
                new THREE.Vector2(-30, -2),     // curving south after Gate
                new THREE.Vector2(-10, 6),      // heading toward Museum Island
                new THREE.Vector2(0, 16),       // Museum Island (south of Dom at -5,12)
                new THREE.Vector2(15, 8),       // between Dom and TV Tower
                new THREE.Vector2(28, 4),       // past Alexanderplatz area
                new THREE.Vector2(40, -2),      // heading east
                new THREE.Vector2(70, -5),      // east Berlin
                new THREE.Vector2(100, -6),     // continuing east
                new THREE.Vector2(160, -8),     // far east exit
            ];
            const curve = new THREE.SplineCurve(points);
            const samples = curve.getPoints(500);
            const riverSet = new Set<string>();
            const riverWidth = 3;

            for (let i = 0; i < samples.length; i++) {
                const pt = samples[i];
                const next = samples[Math.min(i + 1, samples.length - 1)];
                const prev = samples[Math.max(i - 1, 0)];
                const tx = next.x - prev.x;
                const ty = next.y - prev.y;
                const len = Math.sqrt(tx * tx + ty * ty) || 1;
                const nx = -ty / len;
                const ny = tx / len;

                for (let w = -riverWidth; w <= riverWidth; w++) {
                    const rx = Math.round(pt.x + nx * w);
                    const rz = Math.round(pt.y + ny * w);
                    const key = `${rx},${rz}`;
                    if (!riverSet.has(key)) {
                        riverSet.add(key);
                        addVoxel(rx, 0, rz, PALETTE.water);
                    }
                }
            }
            return riverSet;
        }

        // --- Full City ---
        function buildFullCity() {
            // Ground plane — large enough to never see edges
            buildBlock(-250, -1, -250, 500, 1, 500, PALETTE.cityColors[0]);

            // Build Spree first
            const riverCells = buildSpreeRiver();

            // Precompute river buffer set (2 voxel clearance around river)
            const riverBuffer = new Set<string>();
            riverCells.forEach(key => {
                const [rx, rz] = key.split(',').map(Number);
                for (let dx = -2; dx <= 2; dx++) {
                    for (let dz = -2; dz <= 2; dz++) {
                        riverBuffer.add(`${rx + dx},${rz + dz}`);
                    }
                }
            });

            // Parks — Tiergarten is the huge park between Gate and Siegessäule
            const parkZones = [
                { x: -105, z: -14, w: 28, d: 22 },  // Tiergarten West (around Siegessäule)
                { x: -78, z: -12, w: 20, d: 18 },   // Tiergarten Central
                { x: -58, z: -12, w: 18, d: 16 },   // Tiergarten East (near Gate)
                { x: 45, z: -20, w: 16, d: 14 },    // Volkspark Friedrichshain (NE)
                { x: 50, z: 30, w: 14, d: 12 },     // Treptower Park (SE)
                { x: -120, z: 20, w: 14, d: 12 },   // Schlosspark Charlottenburg (far W)
                { x: 80, z: -10, w: 12, d: 10 },    // Park Lichtenberg (E)
                { x: -10, z: 35, w: 16, d: 14 },    // Görlitzer Park / Kreuzberg (S)
            ];

            // Landmarks — geographically spread like real Berlin
            // -x = West, +x = East, -z = North, +z = South
            // TV Tower at Alexanderplatz is the reference point
            // Large exclusion radii so the Alex area isn't crammed
            const landmarks = [
                { x: 15, z: -5, r: 28 },      // TV Tower (Alexanderplatz) — big open plaza
                { x: -5, z: 12, r: 20 },      // Berliner Dom (Museum Island, further SW)
                { x: 25, z: 15, r: 16 },      // Hotel Park Inn (SE of TV Tower)
                { x: -55, z: -5, r: 20 },     // Brandenburg Gate (~2.5km W)
                { x: -58, z: -22, r: 22 },    // Reichstag (N of Gate, more space)
                { x: -95, z: -5, r: 16 },     // Siegessäule (~4km W, Tiergarten)
            ];

            function isExcluded(bx: number, bz: number) {
                if (landmarks.some(l => Math.abs(bx - l.x) < l.r && Math.abs(bz - l.z) < l.r)) return true;
                if (parkZones.some(p => bx >= p.x - 2 && bx <= p.x + p.w + 2 && bz >= p.z - 2 && bz <= p.z + p.d + 2)) return true;
                if (riverBuffer.has(`${Math.round(bx)},${Math.round(bz)}`)) return true;
                return false;
            }

            // Build parks
            parkZones.forEach(p => buildPark(p.x, p.z, p.w, p.d));

            // Tree-lined streets — Berlin boulevards
            buildTreeStreet(-95, -5, 40, true);   // Straße des 17. Juni (Siegessäule → Gate)
            buildTreeStreet(-55, -3, 65, true);   // Unter den Linden (Gate → Museum Island)
            buildTreeStreet(15, -30, 40, false);  // Karl-Marx-Allee (N-S near TV Tower)
            buildTreeStreet(40, -15, 50, true);   // Frankfurter Allee (east)
            buildTreeStreet(-30, 20, 40, true);   // Kurfürstendamm area

            // --- Inner city buildings (grid-based, -150 to 150) ---
            const gridSize = 6;
            for (let x = -150; x < 150; x += gridSize) {
                for (let z = -150; z < 150; z += gridSize) {
                    if (isExcluded(x, z)) continue;
                    if (Math.random() > 0.15) {
                        const width = Math.floor(Math.random() * 4) + 3;
                        const depth = Math.floor(Math.random() * 4) + 3;
                        const dist = Math.sqrt(x * x + z * z);
                        let height: number;
                        if (dist < 35) {
                            height = Math.floor(Math.random() * 18) + 8;
                        } else if (dist < 70) {
                            height = Math.floor(Math.random() * 14) + 5;
                        } else if (dist < 110) {
                            height = Math.floor(Math.random() * 10) + 4;
                        } else {
                            height = Math.floor(Math.random() * 8) + 3;
                        }

                        // Cap height in camera orbit zone to prevent clipping
                        const camDist = Math.sqrt((x - 15) ** 2 + (z + 5) ** 2);
                        if (camDist > 40 && camDist < 65) {
                            height = Math.min(height, 12);
                        }

                        const color = PALETTE.cityColors[Math.floor(Math.random() * PALETTE.cityColors.length)];
                        buildBlock(x, 0, z, width, height, depth, color);
                        if (height > 6 && Math.random() > 0.35) {
                            for (let wy = 2; wy < height - 1; wy += 2) {
                                for (let wx = 1; wx < width - 1; wx += 2) {
                                    if (Math.random() > 0.3) {
                                        const winColor = Math.random() > 0.85 ? PALETTE.windowLit : PALETTE.windowDark;
                                        addVoxel(x + wx, wy, z + depth, winColor);
                                    }
                                }
                            }
                        }
                    }
                }
            }

            // --- Outer horizon ring (sparse, low buildings that fade into fog) ---
            const outerGridSize = 10;
            for (let x = -220; x < 220; x += outerGridSize) {
                for (let z = -220; z < 220; z += outerGridSize) {
                    const dist = Math.sqrt(x * x + z * z);
                    if (dist < 145 || dist > 220) continue;
                    if (isExcluded(x, z)) continue;
                    if (Math.random() > 0.45) continue;
                    const width = Math.floor(Math.random() * 4) + 3;
                    const depth = Math.floor(Math.random() * 4) + 3;
                    const height = Math.floor(Math.random() * 5) + 2;
                    const color = PALETTE.cityColors[Math.floor(Math.random() * PALETTE.cityColors.length)];
                    buildBlock(x, 0, z, width, height, depth, color);
                }
            }

            // Residential neighborhoods (outer ring)
            for (let i = 0; i < 90; i++) {
                const angle = Math.random() * Math.PI * 2;
                const dist = 50 + Math.random() * 80;
                const rx = Math.round(Math.cos(angle) * dist);
                const rz = Math.round(Math.sin(angle) * dist);
                if (isExcluded(rx, rz)) continue;
                const w = Math.floor(Math.random() * 6) + 6;
                const d = Math.floor(Math.random() * 4) + 4;
                const h = Math.floor(Math.random() * 6) + 5;
                buildResidentialBlock(rx, rz, w, d, h, Math.random() > 0.5);
            }

            // Plattenbau clusters
            const plattenAreas = [
                { cx: 70, cz: -50 }, { cx: -100, cz: -60 },
                { cx: 80, cz: 40 }, { cx: -110, cz: 50 },
                { cx: 100, cz: -20 }, { cx: -120, cz: -30 },
                { cx: 50, cz: 80 }, { cx: -60, cz: -90 },
            ];
            plattenAreas.forEach(area => {
                for (let i = 0; i < 4; i++) {
                    const px = area.cx + (i % 2) * 16;
                    const pz = area.cz + Math.floor(i / 2) * 12;
                    if (isExcluded(px, pz)) continue;
                    const h = Math.floor(Math.random() * 5) + 8;
                    buildResidentialBlock(px, pz, 14, 5, h, false);
                }
            });

            // Scatter individual trees
            for (let i = 0; i < 150; i++) {
                const tx = Math.floor(Math.random() * 300) - 150;
                const tz = Math.floor(Math.random() * 300) - 150;
                if (isExcluded(tx, tz)) continue;
                if (Math.random() > 0.6) buildTree(tx, tz, Math.random() > 0.5);
            }
        }

        // Build scene — geographically correct, spread like real Berlin
        buildFullCity();
        buildHotelParkInn(25, 15);         // SE of TV Tower, breathing room
        buildCathedral(-5, 12);            // Museum Island, well SW of TV Tower
        buildBrandenburgGate(-55, -5);     // ~2.5km W of TV Tower
        buildReichstag(-58, -22);          // well N of Brandenburg Gate
        buildSiegessaule(-95, -5);         // ~4km W, in Tiergarten
        buildTVTower(15, -5);              // Alexanderplatz — reference point, open plaza

        // Create single InstancedMesh with per-instance colors
        const geo = new THREE.BoxGeometry(VOXEL_GAP, VOXEL_GAP, VOXEL_GAP);
        const mat = new THREE.MeshLambertMaterial({ color: 0xffffff });

        const dummy = new THREE.Object3D();
        const tempColor = new THREE.Color();
        const matricesArr = new Float32Array(voxels.length * 16);
        const colorsArr = new Float32Array(voxels.length * 3);

        for (let i = 0; i < voxels.length; i++) {
            const v = voxels[i];
            dummy.position.set(v.x, v.y, v.z);
            dummy.updateMatrix();
            dummy.matrix.toArray(matricesArr, i * 16);
            tempColor.setHex(v.color);
            colorsArr[i * 3] = tempColor.r;
            colorsArr[i * 3 + 1] = tempColor.g;
            colorsArr[i * 3 + 2] = tempColor.b;
        }

        return { geometry: geo, material: mat, voxelCount: voxels.length, matrices: matricesArr, colors: colorsArr };
    }, []);

    const meshRef = React.useRef<THREE.InstancedMesh>(null);

    React.useEffect(() => {
        if (!meshRef.current) return;
        const mesh = meshRef.current;
        const dummy = new THREE.Matrix4();
        for (let i = 0; i < voxelCount; i++) {
            dummy.fromArray(matrices, i * 16);
            mesh.setMatrixAt(i, dummy);
        }
        mesh.instanceMatrix.needsUpdate = true;

        const tempColor = new THREE.Color();
        for (let i = 0; i < voxelCount; i++) {
            tempColor.setRGB(colors[i * 3], colors[i * 3 + 1], colors[i * 3 + 2]);
            mesh.setColorAt(i, tempColor);
        }
        if (mesh.instanceColor) mesh.instanceColor.needsUpdate = true;
    }, [voxelCount, matrices, colors]);

    return (
        <instancedMesh ref={meshRef} args={[geometry, material, voxelCount]} castShadow receiveShadow />
    );
};

// TV Tower position — camera always orbits around this
const TV_TOWER = new THREE.Vector3(15, 0, -5);

const CinematicCamera = () => {
    const timeRef = React.useRef(0);

    useFrame((state, delta) => {
        timeRef.current += delta;
        const t = timeRef.current;
        const cam = state.camera;

        // Slow rotation (full 360° every ~60s)
        const angle = t * 0.1;

        // Radius oscillates: min 55 (safe above buildings) → max 150 (panorama)
        const radiusBase = 102;
        const radiusAmplitude = 48;
        const radius = radiusBase + Math.sin(t * 0.25) * radiusAmplitude;

        // Height: 28 (above capped buildings at 14) → 80 (panoramic)
        const radiusNorm = (radius - (radiusBase - radiusAmplitude)) / (radiusAmplitude * 2);
        const heightLow = 28;
        const heightHigh = 80;
        const height = heightLow + radiusNorm * (heightHigh - heightLow);

        cam.position.x = TV_TOWER.x + Math.sin(angle) * radius;
        cam.position.z = TV_TOWER.z + Math.cos(angle) * radius;
        cam.position.y = height;

        const lookY = 25 + radiusNorm * 15;
        cam.lookAt(TV_TOWER.x, lookY, TV_TOWER.z);
    });

    return null;
};

export default function VoxelBerlinBackground() {
    return (
        <div className="absolute inset-0 z-[1] bg-[#a3dcfc] overflow-hidden pointer-events-none">
            <Canvas
                shadows
                camera={{ position: [0, 70, 150], fov: 60 }}
                gl={{ antialias: true, powerPreference: 'high-performance' }}
                className="w-full h-full"
            >
                <color attach="background" args={['#a3dcfc']} />
                <fogExp2 attach="fog" args={['#a3dcfc', 0.004]} />

                <ambientLight intensity={1.5} color="#504040" />
                <directionalLight
                    position={[-100, 60, 50]}
                    intensity={2.5}
                    color="#ffd0a0"
                    castShadow
                    shadow-mapSize={[2048, 2048]}
                >
                    <orthographicCamera attach="shadow-camera" args={[-120, 120, 120, -120, 0.5, 300]} />
                </directionalLight>
                <hemisphereLight args={['#a3dcfc', '#201510', 0.8]} />

                <VoxelCity />
                <CinematicCamera />
            </Canvas>

            {/* Vignette overlay */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,rgba(255,255,255,0.3)_100%)] pointer-events-none" />

            {/* Bottom gradient for section blend */}
            <div className="absolute inset-0 bg-gradient-to-t from-white/90 via-transparent to-transparent pointer-events-none" />
        </div>
    );
}
