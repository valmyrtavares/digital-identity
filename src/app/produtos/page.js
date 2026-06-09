"use client";

import Link from 'next/link';
import { useState } from 'react';

// Frequências para as notas de um xilofone (Escala de Dó Maior)
const NOTES = [
  { note: 'C', freq: 261.63, color: 'bg-red-500 hover:bg-red-400 border-red-600 shadow-red-500/20' },
  { note: 'D', freq: 293.66, color: 'bg-orange-500 hover:bg-orange-400 border-orange-600 shadow-orange-500/20' },
  { note: 'E', freq: 329.63, color: 'bg-yellow-500 hover:bg-yellow-400 border-yellow-600 shadow-yellow-500/20' },
  { note: 'F', freq: 349.23, color: 'bg-green-500 hover:bg-green-400 border-green-600 shadow-green-500/20' },
  { note: 'G', freq: 392.00, color: 'bg-teal-500 hover:bg-teal-400 border-teal-600 shadow-teal-500/20' },
  { note: 'A', freq: 440.00, color: 'bg-blue-500 hover:bg-blue-400 border-blue-600 shadow-blue-500/20' },
  { note: 'B', freq: 493.88, color: 'bg-indigo-500 hover:bg-indigo-400 border-indigo-600 shadow-indigo-500/20' },
  { note: 'C2', freq: 523.25, color: 'bg-purple-500 hover:bg-purple-400 border-purple-600 shadow-purple-500/20' },
];

export default function ProdutosPrincipal() {
  const [activeKey, setActiveKey] = useState(null);

  const playNote = (freq, index) => {
    setActiveKey(index);
    setTimeout(() => setActiveKey(null), 200);

    const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    const oscillator = audioCtx.createOscillator();
    const gainNode = audioCtx.createGain();

    oscillator.type = 'sine'; // Som de sino suave
    oscillator.frequency.setValueAtTime(freq, audioCtx.currentTime);

    gainNode.gain.setValueAtTime(0, audioCtx.currentTime);
    gainNode.gain.linearRampToValueAtTime(0.8, audioCtx.currentTime + 0.02);
    gainNode.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 1.2);

    oscillator.connect(gainNode);
    gainNode.connect(audioCtx.destination);

    oscillator.start(audioCtx.currentTime);
    oscillator.stop(audioCtx.currentTime + 1.2);
  };

  return (
    <main className="min-h-screen bg-[#050505] text-white flex flex-col items-center justify-center p-6 md:p-12 font-sans relative overflow-hidden">
      {/* Background radial overlays para efeito neon premium */}
      <div className="absolute top-1/4 left-1/4 w-[40vw] h-[40vw] rounded-full bg-indigo-500/5 blur-[80px] pointer-events-none"></div>
      <div className="absolute bottom-1/4 right-1/4 w-[40vw] h-[40vw] rounded-full bg-purple-500/5 blur-[80px] pointer-events-none"></div>

      <div className="max-w-4xl w-full relative z-10">
        {/* Cabeçalho */}
        <div className="mb-16 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div>
            <h1 className="text-4xl md:text-5xl font-extralight tracking-widest uppercase mb-3 text-transparent bg-clip-text bg-gradient-to-r from-purple-300 via-indigo-300 to-cyan-300 drop-shadow-[0_0_15px_rgba(139,92,246,0.3)]">
              O Oráculo Sonoro
            </h1>
            <p className="text-gray-400 font-light tracking-wide">
              Experimente a harmonia geométrica direta, sem distrações 3D.
            </p>
          </div>
          <Link 
            href="/" 
            className="px-8 py-3 border border-white/10 rounded-full hover:bg-white/10 hover:border-white/20 transition-all duration-300 text-sm tracking-widest uppercase hover:scale-105"
          >
            Voltar ao Início
          </Link>
        </div>

        {/* Xilofone */}
        <div className="flex items-end justify-center gap-2 md:gap-4 h-[350px] p-6 md:p-12 bg-white/[0.02] backdrop-blur-xl rounded-[40px] border border-white/5 shadow-[0_30px_100px_rgba(0,0,0,0.8)] relative">
          {NOTES.map((n, i) => (
            <button
              key={n.note}
              onClick={() => playNote(n.freq, i)}
              className={`w-full max-w-[60px] rounded-b-2xl rounded-t-lg cursor-pointer shadow-lg border-t-4 transition-all duration-150 relative overflow-hidden flex flex-col items-center justify-end pb-6 text-black font-bold font-mono text-sm active:scale-95 ${n.color} ${activeKey === i ? 'brightness-125 translate-y-3 shadow-inner ring-2 ring-white/30' : 'hover:brightness-110 hover:-translate-y-1'}`}
              style={{ height: `${100 - i * 6}%` }}
            >
              {/* Parafusos decorativos de madeira/metal */}
              <div className="absolute top-4 w-3 h-3 rounded-full bg-black/40 border border-white/10 shadow-inner"></div>
              <div className="absolute bottom-16 w-3 h-3 rounded-full bg-black/40 border border-white/10 shadow-inner"></div>
              
              {/* Nome da Nota */}
              <span className="text-black/60 select-none">{n.note}</span>
            </button>
          ))}
        </div>
        
        <p className="text-center text-gray-500 text-xs mt-12 uppercase tracking-[0.3em] animate-pulse">
          Toque nas teclas para ouvir as frequências do Oráculo
        </p>
      </div>
    </main>
  );
}
