"use client";

import { use, useState } from 'react';
import Link from 'next/link';

const PRODUCTS_DATA = {
  genesis: {
    title: "I. Genesis Quântico",
    subtitle: "Websites de Alta Performance",
    desc: "Desenvolvimento de websites tridimensionais, rápidos e imersivos que elevam a presença digital da sua marca ao próximo nível. Integramos arte tridimensional e performance de código.",
    tech: ["Next.js", "React Three Fiber", "WebGL Shaders", "GSAP"],
    frequency: 261.63,
    freqLabel: "261.63 Hz (C4 - Frequência da Criação)",
    color: "from-indigo-500 via-purple-500 to-pink-500",
    shadow: "shadow-indigo-500/20"
  },
  ressonancia: {
    title: "II. Ressonância do Vazio",
    subtitle: "Landing Pages de Alta Conversão",
    desc: "Criação de páginas de destino otimizadas com técnicas de creative coding que capturam a atenção instantaneamente e transformam visitantes em clientes fiéis.",
    tech: ["GSAP", "Three.js", "Tailwind CSS", "Framer Motion"],
    frequency: 293.66,
    freqLabel: "293.66 Hz (D4 - Ressonância de Atração)",
    color: "from-purple-500 via-pink-500 to-rose-500",
    shadow: "shadow-purple-500/20"
  },
  horizontes: {
    title: "III. Horizontes de Neon",
    subtitle: "Soluções de Software Customizadas",
    desc: "Desenvolvimento de sistemas web sob medida desenhados exclusivamente para os processos da sua empresa. Arquitetura altamente escalável e segura.",
    tech: ["Node.js", "GraphQL", "PostgreSQL", "React"],
    frequency: 329.63,
    freqLabel: "329.63 Hz (E4 - Frequência de Expansão)",
    color: "from-blue-500 via-indigo-500 to-purple-500",
    shadow: "shadow-blue-500/20"
  },
  ecos: {
    title: "IV. Ecos do Silêncio",
    subtitle: "Edição de Vídeo e Motion Design",
    desc: "Montagem cinematográfica e computação gráfica de alto nível para comerciais, campanhas e vídeos de produtos que comunicam seu valor em segundos.",
    tech: ["After Effects", "Premiere Pro", "DaVinci Resolve", "Audition"],
    frequency: 349.23,
    freqLabel: "349.23 Hz (F4 - Eco de Clareza)",
    color: "from-pink-500 via-rose-500 to-red-500",
    shadow: "shadow-pink-500/20"
  },
  ondas: {
    title: "V. Ondas Cromáticas",
    subtitle: "Produtos Digitais Especiais",
    desc: "Templates premium, pacotes de componentes reutilizáveis e shaders prontos para integrar em seus próprios projetos, acelerando seu time de design.",
    tech: ["React Components", "WebGL Shaders", "Tailwind Theme Modules"],
    frequency: 392.00,
    freqLabel: "392.00 Hz (G4 - Onda de Inspiração)",
    color: "from-teal-500 via-emerald-500 to-green-500",
    shadow: "shadow-teal-500/20"
  },
  desvio: {
    title: "VI. Desvio Temporal",
    subtitle: "ERP Gastronômico Inteligente",
    desc: "A solução completa para automação comercial de bares, restaurantes e bistrôs. Pedidos por tablets, cozinha inteligente, estoque ágil e faturamento em tempo real.",
    tech: ["Next.js", "WebSockets", "Prisma ORM", "Redis"],
    frequency: 440.00,
    freqLabel: "440.00 Hz (A4 - Frequência de Equilíbrio)",
    color: "from-orange-500 via-red-500 to-rose-500",
    shadow: "shadow-orange-500/20"
  },
  materia: {
    title: "VII. Matéria Escura",
    subtitle: "Desenvolvedor Full Stack Sênior",
    desc: "Consultoria hands-on para grandes sistemas e novos produtos. Do design de APIs eficientes ao deploy seguro na nuvem com escalabilidade garantida.",
    tech: ["TypeScript", "Docker", "AWS / GCP", "Kubernetes"],
    frequency: 493.88,
    freqLabel: "493.88 Hz (B4 - Frequência de Conexão)",
    color: "from-cyan-500 via-blue-500 to-indigo-500",
    shadow: "shadow-cyan-500/20"
  },
  fluxo: {
    title: "VIII. Fluxo de Pragma",
    subtitle: "Consultoria Tech e Arquitetura",
    desc: "Aconselhamento estratégico de tecnologia para CEOs, CTOs e Fundadores. Auditoria de arquitetura, estruturação ágil de equipes e decisões de cloud.",
    tech: ["System Design", "Cloud Architecture", "Technical Leadership"],
    frequency: 523.25,
    freqLabel: "523.25 Hz (C5 - Frequência de Fluxo)",
    color: "from-violet-500 via-purple-500 to-indigo-500",
    shadow: "shadow-violet-500/20"
  }
};

export default function ProdutoDetalhe({ params }) {
  const resolvedParams = use(params);
  const slug = resolvedParams.slug;
  const product = PRODUCTS_DATA[slug];

  const [isPlaying, setIsPlaying] = useState(false);

  if (!product) {
    return (
      <main className="min-h-screen bg-[#050505] text-white flex flex-col items-center justify-center p-8">
        <h2 className="text-2xl font-bold">Produto não encontrado</h2>
        <Link href="/" className="mt-4 px-6 py-2 border border-white/20 rounded-full hover:bg-white/10">
          Voltar ao Início
        </Link>
      </main>
    );
  }

  const playFrequency = () => {
    setIsPlaying(true);
    setTimeout(() => setIsPlaying(false), 1500);

    const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    const oscillator = audioCtx.createOscillator();
    const gainNode = audioCtx.createGain();

    oscillator.type = 'sine';
    oscillator.frequency.setValueAtTime(product.frequency, audioCtx.currentTime);

    gainNode.gain.setValueAtTime(0, audioCtx.currentTime);
    gainNode.gain.linearRampToValueAtTime(0.7, audioCtx.currentTime + 0.05);
    gainNode.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 1.5);

    oscillator.connect(gainNode);
    gainNode.connect(audioCtx.destination);

    oscillator.start(audioCtx.currentTime);
    oscillator.stop(audioCtx.currentTime + 1.5);
  };

  return (
    <main className="min-h-screen bg-[#050505] text-white flex flex-col items-center justify-center p-6 md:p-12 font-sans relative overflow-hidden">
      {/* Background glow radial combinando com a cor do produto */}
      <div className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[50vw] h-[50vw] rounded-full bg-gradient-to-br ${product.color} opacity-[0.03] blur-[120px] pointer-events-none`}></div>

      <div className="max-w-3xl w-full relative z-10">
        {/* Links de navegação superior */}
        <div className="mb-16 flex items-center justify-between">
          <Link 
            href="/" 
            className="flex items-center gap-2 text-sm text-gray-400 hover:text-white transition-colors group uppercase tracking-widest"
          >
            <span className="group-hover:-translate-x-1 transition-transform">←</span> Início
          </Link>
          <Link 
            href="/produtos" 
            className="px-6 py-2 border border-white/10 rounded-full hover:bg-white/10 hover:border-white/20 transition-colors text-xs uppercase tracking-wider"
          >
            Oráculo Sonoro
          </Link>
        </div>

        {/* Card do Produto */}
        <div className={`bg-white/[0.02] backdrop-blur-xl rounded-[40px] border border-white/5 p-8 md:p-16 shadow-[0_30px_100px_rgba(0,0,0,0.8)] ${product.shadow} transition-all duration-700`}>
          
          {/* Header */}
          <div className="mb-8">
            <span className={`inline-block px-4 py-1.5 text-xs uppercase tracking-widest rounded-full bg-gradient-to-r ${product.color} text-black font-semibold mb-4`}>
              {product.subtitle}
            </span>
            <h1 className="text-3xl md:text-5xl font-extralight tracking-widest uppercase text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-400 leading-tight">
              {product.title}
            </h1>
          </div>

          {/* Descrição */}
          <p className="text-lg md:text-xl text-gray-300 font-light leading-relaxed mb-10">
            {product.desc}
          </p>

          {/* Badges de Tecnologias */}
          <div className="mb-12">
            <h3 className="text-xs uppercase tracking-[0.2em] text-gray-500 mb-4">Tecnologias Envolvidas</h3>
            <div className="flex flex-wrap gap-2">
              {product.tech.map((t, idx) => (
                <span 
                  key={idx} 
                  className="px-4 py-1.5 rounded-full border border-white/10 bg-white/[0.01] text-sm text-gray-300 font-light"
                >
                  {t}
                </span>
              ))}
            </div>
          </div>

          {/* Player de Frequência Harmônica */}
          <div className="border-t border-white/5 pt-10 flex flex-col md:flex-row items-center justify-between gap-6">
            <div>
              <h3 className="text-xs uppercase tracking-[0.2em] text-gray-500 mb-1">Frequência Harmônica</h3>
              <p className="text-sm text-indigo-300 font-mono tracking-wide">{product.freqLabel}</p>
            </div>
            
            <button
              onClick={playFrequency}
              className={`w-full md:w-auto px-8 py-4 rounded-full font-semibold tracking-wider text-black bg-white hover:bg-gray-100 transition-all duration-300 flex items-center justify-center gap-3 active:scale-95 shadow-lg cursor-pointer ${isPlaying ? 'scale-95 brightness-90 animate-pulse' : 'hover:scale-105 hover:shadow-white/10'}`}
            >
              {isPlaying ? (
                <>
                  <span className="flex gap-1 h-3 items-center">
                    <span className="w-[3px] h-3 bg-black rounded-full animate-bounce"></span>
                    <span className="w-[3px] h-2 bg-black rounded-full animate-bounce [animation-delay:0.2s]"></span>
                    <span className="w-[3px] h-4 bg-black rounded-full animate-bounce [animation-delay:0.4s]"></span>
                  </span>
                  Ressonando...
                </>
              ) : (
                <>
                  <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                    <path d="M8 5v14l11-7z" />
                  </svg>
                  Tocar Frequência
                </>
              )}
            </button>
          </div>

        </div>

      </div>
    </main>
  );
}
