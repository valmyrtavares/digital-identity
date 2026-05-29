"use client";

import { useRef, useState, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Float, MeshDistortMaterial, Environment, Sparkles } from '@react-three/drei';
import * as THREE from 'three';

// Componente do Objeto 3D interativo
function InteractiveShape() {
  const meshRef = useRef();
  const materialRef = useRef();
  
  // Estados de interação
  const [hovered, setHover] = useState(false);
  const [clicked, setClicked] = useState(false);

  // Rastrear scroll
  const scrollYRef = useRef(0);
  useEffect(() => {
    const handleScroll = () => {
      scrollYRef.current = window.scrollY;
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Animação a cada frame
  useFrame((state, delta) => {
    if (meshRef.current && materialRef.current) {
      // Rotação base que acelera se estiver hover ou clicado
      const targetSpeedX = clicked ? 2.0 : hovered ? 0.5 : 0.2;
      const targetSpeedY = clicked ? 3.0 : hovered ? 0.8 : 0.3;
      
      meshRef.current.rotation.x += delta * targetSpeedX;
      meshRef.current.rotation.y += delta * targetSpeedY;
      
      // Rotação extra baseada no scroll da página
      const targetScrollZ = scrollYRef.current * 0.002;
      meshRef.current.rotation.z = THREE.MathUtils.lerp(meshRef.current.rotation.z, targetScrollZ, 0.05);
      
      // Fazer o objeto seguir sutilmente o mouse, de forma mais agressiva se clicado
      const lerpFactor = clicked ? 0.15 : 0.05;
      meshRef.current.position.x = THREE.MathUtils.lerp(meshRef.current.position.x, (state.pointer.x * state.viewport.width) / 10, lerpFactor);
      meshRef.current.position.y = THREE.MathUtils.lerp(meshRef.current.position.y, (state.pointer.y * state.viewport.height) / 10, lerpFactor);
      
      // Animação fluida das propriedades do material (distorção e escala)
      const targetDistort = clicked ? 1.5 : hovered ? 0.8 : 0.4;
      const targetScale = clicked ? 1.5 : hovered ? 1.2 : 1.0;
      
      materialRef.current.distort = THREE.MathUtils.lerp(materialRef.current.distort, targetDistort, 0.1);
      meshRef.current.scale.setScalar(THREE.MathUtils.lerp(meshRef.current.scale.x, targetScale, 0.1));
      
      // Mudança de cor suave
      const targetColor = clicked ? new THREE.Color("#ec4899") : hovered ? new THREE.Color("#8b5cf6") : new THREE.Color("#4f46e5");
      materialRef.current.color.lerp(targetColor, 0.1);
    }
  });

  return (
    <Float speed={clicked ? 5 : 2} rotationIntensity={clicked ? 4 : 1.5} floatIntensity={clicked ? 4 : 2}>
      <mesh 
        ref={meshRef}
        onPointerOver={() => {
          setHover(true);
          document.body.style.cursor = 'pointer';
        }}
        onPointerOut={() => { 
          setHover(false); 
          setClicked(false);
          document.body.style.cursor = 'auto';
        }}
        onPointerDown={() => setClicked(true)}
        onPointerUp={() => setClicked(false)}
      >
        <icosahedronGeometry args={[1.5, 4]} />
        <MeshDistortMaterial
          ref={materialRef}
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

// Componente de Poeira Estelar (Stardust / Cacos de Vidro)
function Stardust() {
  const dustRef = useRef();

  useFrame((state, delta) => {
    if (dustRef.current) {
      // Rotaciona a poeira lentamente e com leve influência do mouse
      dustRef.current.rotation.y -= delta * 0.05;
      dustRef.current.rotation.x -= delta * 0.02;
      
      // Efeito paralaxe mais atrasado/lento em relação ao objeto principal (depth illusion)
      const lerpFactor = 0.02;
      dustRef.current.position.x = THREE.MathUtils.lerp(dustRef.current.position.x, (state.pointer.x * state.viewport.width) / 15, lerpFactor);
      dustRef.current.position.y = THREE.MathUtils.lerp(dustRef.current.position.y, (state.pointer.y * state.viewport.height) / 15, lerpFactor);
    }
  });

  return (
    <group ref={dustRef}>
      {/* Cacos mais brilhantes e ágeis */}
      <Sparkles count={150} scale={12} size={3} speed={0.8} opacity={0.8} color="#e879f9" noise={2} />
      {/* Poeira de fundo mais densa e lenta */}
      <Sparkles count={400} scale={15} size={1.5} speed={0.2} opacity={0.4} color="#818cf8" noise={1} />
    </group>
  );
}

// O Canvas principal que fica fixo no fundo
export default function Scene() {
  return (
    <div className="fixed top-0 left-0 w-full h-full z-[-1] bg-[#050505]">
      <Canvas camera={{ position: [0, 0, 5], fov: 45 }} dpr={[1, 2]}>
        <ambientLight intensity={0.5} />
        <directionalLight position={[10, 10, 5]} intensity={1} />
        
        <Stardust />
        <InteractiveShape />
        
        {/* Adiciona reflexos e iluminação de ambiente premium */}
        <Environment preset="city" />
      </Canvas>
    </div>
  );
}
