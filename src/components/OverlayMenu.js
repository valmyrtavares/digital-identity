"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { useMenu } from "@/context/MenuContext";

// Textos em duas linhas (Abstrato) e Texto Business (Real)
const PROJECTS = [
  { line1: "I. Genesis", line2: "Quântico", business: "Websites", top: "15%", left: "10%", size: "text-2xl md:text-3xl", depth: 0.8, slug: "genesis" },
  { line1: "II. Ressonância", line2: "do Vazio", business: "Landing Pages", top: "35%", right: "15%", size: "text-3xl md:text-4xl", depth: 1.2, slug: "ressonancia" },
  { line1: "III. Horizontes", line2: "de Neon", business: "Soluções Customizadas", top: "55%", left: "20%", size: "text-4xl md:text-5xl", depth: 1.5, slug: "horizontes" },
  { line1: "IV. Ecos", line2: "do Silêncio", business: "Edição de Vídeo", top: "10%", right: "25%", size: "text-xl md:text-2xl", depth: 0.5, slug: "ecos" },
  { line1: "V. Ondas", line2: "Cromáticas", business: "Meus Produtos", top: "70%", right: "30%", size: "text-2xl md:text-4xl", depth: 1.1, slug: "ondas" },
  { line1: "VI. Desvio", line2: "Temporal", business: "ERP Gastronômico", top: "25%", left: "35%", size: "text-4xl md:text-6xl", depth: 2.0, slug: "desvio" },
  { line1: "VII. Matéria", line2: "Escura", business: "Desenvolvedor Full Stack", top: "80%", left: "15%", size: "text-xl md:text-3xl", depth: 0.6, slug: "materia" },
  { line1: "VIII. Fluxo", line2: "de Pragma", business: "Consultoria Tech", top: "85%", right: "15%", size: "text-2xl md:text-3xl", depth: 0.9, slug: "fluxo" },
];

const GLITCH_CHARS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()_+-=[]{}|;':,./<>?";

const GlitchItem = ({ project, index, addToRefs, isMenuOpen }) => {
  const [displayText, setDisplayText] = useState(`${project.line1} ${project.line2}`);
  const [isHovered, setIsHovered] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const intervalRef = useRef(null);
  const hoverStateRef = useRef(false);
  const { openBusinessPopup, toggleMenu } = useMenu();

  // Mobile detection
  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
      if (mobile) {
        setIsHovered(true);
        setDisplayText(project.business.toUpperCase());
      } else if (!isHovered && !hoverStateRef.current) {
        setIsHovered(false);
        setDisplayText(`${project.line1} ${project.line2}`);
      }
    };
    
    handleResize(); // Initial check
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [project]);

  // Animation on menu open (for desktop)
  useEffect(() => {
    if (!isMenuOpen || isMobile) return;
    
    let isCancelled = false;
    let cycleTimeout;
    let revertTimeout;
    
    const runCycle = () => {
      if (isCancelled) return;
      
      if (!hoverStateRef.current) {
        setIsHovered(true);
        doGlitch(project.business.toUpperCase());
      }
      
      revertTimeout = setTimeout(() => {
        if (isCancelled) return;
        if (!hoverStateRef.current) {
          setIsHovered(false);
          doGlitch(`${project.line1} ${project.line2}`);
        }
      }, 2500); // Fica 2.5s como real
      
      cycleTimeout = setTimeout(runCycle, 6000); // Reinicia o ciclo a cada 6 segundos
    };

    // Initial staggered delay
    const initialDelay = 800 + index * 300;
    cycleTimeout = setTimeout(runCycle, initialDelay);

    return () => {
      isCancelled = true;
      clearTimeout(cycleTimeout);
      clearTimeout(revertTimeout);
    };
  }, [isMenuOpen, isMobile, project, index]);

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
      iteration += 1 / 3; // Velocidade do glitch
    }, 30);
  };

  const handleMouseEnter = () => {
    if (isMobile) return;
    hoverStateRef.current = true;
    setIsHovered(true);
    doGlitch(project.business.toUpperCase());
  };

  const handleMouseLeave = () => {
    if (isMobile) return;
    hoverStateRef.current = false;
    setIsHovered(false);
    doGlitch(`${project.line1} ${project.line2}`);
  };

  const handleClick = () => {
    toggleMenu();
    window.location.href = `/produtos/${project.slug}`;
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
        {isHovered ? displayText : project.line1}
      </span>
      {!isHovered && (
        <span className="font-bold tracking-tighter text-transparent bg-clip-text bg-gradient-to-br from-pink-300 to-purple-500 transition-all duration-500 ml-8 md:ml-12 text-[0.7em]">
          {project.line2}
        </span>
      )}
    </div>
  );
};

export default function OverlayMenu() {
  const { isMenuOpen, toggleMenu, isBusinessPopupOpen } = useMenu();
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
      
    } else {
      menuItemsRef.current.forEach((el) => { if(el) gsap.killTweensOf(el) });
      lightsRef.current.forEach((light) => { if(light) gsap.killTweensOf(light) });
      
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
      {/* Hide hamburger if business popup is open (cleaner UI) */}
      <button
        onClick={toggleMenu}
        className={`fixed top-8 right-8 z-[60] w-14 h-14 rounded-full border border-white/5 bg-white/5 backdrop-blur-md flex flex-col items-center justify-center gap-1.5 transition-all duration-500 hover:bg-white/10 hover:border-white/20 group mix-blend-difference ${isBusinessPopupOpen ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}
      >
        <span className={`w-6 h-[1px] bg-white transition-all duration-300 ${isMenuOpen ? "rotate-45 translate-y-[7px]" : ""}`} />
        <span className={`w-6 h-[1px] bg-white transition-all duration-300 ${isMenuOpen ? "opacity-0" : "opacity-100"}`} />
        <span className={`w-6 h-[1px] bg-white transition-all duration-300 ${isMenuOpen ? "-rotate-45 -translate-y-[7px]" : ""}`} />
      </button>

      <div
        ref={overlayRef}
        className="fixed inset-0 z-50 bg-transparent pointer-events-auto perspective-1000 overflow-y-auto md:overflow-hidden"
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
            <GlitchItem key={index} project={project} index={index} addToRefs={addToRefs} isMenuOpen={isMenuOpen} />
          ))}
        </div>
      </div>
    </>
  );
}
