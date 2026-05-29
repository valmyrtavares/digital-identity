"use client";

import { useRef, useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

// Registrar o plugin ScrollTrigger
if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

export default function AnimatedText({ children, className = "" }) {
  const textRef = useRef(null);

  useEffect(() => {
    const el = textRef.current;

    gsap.fromTo(
      el,
      {
        y: 100,
        opacity: 0,
        rotationX: -45,
      },
      {
        y: 0,
        opacity: 1,
        rotationX: 0,
        duration: 1.5,
        ease: "power3.out",
        scrollTrigger: {
          trigger: el,
          start: "top 85%", // Inicia a animação quando o topo do elemento atinge 85% da tela
          toggleActions: "play none none reverse"
        }
      }
    );

    return () => {
      ScrollTrigger.getAll().forEach(t => t.kill());
    };
  }, []);

  return (
    <div ref={textRef} className={`will-change-transform ${className}`} style={{ perspective: '1000px' }}>
      {children}
    </div>
  );
}
