"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { useMenu } from "@/context/MenuContext";
import Link from "next/link";

export default function BusinessPopup() {
  const { isBusinessPopupOpen, closeBusinessPopup, selectedBusiness } = useMenu();
  const containerRef = useRef(null);
  const contentRef = useRef(null);

  useEffect(() => {
    gsap.set(containerRef.current, { autoAlpha: 0 });
    gsap.set(contentRef.current, { y: 50, autoAlpha: 0 });
  }, []);

  useEffect(() => {
    const tl = gsap.timeline();

    if (isBusinessPopupOpen) {
      tl.to(containerRef.current, {
        duration: 0.6,
        autoAlpha: 1,
        ease: "power3.inOut"
      })
      .to(contentRef.current, {
        duration: 0.6,
        y: 0,
        autoAlpha: 1,
        ease: "power2.out"
      }, "-=0.2");
    } else {
      tl.to(contentRef.current, {
        duration: 0.3,
        y: -30,
        autoAlpha: 0,
        ease: "power2.in"
      })
      .to(containerRef.current, {
        duration: 0.4,
        autoAlpha: 0,
        ease: "power2.inOut"
      }, "-=0.2");
    }
  }, [isBusinessPopupOpen]);

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 z-[100] bg-black pointer-events-auto flex items-center justify-center font-sans"
    >
      {/* Botão de Fechar / Voltar ao Vácuo */}
      <button
        onClick={closeBusinessPopup}
        className="absolute top-8 right-8 z-[110] text-gray-400 hover:text-white transition-colors duration-300 text-sm tracking-widest uppercase flex items-center gap-2"
      >
        <span className="w-8 h-[1px] bg-current inline-block" />
        Voltar
      </button>

      {/* Conteúdo Sólido e Objetivo (Business) */}
      <div 
        ref={contentRef}
        className="w-full max-w-4xl p-8 md:p-12 border border-white/10 bg-[#050505] shadow-2xl relative"
      >
        {/* Decoração minimalista corporativa */}
        <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500" />
        
        <div className="flex flex-col gap-6">
          <Link 
            href="/produtos"
            onClick={closeBusinessPopup}
            className="text-pink-500 font-mono text-sm tracking-widest uppercase cursor-pointer hover:underline inline-block w-fit"
          >
            {selectedBusiness?.line1} {selectedBusiness?.line2}
          </Link>
          <h2 className="text-4xl md:text-6xl font-bold tracking-tight text-white">
            {selectedBusiness?.business || "Solução Enterprise"}
          </h2>
          <p className="text-gray-400 text-lg md:text-xl font-light leading-relaxed max-w-2xl mt-4">
            Aqui sentamos na mesa. Sem abstrações, apenas resultados. Esta interface modular está pronta para receber as especificações de negócio, links de checkout ou portfólio prático.
          </p>

          <div className="mt-12 flex items-center gap-6">
            <button className="px-8 py-4 bg-white text-black font-semibold hover:bg-gray-200 transition-colors">
              Iniciar Projeto
            </button>
            <button className="px-8 py-4 border border-white/20 text-white hover:bg-white/5 transition-colors">
              Ver Detalhes
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
