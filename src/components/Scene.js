"use client";

import { useRef, useState, useEffect, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Float, MeshDistortMaterial, Environment, Sparkles, Text, Html, Ring, Plane } from '@react-three/drei';
import * as THREE from 'three';
import { useMenu } from "@/context/MenuContext";

// Componente do Objeto 3D interativo
function InteractiveShape() {
  const meshRef = useRef();
  const materialRef = useRef();
  const { toggleMenu } = useMenu();
  
  // Estados de interação
  const [hovered, setHover] = useState(false);
  const [clicked, setClicked] = useState(false);

  // Rastrear scroll e cliques globais
  const scrollYRef = useRef(0);
  useEffect(() => {
    const handleScroll = () => {
      scrollYRef.current = window.scrollY;
    };
    
    const handleMouseDown = () => setClicked(true);
    const handleMouseUp = () => setClicked(false);

    window.addEventListener("scroll", handleScroll);
    window.addEventListener("mousedown", handleMouseDown);
    window.addEventListener("mouseup", handleMouseUp);
    
    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("mousedown", handleMouseDown);
      window.removeEventListener("mouseup", handleMouseUp);
    };
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
      
      // Lógica de fade out baseado no scroll (após 2.5x a altura da tela)
      const fadeThreshold = window.innerHeight * 2.5;
      const scrollY = scrollYRef.current;
      const fadeProgress = Math.max(0, Math.min((scrollY - fadeThreshold) / (window.innerHeight * 0.5), 1));
      
      // Fazer o objeto seguir sutilmente o mouse (Esquerda, Direita e Profundidade)
      const lerpFactor = clicked ? 0.15 : 0.05;
      
      const targetX = (state.pointer.x * state.viewport.width) / 6;
      // Adiciona o deslocamento para cima quando faz scroll (fadeProgress * 10)
      const targetY = ((state.pointer.y * state.viewport.height) / 6) + (fadeProgress * 15);
      // Empurra o objeto pro fundo (eixo Z) dependendo de quão longe o mouse está do centro
      const targetZ = -Math.abs(state.pointer.x * 2) - Math.abs(state.pointer.y * 2);

      meshRef.current.position.x = THREE.MathUtils.lerp(meshRef.current.position.x, targetX, lerpFactor);
      meshRef.current.position.y = THREE.MathUtils.lerp(meshRef.current.position.y, targetY, lerpFactor);
      meshRef.current.position.z = THREE.MathUtils.lerp(meshRef.current.position.z, targetZ, lerpFactor);
      
      // Animação fluida das propriedades do material (distorção e escala)
      const targetDistort = clicked ? 1.5 : hovered ? 0.8 : 0.4;
      // Encolhe a bola conforme faz scroll
      const targetScale = (clicked ? 1.5 : hovered ? 1.2 : 1.0) * (1 - fadeProgress);
      
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
        onClick={() => { toggleMenu(); }}
        onPointerOver={() => {
          setHover(true);
          document.body.style.cursor = 'pointer';
        }}
        onPointerOut={() => { 
          setHover(false); 
          document.body.style.cursor = 'auto';
        }}
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
      const targetX = (state.pointer.x * state.viewport.width) / 10;
      const targetY = (state.pointer.y * state.viewport.height) / 10;
      const targetZ = -Math.abs(state.pointer.x * 4) - Math.abs(state.pointer.y * 4); // Poeira recua mais no eixo Z

      dustRef.current.position.x = THREE.MathUtils.lerp(dustRef.current.position.x, targetX, lerpFactor);
      dustRef.current.position.y = THREE.MathUtils.lerp(dustRef.current.position.y, targetY, lerpFactor);
      dustRef.current.position.z = THREE.MathUtils.lerp(dustRef.current.position.z, targetZ, lerpFactor);
    }
  });

  return (
    <group ref={dustRef}>
      {/* Cacos mais brilhantes e ágeis (Luz incidindo) */}
      <Sparkles count={300} scale={18} size={6} speed={1.2} opacity={1} color="#fbcfe8" noise={2} />
      {/* Poeira de fundo muito mais densa e iluminada */}
      <Sparkles count={1500} scale={25} size={3} speed={0.4} opacity={0.7} color="#c7d2fe" noise={1} />
    </group>
  );
}

// Adicionado \uFE0E para forçar o navegador a renderizar como texto (monocromático, sem formato de emoji "moeda")
const ZODIAC_SIGNS = ['♈\uFE0E', '♉\uFE0E', '♊\uFE0E', '♋\uFE0E', '♌\uFE0E', '♍\uFE0E', '♎\uFE0E', '♏\uFE0E', '♐\uFE0E', '♑\uFE0E', '♒\uFE0E', '♓\uFE0E'];

function ZodiacRing({ toggleMenu }) {
  const groupRef = useRef();
  const wheelBgRef = useRef();
  const textGroupRef = useRef();
  const htmlRefs = useRef([]);
  
  // Rastrear scroll localmente
  const scrollYRef = useRef(0);
  useEffect(() => {
    const handleScroll = () => { scrollYRef.current = window.scrollY; };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Gerar posições aleatórias iniciais
  const randomPositions = useMemo(() => {
    return ZODIAC_SIGNS.map(() => ({
      x: (Math.random() - 0.5) * 40,
      y: (Math.random() - 0.5) * 40,
      z: (Math.random() - 0.5) * 20 - 10,
      rotZ: Math.random() * Math.PI * 2
    }));
  }, []);

  // Preparar os elementos da roda astrológica (casas)
  const wheelElements = useMemo(() => {
    const lines = [];
    for (let i = 0; i < 12; i++) {
      // Linhas principais que separam as casas
      const angle = (i / 12) * Math.PI * 2 + (Math.PI / 12);
      const length = 1.2;
      const centerX = Math.cos(angle) * (0.9 + length / 2);
      const centerY = Math.sin(angle) * (0.9 + length / 2);
      
      // Para as direções cardeais, faremos linhas duplas mais sofisticadas
      const isCardinal = i % 3 === 0;
      
      if (isCardinal) {
        // Linha dupla
        const offset = 0.015;
        lines.push(
          <Plane key={`c1-${i}`} args={[length, 0.01]} position={[centerX - Math.sin(angle)*offset, centerY + Math.cos(angle)*offset, 0]} rotation={[0, 0, angle]}>
            <meshBasicMaterial color="#a78bfa" transparent opacity={0} userData={{ baseOpacity: 0.6 }} />
          </Plane>,
          <Plane key={`c2-${i}`} args={[length, 0.01]} position={[centerX + Math.sin(angle)*offset, centerY - Math.cos(angle)*offset, 0]} rotation={[0, 0, angle]}>
            <meshBasicMaterial color="#a78bfa" transparent opacity={0} userData={{ baseOpacity: 0.6 }} />
          </Plane>
        );
      } else {
        // Linha simples
        lines.push(
          <Plane key={`s-${i}`} args={[length, 0.01]} position={[centerX, centerY, 0]} rotation={[0, 0, angle]}>
            <meshBasicMaterial color="#8b5cf6" transparent opacity={0} userData={{ baseOpacity: 0.3 }} />
          </Plane>
        );
      }
    }
    return lines;
  }, []);

  const [oracleVisible, setOracleVisible] = useState(false);

  useFrame((state, delta) => {
    if (!groupRef.current || !textGroupRef.current) return;
    
    // O evento aproveita o espaço de scroll (500vh no total)
    const startScroll = window.innerHeight * 2.8;
    const endScroll = window.innerHeight * 4.8;
    
    let progress = 0;
    if (scrollYRef.current > startScroll) {
      progress = Math.min((scrollYRef.current - startScroll) / (endScroll - startScroll), 1);
    }
    
    // A roda aparece e já começa rodar assim que o shape principal começa a subir (2.5)
    const wheelStartScroll = window.innerHeight * 2.5;
    let wheelProgress = 0;
    if (scrollYRef.current > wheelStartScroll) {
       wheelProgress = Math.min((scrollYRef.current - wheelStartScroll) / (window.innerHeight * 0.5), 1);
    }
    
    // Rotaciona ativamente com o scroll para dar fisicalidade
    const targetRotation = -scrollYRef.current * 0.0015;
    groupRef.current.rotation.z = THREE.MathUtils.lerp(groupRef.current.rotation.z, targetRotation, 0.05);
    
    const radius = 1.5;
    const texts = textGroupRef.current.children;
    
    // Função Easing Cubic Out para um fim bem mais suave
    const easeProgress = 1 - Math.pow(1 - progress, 3);
    
    for (let i = 0; i < 12; i++) {
      const mesh = texts[i];
      if (!mesh) continue;
      
      const angle = (i / 12) * Math.PI * 2;
      
      const targetX = Math.cos(angle) * radius;
      const targetY = Math.sin(angle) * radius;
      const targetZ = 0;
      
      // Movimento de "dança" em espiral até o ponto de ancoragem final
      const spiralScale = (1 - easeProgress) * 5;
      const spiralAngle = easeProgress * Math.PI * 8 + randomPositions[i].rotZ;
      
      const dx = Math.cos(spiralAngle) * spiralScale;
      const dy = Math.sin(spiralAngle) * spiralScale;
      
      // Balanço vertical flutuante contínuo simulando ar/3d independente do scroll
      const floatOffset = Math.sin(state.clock.elapsedTime * 2 + i) * 0.3;
      
      const currentX = THREE.MathUtils.lerp(randomPositions[i].x, targetX, easeProgress) + dx;
      const currentY = THREE.MathUtils.lerp(randomPositions[i].y, targetY, easeProgress) + dy;
      const currentZ = THREE.MathUtils.lerp(randomPositions[i].z, targetZ, easeProgress) + floatOffset;
      
      mesh.position.set(currentX, currentY, currentZ);
      
      // Ajusta a opacidade durante a dança (agora via HTML ref)
      if (htmlRefs.current[i]) {
        htmlRefs.current[i].style.opacity = Math.min(easeProgress * 1.5, 1);
      }
      
      // Rotação para que os signos fiquem legíveis
      mesh.rotation.z = -groupRef.current.rotation.z;
    }
    
    // Anima a roda (casas dos signos) desde o começo do evento
    if (wheelBgRef.current) {
      // A roda aparece com o wheelProgress (bem antes de formarem o círculo)
      const bgOpacity = wheelProgress;
      const bgScale = 0.8 + wheelProgress * 0.2; // Escala leve, pois já nasce meio grande
      
      wheelBgRef.current.scale.setScalar(bgScale);
      
      wheelBgRef.current.traverse((child) => {
        if (child.isMesh && child.material && child.material.userData && child.material.userData.baseOpacity !== undefined) {
          child.material.opacity = bgOpacity * child.material.userData.baseOpacity;
        }
      });
    }
    
    if (progress > 0.95 !== oracleVisible) {
      setOracleVisible(progress > 0.95);
    }
  });

  return (
    <group>
      <group ref={groupRef}>
        <group ref={wheelBgRef}>
          <Ring args={[2.1, 2.12, 64]}>
            <meshBasicMaterial color="#8b5cf6" transparent opacity={0} userData={{ baseOpacity: 0.6 }} side={THREE.DoubleSide} />
          </Ring>
          {/* Aro decorativo bem fino externo */}
          <Ring args={[2.15, 2.155, 64]}>
            <meshBasicMaterial color="#a78bfa" transparent opacity={0} userData={{ baseOpacity: 0.4 }} side={THREE.DoubleSide} />
          </Ring>
          <Ring args={[0.9, 0.92, 64]}>
            <meshBasicMaterial color="#8b5cf6" transparent opacity={0} userData={{ baseOpacity: 0.6 }} side={THREE.DoubleSide} />
          </Ring>
          {wheelElements}
        </group>

        <group ref={textGroupRef}>
          {ZODIAC_SIGNS.map((sign, i) => (
            <group key={i}>
              <Html transform center zIndexRange={[100, 0]}>
                <div 
                  ref={el => htmlRefs.current[i] = el}
                  style={{
                    fontFamily: '"Segoe UI Symbol", "Apple Symbols", sans-serif',
                    color: '#a78bfa',
                    fontSize: '1rem',
                    opacity: 0,
                    userSelect: 'none',
                    lineHeight: 1
                  }}
                >
                  {sign}
                </div>
              </Html>
            </group>
          ))}
        </group>
      </group>

    </group>
  );
}

// O Canvas principal que fica fixo no fundo
export default function Scene() {
  const { isMenuOpen, toggleMenu } = useMenu();

  return (
    <div className="fixed top-0 left-0 w-full h-full z-[-1] bg-[#050505]">
      <Canvas camera={{ position: [0, 0, 5], fov: 45 }} dpr={[1, 2]}>
        <ambientLight intensity={0.5} />
        <directionalLight position={[10, 10, 5]} intensity={1} />
        
        <Stardust />
        <ZodiacRing toggleMenu={toggleMenu} />
        {!isMenuOpen && <InteractiveShape />}
        
        {/* Adiciona reflexos e iluminação de ambiente premium */}
        <Environment preset="city" />
      </Canvas>
    </div>
  );
}
