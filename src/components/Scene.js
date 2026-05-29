"use client";

import { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Float, MeshDistortMaterial, Environment } from '@react-three/drei';
import * as THREE from 'three';

// Componente do Objeto 3D interativo
function InteractiveShape() {
  const meshRef = useRef();

  // Rotacionar lentamente o objeto a cada frame
  useFrame((state, delta) => {
    if (meshRef.current) {
      meshRef.current.rotation.x += delta * 0.2;
      meshRef.current.rotation.y += delta * 0.3;
      
      // Fazer o objeto reagir sutilmente à posição do mouse
      meshRef.current.position.x = THREE.MathUtils.lerp(meshRef.current.position.x, (state.pointer.x * state.viewport.width) / 10, 0.05);
      meshRef.current.position.y = THREE.MathUtils.lerp(meshRef.current.position.y, (state.pointer.y * state.viewport.height) / 10, 0.05);
    }
  });

  return (
    <Float speed={2} rotationIntensity={1.5} floatIntensity={2}>
      <mesh ref={meshRef}>
        <icosahedronGeometry args={[1.5, 4]} />
        <MeshDistortMaterial
          color="#4f46e5"
          emissive="#1e1b4b"
          roughness={0.2}
          metalness={0.8}
          distort={0.4}
          speed={2}
          wireframe={true}
        />
      </mesh>
    </Float>
  );
}

// O Canvas principal que fica fixo no fundo
export default function Scene() {
  return (
    <div className="fixed top-0 left-0 w-full h-full z-[-1] bg-[#050505]">
      <Canvas camera={{ position: [0, 0, 5], fov: 45 }} dpr={[1, 2]}>
        <ambientLight intensity={0.5} />
        <directionalLight position={[10, 10, 5]} intensity={1} />
        
        <InteractiveShape />
        
        {/* Adiciona reflexos e iluminação de ambiente premium */}
        <Environment preset="city" />
      </Canvas>
    </div>
  );
}
