"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import AnimatedText from '@/components/AnimatedText';
import { useMenu } from '@/context/MenuContext';
import { useLanguage } from '@/context/LanguageContext';

export default function Home() {
  const { toggleMenu } = useMenu();
  const { language } = useLanguage();
  const [isOracleVisible, setIsOracleVisible] = useState(false);
  const router = useRouter();

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
            router.push('/produtos');
          }}
        >
          <a
            href="#"
            className="text-transparent bg-clip-text bg-gradient-to-r from-purple-300 to-indigo-300 text-xl md:text-2xl font-light tracking-widest uppercase leading-tight drop-shadow-[0_0_15px_rgba(139,92,246,0.8)] max-w-[120px] md:max-w-[150px] mx-auto block pointer-events-none select-none"
          >
            {language === 'pt' ? (
              <>Consulte<br/>O Oráculo</>
            ) : (
              <>Consult<br/>The Oracle</>
            )}
          </a>
        </div>
      </div>



      {/* Menu Hamburger para navegar para a página de produtos */}
      <button
        onClick={() => router.push('/produtos')}
        className="fixed top-8 right-8 z-[60] w-14 h-14 rounded-full border border-white/20 bg-black/40 backdrop-blur-xl flex flex-col items-center justify-center gap-1.5 transition-all duration-500 hover:bg-white/20 hover:scale-110 active:scale-95 group shadow-xl cursor-pointer"
      >
        <span className="w-6 h-[2px] bg-white transition-all duration-300" />
        <span className="w-6 h-[2px] bg-white transition-all duration-300" />
        <span className="w-6 h-[2px] bg-white transition-all duration-300" />
      </button>

      {/* Conteúdo rolável por cima da cena */}
      <div className="relative z-10 w-full transition-opacity duration-500 opacity-100 pointer-events-none">
        {/* We keep pointer-events-none for the content container so Scene is clickable, but children must have pointer-events-auto if needed */}
        <div className="pointer-events-auto">

        {/* Seção 1 - Hero */}
        <section className="flex flex-col items-center justify-center min-h-screen p-8 text-center">
          <AnimatedText>
            <h1 className="text-6xl md:text-8xl font-bold tracking-tighter mb-4 text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-400">
              VT Tech
            </h1>
          </AnimatedText>
          <AnimatedText className="delay-100">
            <p className="text-xl md:text-2xl text-gray-300 max-w-2xl font-light">
              {language === 'pt' 
                ? 'Websites, aplicativos, sistemas de gestão e soluções sob medida com design e estratégia para gerar resultados'
                : 'Websites, apps, management systems, and custom solutions with design and strategy to deliver results'}
            </p>
          </AnimatedText>
          <AnimatedText className="mt-12">
            <div className="text-base tracking-[0.2em] font-medium uppercase text-purple-200 animate-bounce drop-shadow-[0_0_10px_rgba(167,139,250,0.8)]">
              {language === 'pt' ? '[ Role para baixo ]' : '[ Scroll down ]'}
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
                {language === 'pt' ? (
                  <>Tecnologia que vai <span className="italic text-indigo-400">além da tela</span></>
                ) : (
                  <>Technology that goes <span className="italic text-indigo-400">beyond the screen</span></>
                )}
              </h2>
            </AnimatedText>
            <AnimatedText direction="left">
              <p className="text-lg md:text-xl text-gray-300 max-w-3xl leading-relaxed mb-6 font-light">
                {language === 'pt'
                  ? 'Cada projeto nasce da combinação entre estratégia, design e engenharia. Criamos experiências que não apenas informam, mas envolvem, surpreendem e geram valor para quem utiliza'
                  : 'Every project is born from the combination of strategy, design, and engineering. We create experiences that don\'t just inform, but engage, surprise, and generate value for the users'}
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
                {language === 'pt' ? 'Nossas Ferramentas' : 'Our Tools'}
              </h2>
            </AnimatedText>
            <div className="space-y-6">
              <AnimatedText direction="right">
                <div className="border-b border-white/20 pb-4">
                  <h3 className="text-2xl font-medium mb-2 text-indigo-300">
                    {language === 'pt' ? 'Aplicativos Mobile' : 'Mobile Applications'}
                  </h3>
                  <p className="text-gray-400 font-light">
                    {language === 'pt' 
                      ? 'Soluções multiplataforma para Android e iOS com foco em usabilidade e desempenho.'
                      : 'Cross-platform solutions for Android and iOS focusing on usability and performance.'}
                  </p>
                </div>
              </AnimatedText>
              <AnimatedText direction="right">
                <div className="border-b border-white/20 pb-4">
                  <h3 className="text-2xl font-medium mb-2 text-purple-300">
                    {language === 'pt' ? 'Integrações Inteligentes' : 'Smart Integrations'}
                  </h3>
                  <p className="text-gray-400 font-light">
                    {language === 'pt'
                      ? 'Conexão com APIs, meios de pagamento, ERPs, CRMs e ferramentas de automação.'
                      : 'Connection with APIs, payment gateways, ERPs, CRMs, and automation tools.'}
                  </p>
                </div>
              </AnimatedText>
              <AnimatedText direction="right">
                <div className="border-b border-white/20 pb-4">
                  <h3 className="text-2xl font-medium mb-2 text-pink-300">
                    {language === 'pt' ? 'Inteligência Artificial' : 'Artificial Intelligence'}
                  </h3>
                  <p className="text-gray-400 font-light">
                    {language === 'pt'
                      ? 'Automação de processos, análise de dados, assistentes virtuais e soluções impulsionadas por IA.'
                      : 'Process automation, data analysis, virtual assistants, and AI-driven solutions.'}
                  </p>
                </div>
              </AnimatedText>
            </div>
          </div>
        </section>

        {/* Seção 4 - Zodíaco e Oráculo (Espaço extra para scroll) */}
        <section className="min-h-[500vh] relative z-10 pointer-events-auto">
          {/* O conteúdo visual 3D e o texto estão renderizados no layout */}
        </section>

        {/* Footer */}
        <footer className="py-12 text-center bg-black pointer-events-auto">
          <p className="text-gray-600 font-light text-sm">
            {language === 'pt' 
              ? `© ${new Date().getFullYear()} VT Tech. Ponta pé inicial criado por Antigravity.`
              : `© ${new Date().getFullYear()} VT Tech. Kickstart created by Antigravity.`}
          </p>
        </footer>
        </div>
      </div>
    </main>
  );
}
