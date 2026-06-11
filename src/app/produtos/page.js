"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { useRouter } from "next/navigation";
import { useLanguage } from "@/context/LanguageContext";

const PROJECTS = [
  { line1_pt: "I. Genesis", line2_pt: "Quântico", line1_en: "I. Quantum", line2_en: "Genesis", business_pt: "Websites", business_en: "Websites", top: "15%", left: "10%", size: "text-2xl md:text-3xl", depth: 0.8, slug: "genesis" },
  { line1_pt: "II. Ressonância", line2_pt: "do Vazio", line1_en: "II. Resonance", line2_en: "of the Void", business_pt: "Landing Pages", business_en: "Landing Pages", top: "35%", right: "15%", size: "text-3xl md:text-4xl", depth: 1.2, slug: "ressonancia" },
  { line1_pt: "III. Horizontes", line2_pt: "de Neon", line1_en: "III. Neon", line2_en: "Horizons", business_pt: "Soluções Customizadas", business_en: "Custom Software", top: "55%", left: "20%", size: "text-4xl md:text-5xl", depth: 1.5, slug: "horizontes" },
  { line1_pt: "IV. Ecos", line2_pt: "do Silêncio", line1_en: "IV. Echoes", line2_en: "of Silence", business_pt: "Edição de Vídeo", business_en: "Video Editing", top: "10%", right: "25%", size: "text-xl md:text-2xl", depth: 0.5, slug: "ecos" },
  { line1_pt: "V. Ondas", line2_pt: "Cromáticas", line1_en: "V. Chromatic", line2_en: "Waves", business_pt: "Meus Produtos", business_en: "My Products", top: "70%", right: "30%", size: "text-2xl md:text-4xl", depth: 1.1, slug: "ondas" },
  { line1_pt: "VI. Desvio", line2_pt: "Temporal", line1_en: "VI. Temporal", line2_en: "Deviation", business_pt: "ERP Gastronômico", business_en: "Gastronomic ERP", top: "25%", left: "35%", size: "text-4xl md:text-6xl", depth: 2.0, slug: "desvio" },
  { line1_pt: "VII. Matéria", line2_pt: "Escura", line1_en: "VII. Dark", line2_en: "Matter", business_pt: "Desenvolvedor Full Stack", business_en: "Full Stack Developer", top: "80%", left: "15%", size: "text-xl md:text-3xl", depth: 0.6, slug: "materia" },
  { line1_pt: "VIII. Fluxo", line2_pt: "de Pragma", line1_en: "VIII. Pragma", line2_en: "Flow", business_pt: "Consultoria Tech", business_en: "Tech Consulting", top: "85%", right: "15%", size: "text-2xl md:text-3xl", depth: 0.9, slug: "fluxo" },
];

const GLITCH_CHARS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()_+-=[]{}|;':,./<>?";

const GlitchItem = ({ project, index, addToRefs }) => {
  const { language } = useLanguage();
  const line1 = language === 'pt' ? project.line1_pt : project.line1_en;
  const line2 = language === 'pt' ? project.line2_pt : project.line2_en;
  const business = language === 'pt' ? project.business_pt : project.business_en;
  
  const [displayText, setDisplayText] = useState(`${line1} ${line2}`);
  const [isHovered, setIsHovered] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const intervalRef = useRef(null);
  const hoverStateRef = useRef(false);
  const router = useRouter();

  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
      if (mobile) {
        setIsHovered(true);
        setDisplayText(business.toUpperCase());
      } else if (!isHovered && !hoverStateRef.current) {
        setIsHovered(false);
        setDisplayText(`${line1} ${line2}`);
      }
    };
    
    handleResize(); // Initial check
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [project, line1, line2, business]);

  useEffect(() => {
    if (!isHovered && !isMobile) {
      setDisplayText(`${line1} ${line2}`);
    } else if (isMobile) {
      setDisplayText(business.toUpperCase());
    }
  }, [language, line1, line2, business]);

  useEffect(() => {
    if (isMobile) return;
    
    let isCancelled = false;
    let cycleTimeout;
    let revertTimeout;
    
    const runCycle = () => {
      if (isCancelled) return;
      
      if (!hoverStateRef.current) {
        setIsHovered(true);
        doGlitch(business.toUpperCase());
      }
      
      revertTimeout = setTimeout(() => {
        if (isCancelled) return;
        if (!hoverStateRef.current) {
          setIsHovered(false);
          doGlitch(`${line1} ${line2}`);
        }
      }, 2500);
      
      cycleTimeout = setTimeout(runCycle, 6000); // Reinicia o ciclo a cada 6 segundos
    };

    const initialDelay = 800 + index * 300;
    cycleTimeout = setTimeout(runCycle, initialDelay);

    return () => {
      isCancelled = true;
      clearTimeout(cycleTimeout);
      clearTimeout(revertTimeout);
    };
  }, [isMobile, project, index]);

  const doGlitch = (targetText) => {
    let iteration = 0;
    clearInterval(intervalRef.current);
    
    intervalRef.current = setInterval(() => {
      setDisplayText((prev) => {
        return targetText
          .split("")
          .map((letter, i) => {
            if (i < iteration) {
              return targetText[i];
            }
            return GLITCH_CHARS[Math.floor(Math.random() * GLITCH_CHARS.length)];
          })
          .join("");
      });
      
      if (iteration >= targetText.length) {
        clearInterval(intervalRef.current);
      }
      iteration += 1 / 3;
    }, 30);
  };

  const handleMouseEnter = () => {
    if (isMobile) return;
    hoverStateRef.current = true;
    setIsHovered(true);
    doGlitch(business.toUpperCase());
  };

  const handleMouseLeave = () => {
    if (isMobile) return;
    hoverStateRef.current = false;
    setIsHovered(false);
    doGlitch(`${line1} ${line2}`);
  };

  const handleClick = (e) => {
    e.currentTarget.innerHTML = `<span class='text-white font-mono text-2xl tracking-widest bg-black/50 px-4 py-2 rounded-full border border-white/20'>${language === 'pt' ? 'CARREGANDO...' : 'LOADING...'}</span>`;
    router.push(`/produtos/${project.slug}`);
  };

  return (
    <div
      ref={(el) => addToRefs(el, index)}
      className={`md:absolute my-6 md:my-0 flex flex-col cursor-pointer group ${project.size}`}
      style={{
        top: project.top,
        left: project.left,
        right: project.right,
        transformStyle: "preserve-3d",
        zIndex: Math.round(project.depth * 10),
      }}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onClick={handleClick}
    >
      <span className={`font-light tracking-widest transition-all duration-300 ${isHovered ? 'text-pink-300 drop-shadow-[0_0_15px_rgba(236,72,153,0.8)] font-mono font-bold tracking-tight' : 'text-transparent bg-clip-text bg-gradient-to-br from-indigo-400 via-purple-400 to-pink-400'}`}>
        {isHovered ? displayText : line1}
      </span>
      {!isHovered && (
        <span className="font-bold tracking-tighter text-transparent bg-clip-text bg-gradient-to-br from-pink-300 to-purple-500 transition-all duration-500 ml-8 md:ml-12 text-[0.7em]">
          {line2}
        </span>
      )}
    </div>
  );
};

export default function ProdutosPage() {
  const overlayRef = useRef(null);
  const menuItemsRef = useRef([]);
  const lightsRef = useRef([]);
  const router = useRouter();

  useEffect(() => {
    gsap.set(overlayRef.current, { autoAlpha: 0 });
    gsap.set(menuItemsRef.current, { z: -500, autoAlpha: 0, rotationX: 45, scale: 0.5 });
    gsap.set(lightsRef.current, { autoAlpha: 0, scale: 0 });

    const tl = gsap.timeline();

    tl.to(overlayRef.current, {
      duration: 0.5,
      autoAlpha: 1,
      ease: "power2.inOut",
    })
    .to(menuItemsRef.current, {
      duration: 1.5,
      z: 0,
      autoAlpha: 1,
      rotationX: 0,
      scale: 1,
      stagger: 0.05,
      ease: "expo.out",
      onComplete: () => {
        menuItemsRef.current.forEach((el, i) => {
          if (!el) return;
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
    .to(lightsRef.current, {
      duration: 2,
      autoAlpha: Math.random() * 0.5 + 0.3,
      scale: 1,
      stagger: 0.2,
      ease: "power2.out",
      onComplete: () => {
        lightsRef.current.forEach((light) => {
          if (!light) return;
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

    return () => {
      menuItemsRef.current.forEach((el) => { if(el) gsap.killTweensOf(el) });
      lightsRef.current.forEach((light) => { if(light) gsap.killTweensOf(light) });
    };
  }, []);

  const addToRefs = (el, index) => {
    if (el) menuItemsRef.current[index] = el;
  };
  const addLightToRefs = (el, index) => {
    if (el) lightsRef.current[index] = el;
  };

  return (
    <main className="relative w-full min-h-screen overflow-hidden bg-transparent">
      {/* Botão Fechar (X) para voltar à Home */}
      <button
        onClick={() => router.push('/')}
        className="fixed top-8 right-8 z-[60] w-14 h-14 rounded-full border border-white/20 bg-black/40 backdrop-blur-xl flex items-center justify-center transition-all duration-500 hover:bg-white/20 hover:scale-110 active:scale-95 group shadow-xl cursor-pointer"
      >
        <span className="absolute w-6 h-[2px] bg-white rotate-45 transition-transform group-hover:rotate-90" />
        <span className="absolute w-6 h-[2px] bg-white -rotate-45 transition-transform group-hover:-rotate-90" />
      </button>

      <div
        ref={overlayRef}
        className="fixed inset-0 z-50 bg-transparent pointer-events-auto perspective-1000 overflow-y-auto md:overflow-hidden opacity-0 invisible"
        style={{ perspective: "1200px" }}
      >
        <div className="absolute inset-0 pointer-events-none overflow-hidden flex items-center justify-center">
          {[
            "rgba(129,140,248,0.25)", // Indigo-400
            "rgba(192,132,252,0.25)", // Purple-400
            "rgba(244,114,182,0.25)"  // Pink-400
          ].map((color, i) => (
            <div
              key={`light-${i}`}
              ref={(el) => addLightToRefs(el, i)}
              className="absolute w-[40vw] h-[40vw] rounded-full"
              style={{
                background: `radial-gradient(circle, ${color} 0%, transparent 60%)`,
                mixBlendMode: "screen",
                filter: "blur(40px)",
              }}
            />
          ))}
        </div>

        <div className="relative w-full min-h-full flex flex-col items-start justify-center md:block px-8 py-24 md:p-0">
          {PROJECTS.map((project, index) => (
            <GlitchItem key={index} project={project} index={index} addToRefs={addToRefs} />
          ))}
        </div>
      </div>
    </main>
  );
}
