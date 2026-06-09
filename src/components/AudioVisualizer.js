"use client";

import { useEffect, useRef, useState } from "react";
import { useMenu } from "@/context/MenuContext";

export default function AudioVisualizer() {
  const [isAudioEnabled, setIsAudioEnabled] = useState(false);
  const [hasInteracted, setHasInteracted] = useState(false);
  const [isLoadingAudio, setIsLoadingAudio] = useState(false);
  const audioCtxRef = useRef(null);
  const masterGainRef = useRef(null);
  const { isMenuOpen, isBusinessPopupOpen } = useMenu();
  
  // Real Drum Loop refs
  const drumMasterGainRef = useRef(null);
  const drumFilterRef = useRef(null);
  const drumBufferRef = useRef(null);
  const drumSourceRef = useRef(null);

  // Cathedral Xylophone refs (Menu aberto)
  const xyloInputRef = useRef(null); 
  const cathedralMasterGainRef = useRef(null);
  const cathedralLfoGainRef = useRef(null); 
  const feedbackGainRef = useRef(null);

  // Interaction refs
  const isDraggingRef = useRef(false);
  const lastMousePosRef = useRef({ x: 0, y: 0, time: 0 });
  const cursorRef = useRef(null);

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

      // MASTER GAIN E COMPRESSOR (Evitar estouro de volume)
      const compressor = ctx.createDynamicsCompressor();
      compressor.threshold.value = -12;
      compressor.knee.value = 30;
      compressor.ratio.value = 12;
      compressor.attack.value = 0.05;
      compressor.release.value = 0.25;
      compressor.connect(ctx.destination);

      const masterGain = ctx.createGain();
      masterGain.gain.value = 1;
      masterGain.connect(compressor);
      masterGainRef.current = masterGain;

      // ============================================
      // 1. REAL DRUM LOOP (Áudio de verdade)
      // ============================================
      const drumMasterGain = ctx.createGain();
      drumMasterGain.gain.value = 0.8;
      drumMasterGain.connect(masterGain);
      drumMasterGainRef.current = drumMasterGain;

      const drumFilter = ctx.createBiquadFilter();
      drumFilter.type = 'lowpass';
      drumFilter.frequency.value = 5000;
      drumFilter.connect(drumMasterGain);
      drumFilterRef.current = drumFilter;

      // ============================================
      // 2. CATHEDRAL REVERB NETWORK (Reverb Matemático)
      // ============================================
      const cathedralMasterGain = ctx.createGain();
      cathedralMasterGain.gain.value = 0; // começa mutado
      cathedralMasterGain.connect(masterGain);
      cathedralMasterGainRef.current = cathedralMasterGain;

      const xyloInput = ctx.createGain();
      xyloInput.gain.value = 1.0; 
      xyloInputRef.current = xyloInput;

      // Delay gigante para simular o espaço da catedral
      const delayNode = ctx.createDelay(5.0); 
      delayNode.delayTime.value = 1.5; // 1.5s delay
      
      const feedbackGain = ctx.createGain();
      feedbackGain.gain.value = 0.65;
      feedbackGainRef.current = feedbackGain;
      
      const echoFilter = ctx.createBiquadFilter();
      echoFilter.type = "lowpass";
      echoFilter.frequency.value = 1000;
      
      xyloInput.connect(delayNode);
      delayNode.connect(echoFilter);
      echoFilter.connect(feedbackGain);
      feedbackGain.connect(delayNode);
      
      delayNode.connect(cathedralMasterGain);
      xyloInput.connect(cathedralMasterGain);

      // CATHEDRAL BREATHER (LFO volume oscilation)
      const catLfo = ctx.createOscillator();
      catLfo.type = "sine";
      catLfo.frequency.value = 0.05; 
      
      const catLfoGain = ctx.createGain();
      catLfoGain.gain.value = 0; 
      cathedralLfoGainRef.current = catLfoGain;
      
      catLfo.connect(catLfoGain);
      catLfoGain.connect(cathedralMasterGain.gain);
      catLfo.start();
    }

    if (audioCtxRef.current.state === "suspended") {
      audioCtxRef.current.resume();
    }

  }, [isAudioEnabled]);

  // Carregar e tocar o arquivo de áudio real
  useEffect(() => {
    if (!isAudioEnabled || !audioCtxRef.current || drumBufferRef.current) return;
    
    setIsLoadingAudio(true);
    // Tenta carregar o arquivo real da pasta public
    fetch('/drum-loop.mp3')
      .then(res => {
        if (!res.ok) throw new Error("Arquivo não encontrado.");
        return res.arrayBuffer();
      })
      .then(arrayBuffer => audioCtxRef.current.decodeAudioData(arrayBuffer))
      .then(decodedBuffer => {
        drumBufferRef.current = decodedBuffer;
        setIsLoadingAudio(false);
        
        // Inicia o loop de bateria
        if (drumSourceRef.current) {
          drumSourceRef.current.stop();
          drumSourceRef.current.disconnect();
        }
        
        const source = audioCtxRef.current.createBufferSource();
        source.buffer = decodedBuffer;
        source.loop = true;
        source.connect(drumFilterRef.current);
        source.start(0);
        drumSourceRef.current = source;
      })
      .catch(err => {
        console.error("Erro ao carregar o loop de bateria (adicione drum-loop.mp3 na pasta public):", err);
        setIsLoadingAudio(false);
      });
  }, [isAudioEnabled]);

  // Controle de volume do loop de bateria (fade out no menu)
  useEffect(() => {
    if (!isAudioEnabled || !audioCtxRef.current) return;
    const ctx = audioCtxRef.current;
    
    if (isMenuOpen) {
      if (drumMasterGainRef.current) {
         drumMasterGainRef.current.gain.setTargetAtTime(0, ctx.currentTime, 0.5);
      }
    } else {
      if (drumMasterGainRef.current) {
         drumMasterGainRef.current.gain.setTargetAtTime(0.8, ctx.currentTime, 0.5);
      }
    }
  }, [isAudioEnabled, isMenuOpen]);

  // Handle Business Popup Silence
  useEffect(() => {
    if (!isAudioEnabled || !audioCtxRef.current || !masterGainRef.current) return;
    const time = audioCtxRef.current.currentTime;
    
    if (isBusinessPopupOpen) {
      masterGainRef.current.gain.setTargetAtTime(0, time, 0.2);
    } else {
      masterGainRef.current.gain.setTargetAtTime(1, time, 0.2);
    }
  }, [isBusinessPopupOpen, isAudioEnabled]);

  // Handle Menu Open/Close Cathedral Xylophone
  useEffect(() => {
    if (!isAudioEnabled || !audioCtxRef.current || !xyloInputRef.current) return;
    const time = audioCtxRef.current.currentTime;
    let timeoutId;

    if (isMenuOpen) {
      cathedralMasterGainRef.current.gain.setTargetAtTime(0.5, time, 0.1);
      cathedralLfoGainRef.current.gain.setTargetAtTime(0.4, time, 0.1); 
      feedbackGainRef.current.gain.setTargetAtTime(0.65, time, 0.1);

      const playRandomNote = () => {
        if (!isMenuOpen || !audioCtxRef.current) return;

        const now = audioCtxRef.current.currentTime;
        const freqs = [261.63, 311.13, 369.99, 440.00];
        const baseFreq = freqs[Math.floor(Math.random() * freqs.length)];
        const freq = Math.random() > 0.5 ? baseFreq : baseFreq * 2; 
        
        const noteOsc = audioCtxRef.current.createOscillator();
        noteOsc.type = "sine";
        noteOsc.frequency.value = freq;
        
        const noteGain = audioCtxRef.current.createGain();
        noteGain.gain.setValueAtTime(0, now);
        noteGain.gain.linearRampToValueAtTime(0.2, now + 0.05); 
        noteGain.gain.exponentialRampToValueAtTime(0.001, now + 3.0); 
        
        noteOsc.connect(noteGain);
        noteGain.connect(xyloInputRef.current);
        
        noteOsc.start(now);
        noteOsc.stop(now + 3.5); 
        
        const nextDelay = 400 + Math.random() * 1400;
        timeoutId = setTimeout(playRandomNote, nextDelay);
      };

      playRandomNote();
    } else {
      clearTimeout(timeoutId);
      cathedralMasterGainRef.current.gain.setTargetAtTime(0, time, 0.1);
      cathedralLfoGainRef.current.gain.setTargetAtTime(0, time, 0.1);
      feedbackGainRef.current.gain.setTargetAtTime(0, time, 0.1);
    }

    return () => clearTimeout(timeoutId);
  }, [isMenuOpen, isAudioEnabled]);

  // Handle Global Interactions and Mouse Follower
  useEffect(() => {
    const handleGlobalClick = (e) => {
      if (e.target.closest('#audio-toggle-btn')) return;
      if (!isAudioEnabled && !hasInteracted) {
        setIsAudioEnabled(true);
        setHasInteracted(true);
      } else if (isAudioEnabled && drumBufferRef.current && audioCtxRef.current) {
        // Reinicia o áudio ao clicar novamente na tela
        if (drumSourceRef.current) {
          try {
            drumSourceRef.current.stop();
          } catch (e) {
            // Ignora erro se já estiver parado
          }
          drumSourceRef.current.disconnect();
        }
        
        const source = audioCtxRef.current.createBufferSource();
        source.buffer = drumBufferRef.current;
        source.loop = true;
        source.connect(drumFilterRef.current);
        source.start(0);
        drumSourceRef.current = source;
      }
    };
    
    window.addEventListener('click', handleGlobalClick);
    return () => window.removeEventListener('click', handleGlobalClick);
  }, [isAudioEnabled, hasInteracted]);

  useEffect(() => {
    const handleMouseMove = (e) => {
      if (cursorRef.current && !isAudioEnabled && !hasInteracted) {
        cursorRef.current.style.transform = `translate3d(${e.clientX}px, ${e.clientY}px, 0)`;
      }

      if (isMenuOpen) return;

      const x = e.clientX / window.innerWidth;
      const y = e.clientY / window.innerHeight;
      const now = performance.now();
      
      const dx = e.clientX - lastMousePosRef.current.x;
      const dy = e.clientY - lastMousePosRef.current.y;
      const dt = now - lastMousePosRef.current.time || 1;
      const velocity = Math.sqrt(dx * dx + dy * dy) / dt;
      
      lastMousePosRef.current = { x: e.clientX, y: e.clientY, time: now };

      if (isAudioEnabled && audioCtxRef.current && drumFilterRef.current) {
        const time = audioCtxRef.current.currentTime;
        const targetFreq = 500 + x * 5000 + velocity * 1000;
        drumFilterRef.current.frequency.setTargetAtTime(targetFreq, time, 0.1);
      }
    };

    const handleMouseDown = () => {
      isDraggingRef.current = true;
      if (isAudioEnabled && audioCtxRef.current && drumFilterRef.current && !isMenuOpen) {
         drumFilterRef.current.Q.setTargetAtTime(5, audioCtxRef.current.currentTime, 0.1);
      }
    };

    const handleMouseUp = () => {
      isDraggingRef.current = false;
      if (isAudioEnabled && audioCtxRef.current && drumFilterRef.current && !isMenuOpen) {
         drumFilterRef.current.Q.setTargetAtTime(1, audioCtxRef.current.currentTime, 0.1);
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
  }, [isAudioEnabled, isMenuOpen, hasInteracted]);

  return (
    <>
      {!isAudioEnabled && !hasInteracted && (
        <div 
          ref={cursorRef}
          className="fixed top-0 left-0 pointer-events-none z-[100] flex items-center justify-center -translate-x-1/2 -translate-y-1/2 transition-opacity duration-300"
          style={{ willChange: 'transform' }}
        >
          <div className="bg-black/60 backdrop-blur-md border border-white/20 text-white px-4 py-2 rounded-full text-sm font-light tracking-wide shadow-2xl flex items-center gap-2">
             <div className="w-2 h-2 rounded-full bg-indigo-400 animate-pulse"></div>
             Click to enable sound
          </div>
        </div>
      )}

      <div className="fixed bottom-6 right-6 z-[70]">
        <button
          id="audio-toggle-btn"
          onClick={() => {
            setIsAudioEnabled(!isAudioEnabled);
            setHasInteracted(true);
          }}
          className={`flex items-center justify-center gap-2 px-4 py-2 rounded-full border backdrop-blur-md transition-all duration-300 ${
            isAudioEnabled 
              ? "border-pink-500/50 bg-pink-500/20 text-pink-300 shadow-[0_0_15px_rgba(236,72,153,0.3)]" 
              : "border-white/10 bg-black/50 text-gray-400 hover:bg-white/10"
          }`}
        >
          {isLoadingAudio ? (
            <>
              <div className="w-4 h-4 rounded-full border-2 border-pink-400 border-t-transparent animate-spin"></div>
              Carregando...
            </>
          ) : isAudioEnabled ? (
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
    </>
  );
}
