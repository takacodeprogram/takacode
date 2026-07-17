"use client";

import { useRef, useMemo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, Points } from "@react-three/drei";
import * as THREE from "three";
import { COUNTRY_COORDS } from "../lib/countryCoords";

export interface GlobeMarker {
  countryCode: string;
  count: number;
}

interface Globe3DProps {
  markers: GlobeMarker[];
}

function latLngToVector3(lat: number, lng: number, radius: number): THREE.Vector3 {
  const phi = (90 - lat) * (Math.PI / 180);
  const theta = (lng + 180) * (Math.PI / 180);
  const x = -radius * Math.sin(phi) * Math.cos(theta);
  const y = radius * Math.cos(phi);
  const z = radius * Math.sin(phi) * Math.sin(theta);
  return new THREE.Vector3(x, y, z);
}

function GlobeScene({ markers }: { markers: GlobeMarker[] }) {
  const groupRef = useRef<THREE.Group>(null);

  useFrame((_, delta) => {
    if (groupRef.current) {
      groupRef.current.rotation.y += delta * 0.1;
    }
  });

  const markerPositions = useMemo(() => {
    const positions: number[] = [];
    for (const m of markers) {
      const coords = COUNTRY_COORDS[m.countryCode];
      if (coords) {
        const pos = latLngToVector3(coords[0], coords[1], 2.15);
        positions.push(pos.x, pos.y, pos.z);
      }
    }
    return new Float32Array(positions);
  }, [markers]);

  const markerColors = useMemo(() => {
    const colors: number[] = [];
    for (const m of markers) {
      const coords = COUNTRY_COORDS[m.countryCode];
      if (coords) {
        const intensity = Math.min(1, 0.3 + m.count * 0.05);
        colors.push(0.3 * intensity, 0.6 * intensity, 1.0 * intensity);
      }
    }
    return new Float32Array(colors);
  }, [markers]);

  return (
    <group ref={groupRef}>
      <ambientLight intensity={0.4} />
      <pointLight position={[10, 10, 10]} intensity={0.8} />

      <mesh>
        <sphereGeometry args={[2, 48, 48]} />
        <meshStandardMaterial
          color="#1a2744"
          roughness={0.5}
          metalness={0.1}
          wireframe={false}
        />
      </mesh>

      <mesh>
        <sphereGeometry args={[2.01, 32, 32]} />
        <meshBasicMaterial
          color="#2a4a7f"
          wireframe
          transparent
          opacity={0.15}
        />
      </mesh>

      {markerPositions.length > 0 ? (
        <Points positions={markerPositions} colors={markerColors} sizes={new Float32Array(markers.length).fill(0.1)}>
          <pointsMaterial
            size={0.08}
            vertexColors
            transparent
            opacity={0.9}
            sizeAttenuation
          />
        </Points>
      ) : null}

      <mesh>
        <sphereGeometry args={[2.15, 24, 24]} />
        <meshBasicMaterial
          color="#4F8EF7"
          wireframe
          transparent
          opacity={0.06}
        />
      </mesh>
    </group>
  );
}

export default function Globe3D({ markers }: Globe3DProps) {
  return (
    <div className="w-full h-[400px] md:h-[500px]">
      <Canvas camera={{ position: [0, 0, 5.5], fov: 45 }}>
        <GlobeScene markers={markers} />
        <OrbitControls
          enableZoom={false}
          enablePan={false}
          rotateSpeed={0.5}
          autoRotate={false}
        />
      </Canvas>
    </div>
  );
}
