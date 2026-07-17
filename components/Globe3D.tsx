"use client";

import { useRef, useMemo, useState } from "react";
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
  SN: "Senegal", CI: "Cote d'Ivoire", MA: "Maroc", DZ: "Algerie",
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

function MarkerPulse({ position, count, isSelected, onClick }: {
  position: THREE.Vector3;
  count: number;
  isSelected: boolean;
  onClick: () => void;
}) {
  const meshRef = useRef<THREE.Mesh>(null);
  const glowRef = useRef<THREE.Mesh>(null);

  useFrame(({ clock }) => {
    if (glowRef.current) {
      const pulse = 1 + 0.3 * Math.sin(clock.getElapsedTime() * 2 + position.x);
      glowRef.current.scale.setScalar(pulse);
      (glowRef.current.material as THREE.MeshBasicMaterial).opacity = 0.2 + 0.15 * Math.sin(clock.getElapsedTime() * 2 + position.x);
    }
    if (meshRef.current) {
      meshRef.current.scale.setScalar(1 + 0.1 * Math.sin(clock.getElapsedTime() * 1.5 + position.y));
    }
  });

  const size = Math.min(0.06 + count * 0.015, 0.15);

  return (
    <group position={position}>
      <mesh ref={glowRef}>
        <circleGeometry args={[size * 3, 16]} />
        <meshBasicMaterial color="#4F8EF7" transparent opacity={0.2} depthWrite={false} />
      </mesh>
      <mesh ref={meshRef} onClick={onClick}
        onPointerOver={() => { document.body.style.cursor = "pointer"; }}
        onPointerOut={() => { document.body.style.cursor = "default"; }}>
        <circleGeometry args={[size, 16]} />
        <meshBasicMaterial color={isSelected ? "#89c7ff" : "#4F8EF7"} transparent opacity={0.95} depthWrite={false} />
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

function GlobeScene({ markers, onSelectCountry, selectedCountry }: {
  markers: GlobeMarker[];
  onSelectCountry: (code: string | null) => void;
  selectedCountry: string | null;
}) {
  const earthMap = useTexture("https://unpkg.com/three-globe/example/img/earth-blue-marble.jpg");

  const markerData = useMemo(() => {
    return markers
      .map((m) => {
        const coords = COUNTRY_COORDS[m.countryCode];
        if (!coords) return null;
        return { ...m, position: latLngToVector3(coords[0], coords[1], 2.08) };
      })
      .filter(Boolean) as (GlobeMarker & { position: THREE.Vector3 })[];
  }, [markers]);

  return (
    <>
      <Stars />
      <group>
        <ambientLight intensity={0.6} />
        <pointLight position={[5, 3, 5]} intensity={1.2} />
        <pointLight position={[-5, -3, -5]} intensity={0.4} color="#4F8EF7" />

        <mesh>
          <sphereGeometry args={[2, 64, 64]} />
          <meshStandardMaterial map={earthMap} roughness={0.6} metalness={0.05} />
        </mesh>

        {markerData.map((m) => (
          <MarkerPulse
            key={m.countryCode}
            position={m.position}
            count={m.count}
            isSelected={selectedCountry === m.countryCode}
            onClick={() => onSelectCountry(selectedCountry === m.countryCode ? null : m.countryCode)}
          />
        ))}

        <mesh>
          <sphereGeometry args={[2.04, 48, 48]} />
          <meshBasicMaterial color="#4F8EF7" transparent opacity={0.04} side={THREE.BackSide} />
        </mesh>
        <mesh>
          <sphereGeometry args={[2.12, 32, 32]} />
          <meshBasicMaterial color="#4F8EF7" transparent opacity={0.025} side={THREE.BackSide} />
        </mesh>
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

  return (
    <div className="relative w-full h-[450px] md:h-[550px]">
      {selectedInfo ? <InfoPanel data={selectedInfo} onClose={() => setSelectedCountry(null)} /> : null}
      <Canvas camera={{ position: [0, 0, 5.5], fov: 45 }} gl={{ antialias: true, alpha: false }}>
        <color attach="background" args={["#05080f"]} />
        <GlobeScene
          markers={markers}
          onSelectCountry={setSelectedCountry}
          selectedCountry={selectedCountry}
        />
        <OrbitControls
          enableZoom={false}
          enablePan={false}
          rotateSpeed={0.6}
          autoRotate
          autoRotateSpeed={0.8}
          minPolarAngle={Math.PI / 4}
          maxPolarAngle={Math.PI / 1.5}
        />
      </Canvas>
    </div>
  );
}
