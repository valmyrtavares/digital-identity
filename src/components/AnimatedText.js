"use client";

import { useRef, useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

// Registrar o plugin ScrollTrigger
if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

export default function AnimatedText({ children, className = "", direction = "up" }) {
  const textRef = useRef(null);

  useEffect(() => {
    const el = textRef.current;
    
    let fromState, toState;

    if (direction === "up") {
      fromState = { y: 100, opacity: 0, rotationX: -45 };
      toState = { y: 0, opacity: 1, rotationX: 0, duration: 1.5, ease: "power3.out" };
    } else if (direction === "left") {
      // Texto na esquerda, vem da esquerda (curta distância)
      fromState = { x: -150, opacity: 0, filter: "blur(15px)" };
      toState = { x: 0, opacity: 1, filter: "blur(0px)", duration: 1.5, ease: "power3.out" };
    } else if (direction === "right") {
      // Texto na direita, vem da direita (curta distância)
      fromState = { x: 150, opacity: 0, filter: "blur(15px)" };
      toState = { x: 0, opacity: 1, filter: "blur(0px)", duration: 1.5, ease: "power3.out" };
    }

    const anim = gsap.fromTo(
      el,
      fromState,
      {
        ...toState,
        scrollTrigger: {
          trigger: el,
          start: "top 85%",
          toggleActions: "play none none reverse"
        }
      }
    );

    return () => {
      if (anim.scrollTrigger) anim.scrollTrigger.kill();
      anim.kill();
    };
  }, [direction]);

  return (
    <div ref={textRef} className={`will-change-transform ${className}`} style={{ perspective: '1000px' }}>
      {children}
    </div>
  );
}
