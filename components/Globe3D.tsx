"use client";

import { useRef, useMemo, useState, useCallback } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, useTexture } from "@react-three/drei";
import * as THREE from "three";
import { COUNTRY_COORDS } from "../lib/countryCoords";

export interface GlobeMarker {
  countryCode: string;
  count: number;
}

interface Globe3DProps {
  markers: GlobeMarker[];
}

interface CountryData {
  code: string;
  name: string;
  count: number;
}

const COUNTRY_NAMES: Record<string, string> = {
  FR: "France", BE: "Belgique", CH: "Suisse", CA: "Canada",
  SN: "Senegal", CI: "Côté d'Ivoire", MA: "Maroc", DZ: "Algerie",
  TN: "Tunisie", CM: "Cameroun", CD: "RD Congo", HT: "Haiti",
  LU: "Luxembourg", MC: "Monaco", RE: "Reunion", GF: "Guyane",
  MQ: "Martinique", GP: "Guadeloupe", NC: "Nouvelle-Caledonie",
  PF: "Polynesie", BF: "Burkina Faso", BJ: "Benin", TD: "Tchad",
  CG: "Congo", GA: "Gabon", GN: "Guinee", ML: "Mali", MR: "Mauritanie",
  NE: "Niger", RW: "Rwanda", TG: "Togo", GB: "Royaume-Uni",
  US: "Etats-Unis", DE: "Allemagne", IT: "Italie", ES: "Espagne",
  PT: "Portugal", NL: "Pays-Bas", SE: "Suede", NO: "Norvege",
  DK: "Danemark", PL: "Pologne", UA: "Ukraine", RO: "Roumanie",
  RU: "Russie", CN: "Chine", IN: "Inde", JP: "Japon", KR: "Coree du Sud",
  AU: "Australie", BR: "Bresil", MX: "Mexique", AR: "Argentine",
  CL: "Chili", CO: "Colombie", PE: "Perou", EG: "Egypte",
  ZA: "Afrique du Sud", NG: "Nigeria", KE: "Kenya", MG: "Madagascar",
  MU: "Maurice", SC: "Seychelles"
};

function latLngToVector3(lat: number, lng: number, radius: number): THREE.Vector3 {
  const phi = (90 - lat) * (Math.PI / 180);
  const theta = (lng + 180) * (Math.PI / 180);
  return new THREE.Vector3(
    -radius * Math.sin(phi) * Math.cos(theta),
    radius * Math.cos(phi),
    radius * Math.sin(phi) * Math.sin(theta)
  );
}

function MarkerPin({ position, count, isSelected, onClick }: {
  position: THREE.Vector3;
  count: number;
  isSelected: boolean;
  onClick: () => void;
}) {
  const glowRef = useRef<THREE.Mesh>(null);
  const ringRef = useRef<THREE.Mesh>(null);
  const height = 0.06 + Math.min(count * 0.01, 0.08);
  const dir = position.clone().normalize();
  const tip = dir.clone().multiplyScalar(2.0 + height);
  const size = Math.min(0.02 + count * 0.005, 0.05);

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    if (glowRef.current) {
      const pulse = 1 + 0.4 * Math.sin(t * 2.5 + position.x);
      glowRef.current.scale.setScalar(pulse);
      (glowRef.current.material as THREE.MeshBasicMaterial).opacity = 0.15 + 0.12 * Math.sin(t * 2.5 + position.x);
    }
    if (ringRef.current) {
      ringRef.current.rotation.x = t * 0.8;
      ringRef.current.rotation.z = t * 0.5;
    }
  });

  const color = isSelected ? "#89c7ff" : "#4F8EF7";

  return (
    <group>
      <mesh position={tip} onClick={onClick}
        onPointerOver={() => { document.body.style.cursor = "pointer"; }}
        onPointerOut={() => { document.body.style.cursor = "default"; }}>
        <sphereGeometry args={[size, 12, 12]} />
        <meshBasicMaterial color={color} transparent opacity={0.95} depthTest={true} />
      </mesh>
      <mesh ref={glowRef} position={tip}>
        <sphereGeometry args={[size * 3, 12, 12]} />
        <meshBasicMaterial color={color} transparent opacity={0.15} depthWrite={false} />
      </mesh>
      <mesh ref={ringRef} position={tip} rotation={[Math.random(), Math.random(), Math.random()]}>
        <ringGeometry args={[size * 2.5, size * 3.5, 24]} />
        <meshBasicMaterial color={color} transparent opacity={0.2} depthWrite={false} side={THREE.DoubleSide} />
      </mesh>
      <mesh>
        <cylinderGeometry args={[0.004, 0.004, height, 4]} />
        <meshBasicMaterial color={color} transparent opacity={0.4} depthWrite={false} />
      </mesh>
    </group>
  );
}

function Stars() {
  const positions = useMemo(() => {
    const pos: number[] = [];
    for (let i = 0; i < 2000; i++) {
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      const r = 50 + Math.random() * 100;
      pos.push(r * Math.sin(phi) * Math.cos(theta));
      pos.push(r * Math.sin(phi) * Math.sin(theta));
      pos.push(r * Math.cos(phi));
    }
    return new Float32Array(pos);
  }, []);

  return (
    <points>
      <bufferGeometry>
        <bufferAttribute args={[positions, 3]} attach="attributes-position" />
      </bufferGeometry>
      <pointsMaterial size={0.15} color="#ffffff" transparent opacity={0.6} sizeAttenuation />
    </points>
  );
}

function ShootingStars() {
  const count = 5;
  const trails = useMemo(() =>
    Array.from({ length: count }, () => makeStar())
  , []);

  const pointsRef = useRef<THREE.Points>(null);

  useFrame((_, delta) => {
    if (!pointsRef.current) return;
    const pos = pointsRef.current.geometry.attributes.position;
    const array = pos.array as Float32Array;
    for (let i = 0; i < count; i++) {
      const t = trails[i];
      t.life += delta;
      if (t.life >= t.maxLife) {
        const reset = makeStar();
        trails[i] = reset;
        array[i * 3] = reset.start.x;
        array[i * 3 + 1] = reset.start.y;
        array[i * 3 + 2] = reset.start.z;
        continue;
      }
      const progress = t.life / t.maxLife;
      const x = t.start.x + t.dir.x * progress * 30;
      const y = t.start.y + t.dir.y * progress * 30;
      const z = t.start.z + t.dir.z * progress * 30;
      array[i * 3] = x;
      array[i * 3 + 1] = y;
      array[i * 3 + 2] = z;
    }
    pos.needsUpdate = true;
  });

  function makeStar() {
    const theta = Math.random() * Math.PI * 2;
    const phi = Math.acos(2 * Math.random() - 1);
    const r = 5 + Math.random() * 8;
    const start = new THREE.Vector3(
      r * Math.sin(phi) * Math.cos(theta),
      r * Math.sin(phi) * Math.sin(theta),
      r * Math.cos(phi)
    );
    const dir = start.clone().normalize().multiplyScalar(-1);
    return { start, dir, speed: 2 + Math.random() * 3, life: 0, maxLife: 1 + Math.random() * 2 };
  }

  const positions = useMemo(() => new Float32Array(count * 3), [count]);

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute args={[positions, 3]} attach="attributes-position" />
      </bufferGeometry>
      <pointsMaterial size={0.3} color="#ffffff" transparent opacity={0.8} sizeAttenuation />
    </points>
  );
}



function FloatingParticles() {
  const count = 150;
  const particlesRef = useRef<THREE.Points>(null);
  const speeds = useMemo(() => Float32Array.from({ length: count }, () => 0.01 + Math.random() * 0.03), []);

  const initial = useMemo(() => {
    const pos = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      const r = 2.4 + Math.random() * 1.5;
      pos[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      pos[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
      pos[i * 3 + 2] = r * Math.cos(phi);
    }
    return pos;
  }, []);

  useFrame((_, delta) => {
    if (!particlesRef.current) return;
    const pos = particlesRef.current.geometry.attributes.position;
    const array = pos.array as Float32Array;
    for (let i = 0; i < count; i++) {
      array[i * 3 + 1] += speeds[i] * delta * 0.5;
      if (array[i * 3 + 1] > 3.5) array[i * 3 + 1] = -3.5;
    }
    pos.needsUpdate = true;
  });

  return (
    <points ref={particlesRef}>
      <bufferGeometry>
        <bufferAttribute args={[initial, 3]} attach="attributes-position" />
      </bufferGeometry>
      <pointsMaterial size={0.03} color="#6d9eff" transparent opacity={0.4} sizeAttenuation />
    </points>
  );
}

function GlobeScene({ markers, onSelectCountry, selectedCountry }: {
  markers: GlobeMarker[];
  onSelectCountry: (code: string | null) => void;
  selectedCountry: string | null;
}) {
  const earthMap = useTexture("https://unpkg.com/three-globe/example/img/earth-blue-marble.jpg");
  const atmosphereRef = useRef<THREE.Mesh>(null);

  useFrame(({ clock }) => {
    if (atmosphereRef.current) {
      const pulse = 0.03 + 0.015 * Math.sin(clock.getElapsedTime() * 0.8);
      (atmosphereRef.current.material as THREE.MeshBasicMaterial).opacity = pulse;
    }
  });

  const markerData = useMemo(() => {
    return markers
      .map((m) => {
        const coords = COUNTRY_COORDS[m.countryCode];
        if (!coords) return null;
        return { ...m, position: latLngToVector3(coords[0], coords[1], 2.0) };
      })
      .filter(Boolean) as (GlobeMarker & { position: THREE.Vector3 })[];
  }, [markers]);

  return (
    <>
      <Stars />
      <ShootingStars />
      <FloatingParticles />
      <group>
        <ambientLight intensity={0.6} />
        <pointLight position={[5, 3, 5]} intensity={1.2} />
        <pointLight position={[-5, -3, -5]} intensity={0.4} color="#4F8EF7" />

        <mesh>
          <sphereGeometry args={[2, 64, 64]} />
          <meshStandardMaterial map={earthMap} roughness={0.6} metalness={0.05} />
        </mesh>

        <mesh>
          <sphereGeometry args={[2.04, 48, 48]} />
          <meshBasicMaterial color="#4F8EF7" transparent opacity={0.04} side={THREE.BackSide} />
        </mesh>
        <mesh ref={atmosphereRef}>
          <sphereGeometry args={[2.12, 32, 32]} />
          <meshBasicMaterial color="#89c7ff" transparent opacity={0.03} side={THREE.BackSide} />
        </mesh>

        {markerData.map((m) => (
          <MarkerPin
            key={m.countryCode}
            position={m.position}
            count={m.count}
            isSelected={selectedCountry === m.countryCode}
            onClick={() => onSelectCountry(selectedCountry === m.countryCode ? null : m.countryCode)}
          />
        ))}
      </group>
    </>
  );
}

function InfoPanel({ data, onClose }: { data: CountryData; onClose: () => void }) {
  const flagEmoji = getFlag(data.code);
  return (
    <div className="absolute top-4 left-4 z-10 rounded-xl border border-white/[0.1] bg-[#111]/90 backdrop-blur-md px-4 py-3 text-white shadow-lg animate-fadeIn">
      <div className="flex items-center gap-2 mb-1">
        <span className="text-[18px] leading-none">{flagEmoji}</span>
        <span className="text-[13px] font-semibold">{data.name}</span>
      </div>
      <div className="text-[11px] text-[#888] font-body-readable">
        {data.count} builder{data.count > 1 ? "s" : ""} actif{data.count > 1 ? "s" : ""}
      </div>
      <button
        type="button"
        onClick={onClose}
        className="absolute top-1.5 right-2.5 text-[#666] hover:text-white text-[16px] leading-none"
        aria-label="Fermer"
      >
        &times;
      </button>
    </div>
  );
}

function getFlag(code: string): string {
  const flags: Record<string, string> = {
    FR: "🇫🇷", BE: "🇧🇪", CH: "🇨🇭", CA: "🇨🇦", SN: "🇸🇳",
    CI: "🇨🇮", MA: "🇲🇦", DZ: "🇩🇿", TN: "🇹🇳", CM: "🇨🇲",
    CD: "🇨🇩", HT: "🇭🇹", LU: "🇱🇺", MC: "🇲🇨", RE: "🇷🇪",
    GF: "🇬🇫", MQ: "🇲🇶", GP: "🇬🇵", NC: "🇳🇨", PF: "🇵🇫",
    BF: "🇧🇫", BJ: "🇧🇯", TD: "🇹🇩", CG: "🇨🇬", GA: "🇬🇦",
    GN: "🇬🇳", ML: "🇲🇱", MR: "🇲🇷", NE: "🇳🇪", RW: "🇷🇼",
    TG: "🇹🇬", GB: "🇬🇧", US: "🇺🇸", DE: "🇩🇪", IT: "🇮🇹",
    ES: "🇪🇸", PT: "🇵🇹", NL: "🇳🇱", SE: "🇸🇪", NO: "🇳🇴",
    DK: "🇩🇰", PL: "🇵🇱", UA: "🇺🇦", RO: "🇷🇴", RU: "🇷🇺",
    CN: "🇨🇳", IN: "🇮🇳", JP: "🇯🇵", KR: "🇰🇷", AU: "🇦🇺",
    BR: "🇧🇷", MX: "🇲🇽", AR: "🇦🇷", CL: "🇨🇱", CO: "🇨🇴",
    PE: "🇵🇪", EG: "🇪🇬", ZA: "🇿🇦", NG: "🇳🇬", KE: "🇰🇪",
    MG: "🇲🇬", MU: "🇲🇺", SC: "🇸🇨"
  };
  return flags[code] || "🌍";
}

export default function Globe3D({ markers }: Globe3DProps) {
  const [selectedCountry, setSelectedCountry] = useState<string | null>(null);

  const selectedInfo: CountryData | null = useMemo(() => {
    if (!selectedCountry) return null;
    const marker = markers.find((m) => m.countryCode === selectedCountry);
    if (!marker) return null;
    return {
      code: selectedCountry,
      name: COUNTRY_NAMES[selectedCountry] || selectedCountry,
      count: marker.count
    };
  }, [selectedCountry, markers]);

  const handleSelectCountry = useCallback((code: string | null) => {
    setSelectedCountry(code);
  }, []);

  return (
    <div className="relative w-full h-[450px] md:h-[550px]">
      {selectedInfo ? <InfoPanel data={selectedInfo} onClose={() => setSelectedCountry(null)} /> : null}
      <Canvas camera={{ position: [0, 1.2, 4.5], fov: 45 }} gl={{ antialias: true, alpha: false }}>
        <color attach="background" args={["#05080f"]} />
        <GlobeScene
          markers={markers}
          onSelectCountry={handleSelectCountry}
          selectedCountry={selectedCountry}
        />
        <OrbitControls
          enableZoom={true}
          zoomSpeed={0.8}
          minDistance={2.8}
          maxDistance={12}
          enablePan={false}
          rotateSpeed={0.6}
          autoRotate
          autoRotateSpeed={0.6}
          minPolarAngle={0.1}
          maxPolarAngle={Math.PI - 0.1}
        />
      </Canvas>
    </div>
  );
}
