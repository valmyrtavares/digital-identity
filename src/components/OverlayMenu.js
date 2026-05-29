"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { useMenu } from "@/context/MenuContext";

// Textos em duas linhas, menores, com coordenadas para Desktop
const PROJECTS = [
  { line1: "I. Genesis", line2: "Quântico", top: "15%", left: "10%", size: "text-2xl md:text-3xl", depth: 0.8 },
  { line1: "II. Ressonância", line2: "do Vazio", top: "35%", right: "15%", size: "text-3xl md:text-4xl", depth: 1.2 },
  { line1: "III. Horizontes", line2: "de Neon", top: "55%", left: "20%", size: "text-4xl md:text-5xl", depth: 1.5 },
  { line1: "IV. Ecos", line2: "do Silêncio", top: "10%", right: "25%", size: "text-xl md:text-2xl", depth: 0.5 },
  { line1: "V. Ondas", line2: "Cromáticas", top: "70%", right: "30%", size: "text-2xl md:text-4xl", depth: 1.1 },
  { line1: "VI. Desvio", line2: "Temporal", top: "25%", left: "35%", size: "text-4xl md:text-6xl", depth: 2.0 },
  { line1: "VII. Matéria", line2: "Escura", top: "80%", left: "15%", size: "text-xl md:text-3xl", depth: 0.6 },
  { line1: "VIII. Fluxo", line2: "de Pragma", top: "85%", right: "15%", size: "text-2xl md:text-3xl", depth: 0.9 },
];

export default function OverlayMenu() {
  const { isMenuOpen, toggleMenu } = useMenu();
  const overlayRef = useRef(null);
  const menuItemsRef = useRef([]);
  const lightsRef = useRef([]);

  useEffect(() => {
    gsap.set(overlayRef.current, { autoAlpha: 0 });
    gsap.set(menuItemsRef.current, { z: -500, autoAlpha: 0, rotationX: 45, scale: 0.5 });
    gsap.set(lightsRef.current, { autoAlpha: 0, scale: 0 });
  }, []);

  useEffect(() => {
    const tl = gsap.timeline();

    if (isMenuOpen) {
      // Aberto: overlay fica visível (mas sem cor de fundo preta, totalmente transparente para a poeira)
      tl.to(overlayRef.current, {
        duration: 0.5,
        autoAlpha: 1,
        ease: "power2.inOut",
      })
      // Projetos surgem num formato escalonado de profundidade (z-axis)
      .to(menuItemsRef.current, {
        duration: 1.5,
        z: 0,
        autoAlpha: 1,
        rotationX: 0,
        scale: 1,
        stagger: 0.05,
        ease: "expo.out",
        onComplete: () => {
          // Após entrarem, animação infinita altamente imprevisível
          menuItemsRef.current.forEach((el, i) => {
            const depth = PROJECTS[i].depth;
            const dirX = Math.random() > 0.5 ? 1 : -1;
            const dirY = Math.random() > 0.5 ? 1 : -1;
            const rotDir = Math.random() > 0.5 ? 1 : -1;

            gsap.to(el, {
              y: `+=${(15 + Math.random() * 15) * depth * dirY}`,
              x: `+=${(10 + Math.random() * 15) * depth * dirX}`,
              rotationZ: `+=${(2 + Math.random() * 5) * depth * rotDir}`,
              rotationX: `+=${(Math.random() * 10) * rotDir}`,
              duration: 2.5 + Math.random() * 3,
              repeat: -1,
              yoyo: true,
              ease: "sine.inOut",
              overwrite: "auto",
            });
          });
        }
      }, "-=0.3")
      // Luzes espaciais aleatórias ascendem
      .to(lightsRef.current, {
        duration: 2,
        autoAlpha: Math.random() * 0.5 + 0.3,
        scale: 1,
        stagger: 0.2,
        ease: "power2.out",
        onComplete: () => {
          // Luzes flutuam aleatoriamente pela tela iluminando as letras e a poeira
          lightsRef.current.forEach((light) => {
            gsap.to(light, {
              x: () => (Math.random() - 0.5) * window.innerWidth * 0.8,
              y: () => (Math.random() - 0.5) * window.innerHeight * 0.8,
              autoAlpha: () => Math.random() * 0.6 + 0.1,
              duration: 5 + Math.random() * 5,
              repeat: -1,
              yoyo: true,
              ease: "sine.inOut",
            });
          });
        }
      }, "-=1.5");
      
    } else {
      // Parar as animações infinitas de flutuação para sair
      menuItemsRef.current.forEach((el) => gsap.killTweensOf(el));
      lightsRef.current.forEach((light) => gsap.killTweensOf(light));
      
      // Fechando: itens e luzes somem
      tl.to(menuItemsRef.current, {
        duration: 0.4,
        z: -200,
        y: 0,
        autoAlpha: 0,
        rotationX: 20,
        scale: 0.8,
        stagger: -0.02,
        ease: "power2.in",
      })
      .to(lightsRef.current, {
        duration: 0.4,
        autoAlpha: 0,
        scale: 0,
      }, "-=0.4")
      .to(overlayRef.current, {
        duration: 0.3,
        autoAlpha: 0,
        ease: "power2.inOut",
      }, "-=0.1");
    }
  }, [isMenuOpen]);

  const addToRefs = (el, index) => {
    if (el) menuItemsRef.current[index] = el;
  };
  const addLightToRefs = (el, index) => {
    if (el) lightsRef.current[index] = el;
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

      {/* Overlay com bg-transparent para ver a poeira 100% clara */}
      <div
        ref={overlayRef}
        className="fixed inset-0 z-50 bg-transparent pointer-events-auto perspective-1000 overflow-y-auto md:overflow-hidden"
        style={{ perspective: "1200px" }}
      >
        {/* Luzes Dinâmicas Cósmicas */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden flex items-center justify-center">
          {[1, 2, 3].map((_, i) => (
            <div
              key={`light-${i}`}
              ref={(el) => addLightToRefs(el, i)}
              className="absolute w-[40vw] h-[40vw] rounded-full"
              style={{
                background: "radial-gradient(circle, rgba(255,255,255,0.15) 0%, transparent 60%)",
                mixBlendMode: "screen",
                filter: "blur(40px)",
              }}
            />
          ))}
        </div>

        {/* Container do Menu. No mobile vira flex-col (sem sobreposição). No Desktop vira espaço relativo vazio. */}
        <div className="relative w-full min-h-full flex flex-col items-start justify-center md:block px-8 py-24 md:p-0">
          {PROJECTS.map((project, index) => (
            <div
              key={index}
              ref={(el) => addToRefs(el, index)}
              // classes: flex-col no mobile com margens. absolute no desktop usando style top/left.
              className={`md:absolute my-6 md:my-0 flex flex-col cursor-pointer group ${project.size}`}
              style={{
                // Somente aplicamos top/left/right em telas maiores via variável CSS (ignorado no mobile pois é static)
                top: project.top,
                left: project.left,
                right: project.right,
                transformStyle: "preserve-3d",
                zIndex: Math.round(project.depth * 10),
              }}
            >
              {/* Linha 1 */}
              <span className="font-light tracking-widest text-transparent bg-clip-text bg-gradient-to-br from-white via-gray-300 to-indigo-900 transition-colors duration-500 group-hover:to-pink-400">
                {project.line1}
              </span>
              {/* Linha 2 (Recuada e Menor) */}
              <span className="font-bold tracking-tighter text-transparent bg-clip-text bg-gradient-to-br from-white to-gray-500 transition-all duration-500 group-hover:tracking-normal group-hover:to-pink-500 ml-8 md:ml-12 text-[0.7em]">
                {project.line2}
              </span>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
