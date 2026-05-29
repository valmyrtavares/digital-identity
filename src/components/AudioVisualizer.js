"use client";

import { useEffect, useRef, useState } from "react";

export default function AudioVisualizer() {
  const [isAudioEnabled, setIsAudioEnabled] = useState(false);
  const audioCtxRef = useRef(null);
  
  // Drone refs (Grave central)
  const osc1Ref = useRef(null);
  const osc2Ref = useRef(null);
  const droneFilterRef = useRef(null);
  const droneGainRef = useRef(null);

  // Glass/Shatter refs (Cacos de vidro agudos)
  const glassOscRef = useRef(null);
  const glassFilterRef = useRef(null);
  const glassGainRef = useRef(null);

  // Interaction refs
  const isDraggingRef = useRef(false);
  const lastMousePosRef = useRef({ x: 0, y: 0, time: 0 });

  // Initialize Audio Context when enabled
  useEffect(() => {
    if (!isAudioEnabled) {
      if (audioCtxRef.current) {
        audioCtxRef.current.suspend();
      }
      return;
    }

    if (!audioCtxRef.current) {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      const ctx = new AudioContext();
      audioCtxRef.current = ctx;

      // ============================================
      // 1. DRONE SYNTH (Sintetizador Grave/Central)
      // ============================================
      const droneGain = ctx.createGain();
      droneGain.gain.value = 0; 
      droneGain.connect(ctx.destination);
      droneGainRef.current = droneGain;

      const droneFilter = ctx.createBiquadFilter();
      droneFilter.type = "lowpass";
      droneFilter.frequency.value = 400; 
      droneFilter.connect(droneGain);
      droneFilterRef.current = droneFilter;

      const osc1 = ctx.createOscillator();
      osc1.type = "sine";
      osc1.frequency.value = 65; // ~C2
      osc1.connect(droneFilter);
      osc1.start();
      osc1Ref.current = osc1;

      const osc2 = ctx.createOscillator();
      osc2.type = "triangle";
      osc2.frequency.value = 65.5; // Detuned
      osc2.connect(droneFilter);
      osc2.start();
      osc2Ref.current = osc2;

      // ============================================
      // 2. GLASS SYNTH (Agudos de Poeira/Cacos)
      // ============================================
      const glassGain = ctx.createGain();
      glassGain.gain.value = 0; // Starts muted
      glassGain.connect(ctx.destination);
      glassGainRef.current = glassGain;

      const glassFilter = ctx.createBiquadFilter();
      glassFilter.type = "highpass"; // Only lets high frequencies through
      glassFilter.frequency.value = 2000;
      glassFilter.connect(glassGain);
      glassFilterRef.current = glassFilter;

      const glassOsc = ctx.createOscillator();
      glassOsc.type = "square"; // Harsher, crystal-like texture
      glassOsc.frequency.value = 1200; 
      glassOsc.connect(glassFilter);
      glassOsc.start();
      glassOscRef.current = glassOsc;
    }

    if (audioCtxRef.current.state === "suspended") {
      audioCtxRef.current.resume();
    }

    // Fade in drone smoothly
    droneGainRef.current.gain.setTargetAtTime(0.3, audioCtxRef.current.currentTime, 0.1);

  }, [isAudioEnabled]);

  // Handle Global Interactions (Click & Drag)
  useEffect(() => {
    const handleMouseDown = () => {
      isDraggingRef.current = true;
      
      // Quando clica, o drone sobe uma oitava para criar tensão
      // e o som de "vidro" acorda (ganha volume base)
      if (isAudioEnabled && audioCtxRef.current && osc1Ref.current) {
        const time = audioCtxRef.current.currentTime;
        osc1Ref.current.frequency.setTargetAtTime(130, time, 0.1); 
        osc2Ref.current.frequency.setTargetAtTime(131, time, 0.1);
        glassGainRef.current.gain.setTargetAtTime(0.05, time, 0.1);
      }
    };

    const handleMouseUp = () => {
      isDraggingRef.current = false;
      
      // Quando solta, volta ao grave relaxante e silencia o vidro
      if (isAudioEnabled && audioCtxRef.current && osc1Ref.current) {
        const time = audioCtxRef.current.currentTime;
        osc1Ref.current.frequency.setTargetAtTime(65, time, 0.3);
        osc2Ref.current.frequency.setTargetAtTime(65.5, time, 0.3);
        glassGainRef.current.gain.setTargetAtTime(0, time, 0.8); // Fade out mais longo
      }
    };

    const handleMouseMove = (e) => {
      const x = e.clientX / window.innerWidth;
      const y = e.clientY / window.innerHeight;
      const now = performance.now();
      
      // Calcular a velocidade do mouse (pixels por milissegundo)
      const dx = e.clientX - lastMousePosRef.current.x;
      const dy = e.clientY - lastMousePosRef.current.y;
      const dt = now - lastMousePosRef.current.time || 1;
      const velocity = Math.sqrt(dx * dx + dy * dy) / dt;
      
      lastMousePosRef.current = { x: e.clientX, y: e.clientY, time: now };

      if (isAudioEnabled && audioCtxRef.current && droneFilterRef.current) {
        const time = audioCtxRef.current.currentTime;
        
        // 1. Modulação do Drone Grave (Sempre ocorre com o mouse)
        // Eixo X controla o brilho (Filtro passa-baixa)
        const droneTargetFreq = 200 + x * 1800;
        droneFilterRef.current.frequency.setTargetAtTime(droneTargetFreq, time, 0.1);
        
        // Eixo Y controla o volume
        const droneTargetGain = 0.05 + y * 0.35;
        droneGainRef.current.gain.setTargetAtTime(droneTargetGain, time, 0.1);

        // 2. Modulação do Som Agudo/Cristal (Baseado no arraste e velocidade)
        if (isDraggingRef.current && glassOscRef.current) {
          // O pitch fica mais estridente conforme a velocidade e posição X
          const glassPitch = 1000 + (velocity * 800) + (x * 1500); 
          glassOscRef.current.frequency.setTargetAtTime(glassPitch, time, 0.05);
          
          // O volume dá "picos" quando movemos o mouse mais rápido, parecendo atrito/quebra
          const glassVolume = Math.min(0.05 + velocity * 0.15, 0.25); // cap de volume em 0.25
          glassGainRef.current.gain.setTargetAtTime(glassVolume, time, 0.05);
        }
      }
    };

    window.addEventListener("mousedown", handleMouseDown);
    window.addEventListener("mouseup", handleMouseUp);
    window.addEventListener("mousemove", handleMouseMove);
    
    return () => {
      window.removeEventListener("mousedown", handleMouseDown);
      window.removeEventListener("mouseup", handleMouseUp);
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, [isAudioEnabled]);

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <button
        onClick={() => setIsAudioEnabled(!isAudioEnabled)}
        className={`flex items-center justify-center gap-2 px-4 py-2 rounded-full border backdrop-blur-md transition-all duration-300 ${
          isAudioEnabled 
            ? "border-pink-500/50 bg-pink-500/20 text-pink-300 shadow-[0_0_15px_rgba(236,72,153,0.3)]" 
            : "border-white/10 bg-black/50 text-gray-400 hover:bg-white/10"
        }`}
      >
        {isAudioEnabled ? (
          <>
            <div className="w-2 h-2 rounded-full bg-pink-400 animate-pulse"></div>
            Som Ativo
          </>
        ) : (
          <>
            <div className="w-2 h-2 rounded-full bg-gray-500"></div>
            Som Mutado
          </>
        )}
      </button>
    </div>
  );
}
