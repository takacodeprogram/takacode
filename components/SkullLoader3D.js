"use client";

import { useRef, useEffect, Suspense } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { useGLTF } from "@react-three/drei";
import * as THREE from "three";

function SkullModel({ mouse }) {
  const { scene } = useGLTF("/skull.glb");
  const ref = useRef();

  useEffect(() => {
    scene.traverse((child) => {
      if (child.isMesh) {
        child.material.envMapIntensity = 0.6;
      }
    });
  }, [scene]);

  useFrame(() => {
    if (!ref.current) return;
    const targetRotX = mouse.current.y * 0.3;
    const targetRotY = mouse.current.x * 0.5;
    ref.current.rotation.x = THREE.MathUtils.lerp(ref.current.rotation.x, targetRotX, 0.06);
    ref.current.rotation.y = THREE.MathUtils.lerp(ref.current.rotation.y, targetRotY, 0.06);
  });

  return (
    <primitive ref={ref} object={scene} scale={1.6} position={[0, -0.1, 0]} />
  );
}

export default function SkullLoader3D() {
  const mouse = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const onMove = (e) => {
      mouse.current.x = (e.clientY / window.innerHeight - 0.5) * 2;
      mouse.current.y = (e.clientX / window.innerWidth - 0.5) * 2;
    };
    window.addEventListener("mousemove", onMove);
    return () => window.removeEventListener("mousemove", onMove);
  }, []);

  return (
    <div style={{ width: "100%", height: "100%", position: "absolute", inset: 0 }}>
      <Canvas
        camera={{ position: [0, 0, 3.2], fov: 40 }}
        style={{ background: "transparent" }}
        gl={{ alpha: true, antialias: true }}
      >
        <ambientLight intensity={0.5} />
        <directionalLight position={[3, 4, 5]} intensity={1.2} color="#4f8ef7" />
        <directionalLight position={[-3, 2, -2]} intensity={0.6} color="#22d3ee" />
        <pointLight position={[0, -2, 2]} intensity={0.4} color="#9b6dff" />
        <Suspense fallback={null}>
          <SkullModel mouse={mouse} />
        </Suspense>
      </Canvas>
    </div>
  );
}
