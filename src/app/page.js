"use client";

import { useState, useEffect } from 'react';
import Scene from '@/components/Scene';
import AnimatedText from '@/components/AnimatedText';
import AudioVisualizer from '@/components/AudioVisualizer';
import OverlayMenu from '@/components/OverlayMenu';
import BusinessPopup from '@/components/BusinessPopup';
import { useMenu } from '@/context/MenuContext';

export default function Home() {
  const { isMenuOpen, toggleMenu } = useMenu();
  const [isOracleVisible, setIsOracleVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const startScroll = window.innerHeight * 2.8;
      const endScroll = window.innerHeight * 4.8;
      const scrollY = window.scrollY;
      
      let progress = 0;
      if (scrollY > startScroll) {
        progress = Math.min((scrollY - startScroll) / (endScroll - startScroll), 1);
      }
      setIsOracleVisible(progress > 0.95);
    };

    window.addEventListener("scroll", handleScroll);
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <main className="relative w-full min-h-screen text-white font-sans overflow-hidden">
      {/* O Canvas 3D fica fixo no fundo */}
      <Scene />

      {/* Botão Consulte O Oráculo Fixo no Centro (aparece no final) */}
      <div 
        className="fixed inset-0 pointer-events-none z-20 flex items-center justify-center transition-all duration-1000"
        style={{ 
          opacity: isOracleVisible ? 1 : 0,
          visibility: isOracleVisible ? 'visible' : 'hidden'
        }}
      >
        <div 
          className="flex flex-col items-center justify-center text-center cursor-pointer rounded-full w-[180px] h-[180px] hover:scale-110 active:scale-95 transition-all duration-500 ease-out pointer-events-auto"
          onClick={(e) => {
            e.preventDefault();
            toggleMenu();
          }}
        >
          <a 
            href="#"
            className="text-transparent bg-clip-text bg-gradient-to-r from-purple-300 to-indigo-300 text-xl md:text-2xl font-light tracking-widest uppercase leading-tight drop-shadow-[0_0_15px_rgba(139,92,246,0.8)] max-w-[120px] md:max-w-[150px] mx-auto block pointer-events-none select-none"
          >
            Consulte<br/>O Oráculo
          </a>
        </div>
      </div>

      {/* Controle de Áudio Generativo */}
      <AudioVisualizer />

      {/* Menu Hamburger e Overlay */}
      <OverlayMenu />

      {/* Popup de Business (Mesa de Reunião) */}
      <BusinessPopup />

      {/* Conteúdo rolável por cima da cena (oculto quando o menu abre) */}
      <div className={`relative z-10 w-full pointer-events-none transition-opacity duration-500 ${isMenuOpen ? 'opacity-0 hidden' : 'opacity-100'}`}>

        {/* Seção 1 - Hero */}
        <section className="flex flex-col items-center justify-center min-h-screen p-8 text-center">
          <AnimatedText>
            <h1 className="text-6xl md:text-8xl font-bold tracking-tighter mb-4 text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-400">
              Digital Identity
            </h1>
          </AnimatedText>
          <AnimatedText className="delay-100">
            <p className="text-xl md:text-2xl text-gray-300 max-w-2xl font-light">
              Pioneirismo em experiências digitais imersivas. O futuro da web não é plano, é tridimensional e interativo.
            </p>
          </AnimatedText>
          <AnimatedText className="mt-12">
            <div className="text-base tracking-[0.2em] font-medium uppercase text-purple-200 animate-bounce drop-shadow-[0_0_10px_rgba(167,139,250,0.8)]">
              [ Role para baixo ]
            </div>
          </AnimatedText>
        </section>

        {/* Seção 2 - Sobre */}
        {/* Removido o bg-gradient da section para não escurecer o fundo indevidamente */}
        <section className="flex flex-col items-start justify-center min-h-screen p-8 md:p-24">
          {/* AQUI VOCÊ CONTROLA A OPACIDADE E O BLUR: O valor 0.05 com o fundo branco gera o "vidro" sem parecer uma caixa preta sólida */}
          <div
            className="backdrop-blur-sm p-8 md:p-12 rounded-3xl border border-white/10 max-w-4xl shadow-2xl"
            style={{ backgroundColor: 'rgba(255, 255, 255, 0)' }}
          >
            <AnimatedText direction="left">
              <h2 className="text-4xl md:text-6xl font-semibold mb-8">
                A Arte do <span className="italic text-indigo-400">Creative Coding</span>.
              </h2>
            </AnimatedText>
            <AnimatedText direction="left">
              <p className="text-lg md:text-xl text-gray-300 max-w-3xl leading-relaxed mb-6 font-light">
                Agências como a Resn nos mostram que a web é um canvas em branco. Utilizando WebGL, Shaders e algoritmos avançados, criamos sites que não apenas entregam informação, mas contam uma história de forma inesquecível.
              </p>
            </AnimatedText>
          </div>
        </section>

        {/* Seção 3 - Serviços */}
        <section className="flex flex-col items-end justify-center min-h-screen p-8 md:p-24 text-right">
          {/* AQUI VOCÊ CONTROLA A OPACIDADE E O BLUR: O valor 0.05 com o fundo branco gera o "vidro" sem parecer uma caixa preta sólida */}
          <div
            className="backdrop-blur-sm p-8 md:p-12 rounded-3xl border border-white/10 max-w-xl shadow-2xl"
            style={{ backgroundColor: 'rgba(255, 255, 255, 0.03)' }}
          >
            <AnimatedText direction="right">
              <h2 className="text-4xl md:text-6xl font-semibold mb-8">
                Nossas Tecnologias
              </h2>
            </AnimatedText>
            <div className="space-y-6">
              <AnimatedText direction="right">
                <div className="border-b border-white/20 pb-4">
                  <h3 className="text-2xl font-medium mb-2 text-indigo-300">Three.js & WebGL</h3>
                  <p className="text-gray-400 font-light">Renderização 3D acelerada por hardware direto no navegador.</p>
                </div>
              </AnimatedText>
              <AnimatedText direction="right">
                <div className="border-b border-white/20 pb-4">
                  <h3 className="text-2xl font-medium mb-2 text-purple-300">GSAP Animations</h3>
                  <p className="text-gray-400 font-light">Controle absoluto sobre as linhas do tempo e gatilhos de scroll complexos.</p>
                </div>
              </AnimatedText>
              <AnimatedText direction="right">
                <div className="border-b border-white/20 pb-4">
                  <h3 className="text-2xl font-medium mb-2 text-pink-300">Next.js & React</h3>
                  <p className="text-gray-400 font-light">A fundação robusta para roteamento e escalabilidade moderna.</p>
                </div>
              </AnimatedText>
            </div>
          </div>
        </section>

        {/* Seção 4 - Zodíaco e Oráculo (Espaço extra para scroll) */}
        <section className="min-h-[500vh] relative z-10 pointer-events-auto">
          {/* O conteúdo visual 3D e o texto estão no componente Scene */}
        </section>

        {/* Footer */}
        <footer className="py-12 text-center bg-black">
          <p className="text-gray-600 font-light text-sm">
            © {new Date().getFullYear()} Digital Identity. Ponta pé inicial criado por Antigravity.
          </p>
        </footer>
      </div>
    </main>
  );
}
