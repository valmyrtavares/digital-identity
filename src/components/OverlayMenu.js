"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { useMenu } from "@/context/MenuContext";

// Adicionando coordenadas, tamanhos e cores individuais para espalhar caoticamente
const PROJECTS = [
  { title: "I. Gênesis Quântico", top: "15%", left: "5%", size: "text-4xl md:text-6xl", depth: 0.8 },
  { title: "II. Ressonância do Vazio", top: "40%", right: "10%", size: "text-5xl md:text-7xl", depth: 1.2 },
  { title: "III. Horizontes de Neon", top: "60%", left: "15%", size: "text-6xl md:text-8xl", depth: 1.5 },
  { title: "IV. Ecos do Silêncio", top: "10%", right: "20%", size: "text-3xl md:text-4xl", depth: 0.5 },
  { title: "V. Ondas Cromáticas", top: "75%", right: "25%", size: "text-5xl md:text-7xl", depth: 1.1 },
  { title: "VI. Desvio Temporal", top: "25%", left: "30%", size: "text-7xl md:text-9xl", depth: 2.0 }, // Maior, bem na frente
  { title: "VII. Matéria Escura", top: "80%", left: "5%", size: "text-3xl md:text-5xl", depth: 0.6 },
  { title: "VIII. Fluxo de Pragma", bottom: "10%", left: "45%", size: "text-4xl md:text-6xl", depth: 0.9 },
];

export default function OverlayMenu() {
  const { isMenuOpen, toggleMenu } = useMenu();
  const overlayRef = useRef(null);
  const menuItemsRef = useRef([]);

  useEffect(() => {
    gsap.set(overlayRef.current, { autoAlpha: 0 });
    gsap.set(menuItemsRef.current, { z: -500, autoAlpha: 0, rotationX: 45, scale: 0.5 });
  }, []);

  useEffect(() => {
    const tl = gsap.timeline();

    if (isMenuOpen) {
      // Aberto: fundo entra
      tl.to(overlayRef.current, {
        duration: 0.8,
        autoAlpha: 1,
        ease: "power3.inOut",
      })
      // Projetos surgem num formato escalonado de profundidade (z-axis)
      .to(menuItemsRef.current, {
        duration: 1.5,
        z: 0,
        autoAlpha: 1,
        rotationX: 0,
        scale: 1,
        stagger: 0.1,
        ease: "expo.out",
        onComplete: () => {
          // Após entrarem, eles começam a flutuar nas correntes
          menuItemsRef.current.forEach((el, i) => {
            const depth = PROJECTS[i].depth;
            gsap.to(el, {
              y: `+=${20 * depth}`,
              x: `+=${15 * depth}`,
              rotationZ: `+=${3 * depth}`,
              duration: 3 + Math.random() * 2,
              repeat: -1,
              yoyo: true,
              ease: "sine.inOut",
              overwrite: "auto",
            });
          });
        }
      }, "-=0.4");
    } else {
      // Parar as animações infinitas de flutuação para sair
      menuItemsRef.current.forEach((el) => gsap.killTweensOf(el));
      
      // Fechando: os itens caem pra trás e somem
      tl.to(menuItemsRef.current, {
        duration: 0.5,
        z: -300,
        y: 0,
        autoAlpha: 0,
        rotationX: 20,
        scale: 0.8,
        stagger: -0.02,
        ease: "power2.in",
      })
      // O overlay some
      .to(overlayRef.current, {
        duration: 0.6,
        autoAlpha: 0,
        ease: "power2.inOut",
      }, "-=0.2");
    }
  }, [isMenuOpen]);

  const addToRefs = (el, index) => {
    if (el) menuItemsRef.current[index] = el;
  };

  return (
    <>
      <button
        onClick={toggleMenu}
        className="fixed top-8 right-8 z-[60] w-14 h-14 rounded-full border border-white/5 bg-white/5 backdrop-blur-md flex flex-col items-center justify-center gap-1.5 transition-all duration-500 hover:bg-white/10 hover:border-white/20 group mix-blend-difference"
      >
        <span className={`w-6 h-[1px] bg-white transition-all duration-300 ${isMenuOpen ? "rotate-45 translate-y-[7px]" : ""}`} />
        <span className={`w-6 h-[1px] bg-white transition-all duration-300 ${isMenuOpen ? "opacity-0" : "opacity-100"}`} />
        <span className={`w-6 h-[1px] bg-white transition-all duration-300 ${isMenuOpen ? "-rotate-45 -translate-y-[7px]" : ""}`} />
      </button>

      <div
        ref={overlayRef}
        className="fixed inset-0 z-50 bg-black/70 backdrop-blur-md pointer-events-auto perspective-1000 overflow-hidden"
        style={{ perspective: "1200px" }}
      >
        <div className="relative w-full h-full">
          {PROJECTS.map((project, index) => (
            <div
              key={index}
              ref={(el) => addToRefs(el, index)}
              className={`absolute font-bold tracking-tighter text-transparent bg-clip-text bg-gradient-to-br from-white via-gray-300 to-indigo-900 cursor-pointer transition-colors duration-500 hover:to-pink-500 ${project.size}`}
              style={{
                top: project.top,
                bottom: project.bottom,
                left: project.left,
                right: project.right,
                transformStyle: "preserve-3d",
                zIndex: Math.round(project.depth * 10), // Os mais na frente ficam por cima
              }}
            >
              {project.title}
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
