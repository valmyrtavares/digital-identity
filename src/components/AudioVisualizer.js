"use client";

import { useEffect, useRef, useState } from "react";
import { useMenu } from "@/context/MenuContext";

export default function AudioVisualizer() {
  const [isAudioEnabled, setIsAudioEnabled] = useState(false);
  const audioCtxRef = useRef(null);
  const { isMenuOpen } = useMenu();
  
  // Drone refs (Grave central)
  const osc1Ref = useRef(null);
  const osc2Ref = useRef(null);
  const droneFilterRef = useRef(null);
  const droneGainRef = useRef(null);

  // Glass/Shatter refs (Cacos de vidro agudos)
  const glassOscRef = useRef(null);
  const glassFilterRef = useRef(null);
  const glassGainRef = useRef(null);

  // Chord refs (Menu aberto)
  const chordGainRef = useRef(null);
  const lfoGainRef = useRef(null);

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
      osc1.frequency.value = 65.41; // C2 (Root)
      osc1.connect(droneFilter);
      osc1.start();
      osc1Ref.current = osc1;

      const osc2 = ctx.createOscillator();
      osc2.type = "triangle";
      osc2.frequency.value = 65.8; // Detuned
      osc2.connect(droneFilter);
      osc2.start();
      osc2Ref.current = osc2;

      // LFO para Oscilação "Respirando"
      const lfoOsc = ctx.createOscillator();
      lfoOsc.type = "sine";
      lfoOsc.frequency.value = 0.3; 
      
      const lfoGain = ctx.createGain();
      lfoGain.gain.value = 3; 
      lfoGainRef.current = lfoGain;
      
      lfoOsc.connect(lfoGain);
      lfoGain.connect(osc1.frequency);
      lfoGain.connect(osc2.frequency);
      lfoOsc.start();

      // ============================================
      // 2. CHORD SYNTH (Dó Maior com 9ª Voicing Espaçado)
      // ============================================
      const chordGain = ctx.createGain();
      chordGain.gain.value = 0; // mutado por padrão
      chordGainRef.current = chordGain;

      // Delay/Echo Effect para suavizar os osciladores puros
      const delayNode = ctx.createDelay();
      delayNode.delayTime.value = 0.4; // 400ms delay
      const feedbackGain = ctx.createGain();
      feedbackGain.gain.value = 0.3; // 30% feedback
      
      // Rotas do delay
      chordGain.connect(delayNode);
      delayNode.connect(feedbackGain);
      feedbackGain.connect(delayNode);
      delayNode.connect(ctx.destination);
      chordGain.connect(ctx.destination); // Som direto + delay

      // Root já está no Drone (C2). 
      // Voicing do CM9 nas oitavas 3 e 4 para evitar embolamento: E3, G3, B3, D4
      
      // Major 3rd (E3)
      const oscM3 = ctx.createOscillator(); oscM3.type = "sine"; oscM3.frequency.value = 164.81;
      oscM3.connect(chordGain); oscM3.start();
      
      // Perfect 5th (G3)
      const oscP5 = ctx.createOscillator(); oscP5.type = "triangle"; oscP5.frequency.value = 196.00;
      oscP5.connect(chordGain); oscP5.start();
      
      // Major 7th (B3)
      const oscMaj7 = ctx.createOscillator(); oscMaj7.type = "sine"; oscMaj7.frequency.value = 246.94;
      oscMaj7.connect(chordGain); oscMaj7.start();
      
      // Major 9th (D4)
      const oscM9 = ctx.createOscillator(); oscM9.type = "sine"; oscM9.frequency.value = 293.66;
      oscM9.connect(chordGain); oscM9.start();

      // ============================================
      // 3. GLASS SYNTH (Agudos de Poeira/Cacos)
      // ============================================
      const glassGain = ctx.createGain();
      glassGain.gain.value = 0; 
      glassGain.connect(ctx.destination);
      glassGainRef.current = glassGain;

      const glassFilter = ctx.createBiquadFilter();
      glassFilter.type = "highpass"; 
      glassFilter.frequency.value = 2000;
      glassFilter.connect(glassGain);
      glassFilterRef.current = glassFilter;

      const glassOsc = ctx.createOscillator();
      glassOsc.type = "square"; 
      glassOsc.frequency.value = 1200; 
      glassOsc.connect(glassFilter);
      glassOsc.start();
      glassOscRef.current = glassOsc;
    }

    if (audioCtxRef.current.state === "suspended") {
      audioCtxRef.current.resume();
    }

    droneGainRef.current.gain.setTargetAtTime(0.3, audioCtxRef.current.currentTime, 0.1);

  }, [isAudioEnabled]);

  // Handle Menu Open/Close Chord Logic
  useEffect(() => {
    if (!isAudioEnabled || !audioCtxRef.current || !chordGainRef.current) return;
    const time = audioCtxRef.current.currentTime;

    if (isMenuOpen) {
      // Menu Aberto: Congela modulação caótica e impõe o Acorde CM9
      osc1Ref.current.frequency.setTargetAtTime(65.41, time, 1.5); // Força C2
      osc2Ref.current.frequency.setTargetAtTime(65.8, time, 1.5);
      droneFilterRef.current.frequency.setTargetAtTime(1000, time, 1.5); // Abre o filtro
      
      // Traz as extensões espalhadas (E3, G3, B3, D4) de forma suave
      chordGainRef.current.gain.setTargetAtTime(0.08, time, 2.0); // Volume baixo para não estourar
      
      // Desliga o LFO do grave para estabilidade
      lfoGainRef.current.gain.setTargetAtTime(0, time, 0.5);
    } else {
      // Menu Fechado: Volta ao caos e apaga o acorde
      chordGainRef.current.gain.setTargetAtTime(0, time, 0.8);
      lfoGainRef.current.gain.setTargetAtTime(3, time, 1); // Volta o "respirar"
    }
  }, [isMenuOpen, isAudioEnabled]);

  // Handle Global Interactions (Click & Drag)
  useEffect(() => {
    const handleMouseDown = () => {
      isDraggingRef.current = true;
      if (isAudioEnabled && audioCtxRef.current && osc1Ref.current && !isMenuOpen) {
        const time = audioCtxRef.current.currentTime;
        glassGainRef.current.gain.setTargetAtTime(0.05, time, 0.1);
      }
    };

    const handleMouseUp = () => {
      isDraggingRef.current = false;
      if (isAudioEnabled && audioCtxRef.current && osc1Ref.current && !isMenuOpen) {
        const time = audioCtxRef.current.currentTime;
        glassGainRef.current.gain.setTargetAtTime(0, time, 0.8);
      }
    };

    const handleMouseMove = (e) => {
      if (isMenuOpen) return; // Menu aberto ignora modulação

      const x = e.clientX / window.innerWidth;
      const y = e.clientY / window.innerHeight;
      const now = performance.now();
      
      const dx = e.clientX - lastMousePosRef.current.x;
      const dy = e.clientY - lastMousePosRef.current.y;
      const dt = now - lastMousePosRef.current.time || 1;
      const velocity = Math.sqrt(dx * dx + dy * dy) / dt;
      
      lastMousePosRef.current = { x: e.clientX, y: e.clientY, time: now };

      if (isAudioEnabled && audioCtxRef.current && droneFilterRef.current) {
        const time = audioCtxRef.current.currentTime;
        
        if (!isDraggingRef.current) {
          const idleFreq = 40 + x * 50;
          osc1Ref.current.frequency.setTargetAtTime(idleFreq, time, 0.1);
          osc2Ref.current.frequency.setTargetAtTime(idleFreq + 0.5, time, 0.1);
        } else {
          const tensionFreq = 100 + x * 80 + velocity * 10;
          osc1Ref.current.frequency.setTargetAtTime(tensionFreq, time, 0.1);
          osc2Ref.current.frequency.setTargetAtTime(tensionFreq + 1, time, 0.1);
        }

        const droneTargetFreq = 200 + x * 1800;
        droneFilterRef.current.frequency.setTargetAtTime(droneTargetFreq, time, 0.1);
        
        const droneTargetGain = 0.05 + y * 0.35;
        droneGainRef.current.gain.setTargetAtTime(droneTargetGain, time, 0.1);

        if (isDraggingRef.current && glassOscRef.current) {
          const glassPitch = 1000 + (velocity * 800) + (x * 1500); 
          glassOscRef.current.frequency.setTargetAtTime(glassPitch, time, 0.05);
          const glassVolume = Math.min(0.05 + velocity * 0.15, 0.25);
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
  }, [isAudioEnabled, isMenuOpen]);

  return (
    <div className="fixed bottom-6 right-6 z-[70]">
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
