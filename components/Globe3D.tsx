"use client";

import { useRef, useMemo, useState, useCallback } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
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
  const earthTexture = useMemo(() => {
    if (typeof document === "undefined") return new THREE.DataTexture(new Uint8Array([5, 8, 15]), 1, 1);
    const canvas = document.createElement("canvas");
    canvas.width = 1024;
    canvas.height = 512;
    const ctx = canvas.getContext("2d")!;

    const gradient = ctx.createLinearGradient(0, 0, 0, 512);
    gradient.addColorStop(0, "#0a1628");
    gradient.addColorStop(0.3, "#0d1f3d");
    gradient.addColorStop(0.5, "#0f2847");
    gradient.addColorStop(0.7, "#0d1f3d");
    gradient.addColorStop(1, "#0a1628");
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, 1024, 512);

    const continents = [
      { x: 520, y: 170, w: 60, h: 40 }, { x: 530, y: 210, w: 30, h: 50 },
      { x: 490, y: 230, w: 20, h: 60 }, { x: 300, y: 110, w: 70, h: 50 },
      { x: 310, y: 160, w: 80, h: 70 }, { x: 290, y: 230, w: 30, h: 40 },
      { x: 750, y: 90, w: 40, h: 30 }, { x: 750, y: 120, w: 30, h: 40 },
      { x: 770, y: 160, w: 20, h: 70 }, { x: 200, y: 290, w: 30, h: 30 },
      { x: 230, y: 320, w: 40, h: 40 }, { x: 210, y: 360, w: 20, h: 30 },
      { x: 860, y: 280, w: 50, h: 40 }, { x: 870, y: 320, w: 30, h: 30 },
      { x: 810, y: 370, w: 25, h: 25 }, { x: 650, y: 130, w: 20, h: 15 },
      { x: 640, y: 150, w: 15, h: 10 }, { x: 410, y: 340, w: 20, h: 15 },
      { x: 430, y: 350, w: 25, h: 20 },
    ];

    for (const c of continents) {
      ctx.beginPath();
      const rx = c.w / 2;
      const ry = c.h / 2;
      for (let i = 0; i <= 20; i++) {
        const angle = (i / 20) * Math.PI * 2;
        const px = c.x + rx * Math.cos(angle) + (Math.random() - 0.5) * rx * 0.3;
        const py = c.y + ry * Math.sin(angle) + (Math.random() - 0.5) * ry * 0.3;
        i === 0 ? ctx.moveTo(px, py) : ctx.lineTo(px, py);
      }
      ctx.closePath();
      ctx.fillStyle = "#1a3555";
      ctx.fill();
      ctx.strokeStyle = "#2a4a7f";
      ctx.lineWidth = 1;
      ctx.stroke();
    }

    ctx.strokeStyle = "rgba(79, 142, 247, 0.06)";
    ctx.lineWidth = 0.5;
    for (let i = 0; i < 24; i++) {
      const y = (i / 24) * 512;
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(1024, y);
      ctx.stroke();
    }
    for (let i = 0; i < 48; i++) {
      const x = (i / 48) * 1024;
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, 512);
      ctx.stroke();
    }

    const texture = new THREE.CanvasTexture(canvas);
    texture.wrapS = THREE.RepeatWrapping;
    texture.wrapT = THREE.ClampToEdgeWrapping;
    texture.repeat.set(1, 1);
    return texture;
  }, []);

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
          <meshStandardMaterial map={earthTexture} roughness={0.8} metalness={0.1} />
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
