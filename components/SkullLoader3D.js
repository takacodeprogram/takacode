"use client";

import { Component, useEffect, useMemo, useRef, useState, Suspense } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { useGLTF } from "@react-three/drei";
import * as THREE from "three";

const SKULL_URL = "/skull.glb";
const FALLBACK_LOGO = "/logo-light-2.png";

// Precharge le modele pour les montages suivants (le fichier reste lourd).
useGLTF.preload(SKULL_URL);

// Capture les erreurs WebGL / de chargement du GLB et bascule sur le fallback.
class CanvasErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch() {
    if (typeof this.props.onError === "function") {
      this.props.onError();
    }
  }

  render() {
    if (this.state.hasError) {
      return null;
    }

    return this.props.children;
  }
}

// Cadre automatiquement le modele: on le centre et on le met a l'echelle pour
// qu'il tienne toujours dans la vue, quelle que soit sa taille native dans le GLB.
const TARGET_SIZE = 1.9;

function SkullModel({ mouse, onReady }) {
  const { scene } = useGLTF(SKULL_URL);
  const group = useRef();

  const fit = useMemo(() => {
    const box = new THREE.Box3().setFromObject(scene);
    const size = new THREE.Vector3();
    const center = new THREE.Vector3();
    box.getSize(size);
    box.getCenter(center);
    const maxDim = Math.max(size.x, size.y, size.z) || 1;
    const scale = TARGET_SIZE / maxDim;
    return {
      scale,
      position: [-center.x * scale, -center.y * scale, -center.z * scale]
    };
  }, [scene]);

  useEffect(() => {
    scene.traverse((child) => {
      if (child.isMesh && child.material) {
        child.material.envMapIntensity = 0.6;
      }
    });

    if (typeof onReady === "function") {
      onReady();
    }
  }, [scene, onReady]);

  useFrame(() => {
    if (!group.current) return;
    const targetRotX = mouse.current.y * 0.3;
    const targetRotY = mouse.current.x * 0.5;
    group.current.rotation.x = THREE.MathUtils.lerp(group.current.rotation.x, targetRotX, 0.06);
    group.current.rotation.y = THREE.MathUtils.lerp(group.current.rotation.y, targetRotY, 0.06);
  });

  return (
    <group ref={group}>
      <primitive object={scene} scale={fit.scale} position={fit.position} />
    </group>
  );
}

export default function SkullLoader3D() {
  const mouse = useRef({ x: 0, y: 0 });
  // "loading" -> fallback visible, on tente la 3D ; "ready" -> skull affiche ;
  // "error" -> WebGL/GLB indisponible, on reste sur le fallback.
  const [status, setStatus] = useState("loading");

  useEffect(() => {
    const onMove = (e) => {
      mouse.current.x = (e.clientY / window.innerHeight - 0.5) * 2;
      mouse.current.y = (e.clientX / window.innerWidth - 0.5) * 2;
    };
    window.addEventListener("mousemove", onMove);
    return () => window.removeEventListener("mousemove", onMove);
  }, []);

  return (
    <div className="skull-loader-3d">
      <img
        src={FALLBACK_LOGO}
        alt=""
        aria-hidden="true"
        className="skull-loader-fallback"
        data-hidden={status === "ready" ? "true" : "false"}
      />

      {status !== "error" ? (
        <CanvasErrorBoundary onError={() => setStatus("error")}>
          <Canvas
            camera={{ position: [0, 0, 3.2], fov: 40 }}
            style={{ background: "transparent" }}
            gl={{ alpha: true, antialias: true }}
            onCreated={({ gl }) => gl.setClearColor(0x000000, 0)}
          >
            <ambientLight intensity={0.5} />
            <directionalLight position={[3, 4, 5]} intensity={1.2} color="#4f8ef7" />
            <directionalLight position={[-3, 2, -2]} intensity={0.6} color="#22d3ee" />
            <pointLight position={[0, -2, 2]} intensity={0.4} color="#9b6dff" />
            <Suspense fallback={null}>
              <SkullModel mouse={mouse} onReady={() => setStatus("ready")} />
            </Suspense>
          </Canvas>
        </CanvasErrorBoundary>
      ) : null}
    </div>
  );
}
