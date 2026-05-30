"use client";

import Scene from '@/components/Scene';
import AnimatedText from '@/components/AnimatedText';
import AudioVisualizer from '@/components/AudioVisualizer';
import OverlayMenu from '@/components/OverlayMenu';
import BusinessPopup from '@/components/BusinessPopup';
import { useMenu } from '@/context/MenuContext';

export default function Home() {
  const { isMenuOpen } = useMenu();
  return (
    <main className="relative w-full min-h-screen text-white font-sans overflow-hidden">
      {/* O Canvas 3D fica fixo no fundo */}
      <Scene />
      
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
            <div className="text-sm tracking-widest uppercase text-gray-500 animate-pulse">
              [ Role para baixo ]
            </div>
          </AnimatedText>
        </section>

        {/* Seção 2 - Sobre */}
        <section className="flex flex-col items-start justify-center min-h-screen p-8 md:p-24 bg-gradient-to-b from-transparent to-black/50">
          <AnimatedText>
            <h2 className="text-4xl md:text-6xl font-semibold mb-8">
              A Arte do <span className="italic text-indigo-400">Creative Coding</span>.
            </h2>
          </AnimatedText>
          <AnimatedText>
            <p className="text-lg md:text-xl text-gray-300 max-w-3xl leading-relaxed mb-6 font-light">
              Agências como a Resn nos mostram que a web é um canvas em branco. Utilizando WebGL, Shaders e algoritmos avançados, criamos sites que não apenas entregam informação, mas contam uma história de forma inesquecível.
            </p>
          </AnimatedText>
        </section>

        {/* Seção 3 - Serviços */}
        <section className="flex flex-col items-end justify-center min-h-screen p-8 md:p-24 text-right">
          <AnimatedText>
            <h2 className="text-4xl md:text-6xl font-semibold mb-8">
              Nossas Tecnologias
            </h2>
          </AnimatedText>
          <div className="space-y-6 max-w-xl">
            <AnimatedText>
              <div className="border-b border-white/20 pb-4">
                <h3 className="text-2xl font-medium mb-2 text-indigo-300">Three.js & WebGL</h3>
                <p className="text-gray-400 font-light">Renderização 3D acelerada por hardware direto no navegador.</p>
              </div>
            </AnimatedText>
            <AnimatedText>
              <div className="border-b border-white/20 pb-4">
                <h3 className="text-2xl font-medium mb-2 text-purple-300">GSAP Animations</h3>
                <p className="text-gray-400 font-light">Controle absoluto sobre as linhas do tempo e gatilhos de scroll complexos.</p>
              </div>
            </AnimatedText>
            <AnimatedText>
              <div className="border-b border-white/20 pb-4">
                <h3 className="text-2xl font-medium mb-2 text-pink-300">Next.js & React</h3>
                <p className="text-gray-400 font-light">A fundação robusta para roteamento e escalabilidade moderna.</p>
              </div>
            </AnimatedText>
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
