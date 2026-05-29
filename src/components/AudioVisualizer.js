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

  // Cathedral Xylophone refs (Menu aberto)
  const xyloInputRef = useRef(null); // Nó de entrada para a catedral
  const cathedralMasterGainRef = useRef(null);
  const feedbackGainRef = useRef(null);
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
      // 2. CATHEDRAL REVERB NETWORK (Reverb Matemático)
      // ============================================
      const cathedralMasterGain = ctx.createGain();
      cathedralMasterGain.gain.value = 0; // começa mutado
      cathedralMasterGain.connect(ctx.destination);
      cathedralMasterGainRef.current = cathedralMasterGain;

      const xyloInput = ctx.createGain();
      xyloInput.gain.value = 1.0; 
      xyloInputRef.current = xyloInput;

      // Delay gigante para simular o espaço da catedral
      const delayNode = ctx.createDelay(5.0); 
      delayNode.delayTime.value = 1.5; // 1.5s delay
      
      const feedbackGain = ctx.createGain();
      feedbackGain.gain.value = 0.85; // Feedback gigantesco
      feedbackGainRef.current = feedbackGain;
      
      // Filtro Lowpass dentro do loop de feedback simula a perda de agudos na catedral
      const echoFilter = ctx.createBiquadFilter();
      echoFilter.type = "lowpass";
      echoFilter.frequency.value = 1200;
      
      // Conexões da rede de reverb
      xyloInput.connect(delayNode);
      delayNode.connect(echoFilter);
      echoFilter.connect(feedbackGain);
      feedbackGain.connect(delayNode);
      
      // O som limpo (dry) e o som reverberado (wet) vão para o master da catedral
      delayNode.connect(cathedralMasterGain);
      xyloInput.connect(cathedralMasterGain);

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

  // Handle Menu Open/Close Cathedral Xylophone Loop Logic
  useEffect(() => {
    if (!isAudioEnabled || !audioCtxRef.current || !xyloInputRef.current) return;
    const time = audioCtxRef.current.currentTime;
    let timeoutId;

    if (isMenuOpen) {
      // 1. O GRAVE ANCORA (Baixo Contínuo sustentando o acorde diminuto)
      osc1Ref.current.frequency.setTargetAtTime(65.41, time, 1.0); // Força C2
      osc2Ref.current.frequency.setTargetAtTime(65.41, time, 1.0); // Alinha os dois para focar
      droneFilterRef.current.frequency.setTargetAtTime(600, time, 1.5);
      
      // Desliga a respiração do LFO para o baixo ficar perpétuo e sólido
      lfoGainRef.current.gain.setTargetAtTime(0, time, 0.5);

      // Liga a Catedral
      cathedralMasterGainRef.current.gain.setTargetAtTime(1.0, time, 0.1);
      feedbackGainRef.current.gain.setTargetAtTime(0.85, time, 0.1);

      // 2. LOOP INFINITO DO XILOFONE
      const playRandomNote = () => {
        if (!isMenuOpen || !audioCtxRef.current) return; // Segurança

        const now = audioCtxRef.current.currentTime;
        // Acorde Diminuto 7 (C dim7): C4, Eb4, Gb4, A4
        const freqs = [261.63, 311.13, 369.99, 440.00];
        
        // Sorteia uma nota e uma oitava opcional para dar mais brilho
        const baseFreq = freqs[Math.floor(Math.random() * freqs.length)];
        const freq = Math.random() > 0.5 ? baseFreq : baseFreq * 2; // Pula uma oitava aleatoriamente
        
        // Cria um oscilador para essa nota específica
        const noteOsc = audioCtxRef.current.createOscillator();
        noteOsc.type = "sine";
        noteOsc.frequency.value = freq;
        
        // Cria o envelope de Xilofone (Ataque rápido, Decaimento lento)
        const noteGain = audioCtxRef.current.createGain();
        noteGain.gain.setValueAtTime(0, now);
        noteGain.gain.linearRampToValueAtTime(0.3, now + 0.05); // Attack da batida do bastão
        noteGain.gain.exponentialRampToValueAtTime(0.001, now + 3.0); // Decay lento
        
        // Conecta na Catedral (Reverb/Delay network)
        noteOsc.connect(noteGain);
        noteGain.connect(xyloInputRef.current);
        
        noteOsc.start(now);
        noteOsc.stop(now + 3.5); // Desliga da memória quando o som acaba
        
        // Agenda a próxima batida com tempo aleatório (imprevisível: entre 400ms e 1800ms)
        const nextDelay = 400 + Math.random() * 1400;
        timeoutId = setTimeout(playRandomNote, nextDelay);
      };

      // Começa o loop assim que o menu abre
      playRandomNote();

    } else {
      // MENU FECHOU
      // Pára o loop recursivo imediatamente
      clearTimeout(timeoutId);
      
      // Desliga a Catedral imediatamente (fade out rápido e mata o buffer de eco)
      cathedralMasterGainRef.current.gain.setTargetAtTime(0, time, 0.1);
      feedbackGainRef.current.gain.setTargetAtTime(0, time, 0.1);
      
      // Volta o grave ao estado caótico (LFO)
      lfoGainRef.current.gain.setTargetAtTime(3, time, 1); 
    }

    // Cleanup caso o componente desmonte ou isMenuOpen mude
    return () => clearTimeout(timeoutId);
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
      if (isMenuOpen) return; // Menu aberto ignora modulação pelo mouse

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
