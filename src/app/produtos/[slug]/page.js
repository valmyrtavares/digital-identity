"use client";

import { use, useState, useEffect } from 'react';
import Link from 'next/link';
import { useLanguage } from '@/context/LanguageContext';

const PRODUCTS_DATA = {
  genesis: {
    pt: {
      title: "I. Genesis Quântico",
      subtitle: "Websites de Alta Performance",
      desc: "Desenvolvimento de websites tridimensionais, rápidos e imersivos que elevam a presença digital da sua marca ao próximo nível. Integramos arte tridimensional e performance de código.",
      freqLabel: "261.63 Hz (C4 - Frequência da Criação)",
    },
    en: {
      title: "I. Quantum Genesis",
      subtitle: "High Performance Websites",
      desc: "Development of fast, immersive, three-dimensional websites that elevate your brand's digital presence to the next level. We integrate 3D art and code performance.",
      freqLabel: "261.63 Hz (C4 - Creation Frequency)",
    },
    tech: ["Next.js", "React Three Fiber", "WebGL Shaders", "GSAP"],
    color: "from-indigo-500 via-purple-500 to-pink-500",
    shadow: "shadow-indigo-500/20"
  },
  ressonancia: {
    pt: {
      title: "II. Ressonância do Vazio",
      subtitle: "Landing Pages de Alta Conversão",
      desc: "Criação de páginas de destino otimizadas com técnicas de creative coding que capturam a atenção instantaneamente e transformam visitantes em clientes fiéis.",
      freqLabel: "293.66 Hz (D4 - Ressonância de Atração)",
    },
    en: {
      title: "II. Resonance of the Void",
      subtitle: "High Conversion Landing Pages",
      desc: "Creation of optimized landing pages with creative coding techniques that instantly capture attention and turn visitors into loyal customers.",
      freqLabel: "293.66 Hz (D4 - Attraction Resonance)",
    },
    tech: ["GSAP", "Three.js", "Tailwind CSS", "Framer Motion"],
    color: "from-purple-500 via-pink-500 to-rose-500",
    shadow: "shadow-purple-500/20"
  },
  horizontes: {
    pt: {
      title: "III. Horizontes de Neon",
      subtitle: "Soluções de Software Customizadas",
      desc: "Desenvolvimento de sistemas web sob medida desenhados exclusivamente para os processos da sua empresa. Arquitetura altamente escalável e segura.",
      freqLabel: "329.63 Hz (E4 - Frequência de Expansão)",
    },
    en: {
      title: "III. Neon Horizons",
      subtitle: "Custom Software Solutions",
      desc: "Development of tailor-made web systems designed exclusively for your company's processes. Highly scalable and secure architecture.",
      freqLabel: "329.63 Hz (E4 - Expansion Frequency)",
    },
    tech: ["Node.js", "GraphQL", "PostgreSQL", "React"],
    color: "from-blue-500 via-indigo-500 to-purple-500",
    shadow: "shadow-blue-500/20"
  },
  ecos: {
    pt: {
      title: "IV. Ecos do Silêncio",
      subtitle: "Edição de Vídeo e Motion Design",
      desc: "Montagem cinematográfica e computação gráfica de alto nível para comerciais, campanhas e vídeos de produtos que comunicam seu valor em segundos.",
      freqLabel: "349.23 Hz (F4 - Eco de Clareza)",
    },
    en: {
      title: "IV. Echoes of Silence",
      subtitle: "Video Editing and Motion Design",
      desc: "High-level cinematic editing and computer graphics for commercials, campaigns, and product videos that communicate your value in seconds.",
      freqLabel: "349.23 Hz (F4 - Clarity Echo)",
    },
    tech: ["After Effects", "Premiere Pro", "DaVinci Resolve", "Audition"],
    color: "from-pink-500 via-rose-500 to-red-500",
    shadow: "shadow-pink-500/20"
  },
  ondas: {
    pt: {
      title: "V. Ondas Cromáticas",
      subtitle: "Produtos Digitais Especiais",
      desc: "Templates premium, pacotes de componentes reutilizáveis e shaders prontos para integrar em seus próprios projetos, acelerando seu time de design.",
      freqLabel: "392.00 Hz (G4 - Onda de Inspiração)",
    },
    en: {
      title: "V. Chromatic Waves",
      subtitle: "Special Digital Products",
      desc: "Premium templates, reusable component packages, and shaders ready to integrate into your own projects, accelerating your design team.",
      freqLabel: "392.00 Hz (G4 - Inspiration Wave)",
    },
    tech: ["React Components", "WebGL Shaders", "Tailwind Theme Modules"],
    color: "from-teal-500 via-emerald-500 to-green-500",
    shadow: "shadow-teal-500/20"
  },
  desvio: {
    pt: {
      title: "VI. Desvio Temporal",
      subtitle: "ERP Gastronômico Inteligente",
      desc: "A solução completa para automação comercial de bares, restaurantes e bistrôs. Pedidos por tablets, cozinha inteligente, estoque ágil e faturamento em tempo real.",
      freqLabel: "440.00 Hz (A4 - Frequência de Equilíbrio)",
    },
    en: {
      title: "VI. Temporal Deviation",
      subtitle: "Intelligent Gastronomic ERP",
      desc: "The complete solution for commercial automation of bars, restaurants, and bistros. Tablet ordering, smart kitchen, agile inventory, and real-time billing.",
      freqLabel: "440.00 Hz (A4 - Balance Frequency)",
    },
    tech: ["Next.js", "WebSockets", "Prisma ORM", "Redis"],
    color: "from-orange-500 via-red-500 to-rose-500",
    shadow: "shadow-orange-500/20"
  },
  materia: {
    pt: {
      title: "VII. Matéria Escura",
      subtitle: "Desenvolvedor Full Stack Sênior",
      desc: "Consultoria hands-on para grandes sistemas e novos produtos. Do design de APIs eficientes ao deploy seguro na nuvem com escalabilidade garantida.",
      freqLabel: "493.88 Hz (B4 - Frequência de Conexão)",
    },
    en: {
      title: "VII. Dark Matter",
      subtitle: "Senior Full Stack Developer",
      desc: "Hands-on consulting for large systems and new products. From efficient API design to secure cloud deployment with guaranteed scalability.",
      freqLabel: "493.88 Hz (B4 - Connection Frequency)",
    },
    tech: ["TypeScript", "Docker", "AWS / GCP", "Kubernetes"],
    color: "from-cyan-500 via-blue-500 to-indigo-500",
    shadow: "shadow-cyan-500/20"
  },
  fluxo: {
    pt: {
      title: "VIII. Fluxo de Pragma",
      subtitle: "Consultoria Tech e Arquitetura",
      desc: "Aconselhamento estratégico de tecnologia para CEOs, CTOs e Fundadores. Auditoria de arquitetura, estruturação ágil de equipes e decisões de cloud.",
      freqLabel: "523.25 Hz (C5 - Frequência de Fluxo)",
    },
    en: {
      title: "VIII. Pragma Flow",
      subtitle: "Tech Consulting and Architecture",
      desc: "Strategic technology advice for CEOs, CTOs, and Founders. Architecture audit, agile team structuring, and cloud decisions.",
      freqLabel: "523.25 Hz (C5 - Flow Frequency)",
    },
    tech: ["System Design", "Cloud Architecture", "Technical Leadership"],
    color: "from-violet-500 via-purple-500 to-indigo-500",
    shadow: "shadow-violet-500/20"
  }
};

export default function ProdutoDetalhe({ params }) {
  const { language } = useLanguage();
  const resolvedParams = use(params);
  const slug = resolvedParams.slug;
  const product = PRODUCTS_DATA[slug];
  
  const isCustomForm = ['horizontes', 'materia', 'fluxo', 'ecos'].includes(slug);
  const hideTechBadges = ['horizontes', 'materia', 'fluxo'].includes(slug);

  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined' && slug === 'ondas') {
      const handleHashChange = () => {
        if (window.location.hash) {
          const id = window.location.hash.substring(1);
          const element = document.getElementById(id);
          if (element) {
            setTimeout(() => {
              element.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }, 200);
          }
        }
      };

      // Run on mount
      handleHashChange();

      // Listen for hash changes
      window.addEventListener('hashchange', handleHashChange);
      return () => window.removeEventListener('hashchange', handleHashChange);
    }
  }, [slug]);

  if (slug === "ondas") {
    return (
      <main className="min-h-screen bg-[#050505] text-white flex flex-col items-center p-6 md:p-12 font-sans relative overflow-hidden">
        {/* Background glow radial */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[60vw] h-[60vw] rounded-full bg-gradient-to-br from-teal-500/10 via-purple-500/10 to-pink-500/10 opacity-30 blur-[130px] pointer-events-none"></div>

        <div className="max-w-5xl w-full relative z-10">
          {/* Header de navegação */}
          <div className="mb-16 flex items-center justify-between">
            <Link 
              href="/" 
              onClick={(e) => { e.currentTarget.innerHTML = `<span class='text-gray-400'>${language === 'pt' ? 'AGUARDE...' : 'WAIT...'}</span>`; }}
              className="flex items-center gap-2 text-sm text-gray-400 hover:text-white transition-colors group uppercase tracking-widest"
            >
              <span className="group-hover:-translate-x-1 transition-transform">←</span> {language === 'pt' ? 'Início' : 'Home'}
            </Link>
          </div>

          {/* Título Principal */}
          <div className="text-center mb-10">
            <h1 className="text-4xl md:text-6xl font-extralight tracking-widest uppercase text-transparent bg-clip-text bg-gradient-to-r from-white via-gray-300 to-gray-500 leading-tight">
              {language === 'pt' ? 'PRODUTOS DIGITAIS' : 'DIGITAL PRODUCTS'}
            </h1>
            <div className="h-[1px] w-24 bg-gradient-to-r from-teal-500 to-pink-500 mx-auto mt-6"></div>
          </div>

          {/* Menu Discreto de Navegação Rápida */}
          <div className="flex flex-wrap justify-center gap-4 md:gap-8 mb-20 text-xs md:text-sm uppercase tracking-[0.2em] text-gray-500 font-light">
            {[
              { id: "geracao-z", name: "Geração Z" },
              { id: "astroclock", name: "Astroclock" },
              { id: "project-math", name: "Project Math" },
              { id: "dvd-web", name: "DVD Web" }
            ].map((item) => (
              <a 
                key={item.id} 
                href={`#${item.id}`}
                onClick={(e) => {
                  e.preventDefault();
                  const element = document.getElementById(item.id);
                  if (element) {
                    element.scrollIntoView({ behavior: 'smooth', block: 'center' });
                    window.history.pushState(null, null, `#${item.id}`);
                  }
                }}
                className="hover:text-white transition-colors duration-300 hover:scale-105 active:scale-95 transform px-3 py-1 border border-white/5 rounded-full hover:border-white/20 bg-white/[0.01]"
              >
                {item.name}
              </a>
            ))}
          </div>

          {/* Projetos */}
          <div className="space-y-16 md:space-y-24">
            {[
              {
                id: "geracao-z",
                title_pt: "Geração Z Sistemas",
                title_en: "Geração Z Sistemas",
                desc_pt: "ERP Gastronômico inovador desenvolvido para automatizar e otimizar a gestão de restaurantes, bares e bistrôs. Conta com controle ágil de pedidos, gerenciamento de estoque inteligente e faturamento simplificado em tempo real.",
                desc_en: "Innovative Gastronomic ERP developed to automate and optimize the management of restaurants, bars, and bistros. Features agile order tracking, intelligent inventory management, and simplified real-time billing.",
                img: "/image/Geração z.png"
              },
              {
                id: "astroclock",
                title_pt: "Astroclock",
                title_en: "Astroclock",
                desc_pt: "Um relógio astronômico interativo que conecta a marcação do tempo aos ciclos celestes. Uma experiência imersiva desenvolvida com conceitos matemáticos e órbitas desenhadas em tempo real.",
                desc_en: "An interactive astronomical clock that connects timekeeping to celestial cycles. An immersive experience developed with mathematical concepts and orbits rendered in real time.",
                img: "/image/astroclock.png"
              },
              {
                id: "project-math",
                title_pt: "Project Math",
                title_en: "Project Math",
                desc_pt: "Plataforma de aprendizado e visualização matemática interativa. Transforma equações complexas e conceitos geométricos em gráficos dinâmicos tridimensionais, interativos e fáceis de compreender.",
                desc_en: "Interactive mathematics learning and visualization platform. Transforms complex equations and geometric concepts into dynamic, interactive 3D graphs that are easy to understand.",
                img: "/image/project math.png"
              },
              {
                id: "dvd-web",
                title_pt: "DVD Web",
                title_en: "DVD Web",
                desc_pt: "Uma recriação nostálgica e moderna do clássico protetor de tela do DVD. Desenvolvido com físicas leves em tempo real e efeitos visuais interativos que reagem ao comportamento do navegador.",
                desc_en: "A nostalgic and modern recreation of the classic DVD screensaver. Developed with lightweight real-time physics and interactive visual effects that react to browser behavior.",
                img: "/image/DVD web.png"
              }
            ].map((proj, idx) => {
              const title = language === 'pt' ? proj.title_pt : proj.title_en;
              const desc = language === 'pt' ? proj.desc_pt : proj.desc_en;
              return (
                <div 
                  key={idx} 
                  id={proj.id}
                  className="flex flex-col md:flex-row items-center gap-8 md:gap-16 bg-[#050505] rounded-[32px] border border-white/5 p-8 md:p-12 hover:border-white/10 transition-all duration-500 scroll-mt-[10vh]"
                >
                  {/* Descrição à esquerda */}
                  <div className="flex-1 order-2 md:order-1">
                    <h2 className="text-2xl md:text-3xl font-light tracking-wide mb-4 text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-300">
                      {title}
                    </h2>
                    <p className="text-gray-400 font-light leading-relaxed text-base md:text-lg">
                      {desc}
                    </p>
                  </div>

                  {/* Imagem à direita */}
                  <div className="w-full md:w-[350px] aspect-[4/3] relative rounded-2xl overflow-hidden border border-white/5 order-1 md:order-2 bg-[#050505] flex items-center justify-center group">
                    <img 
                      src={proj.img} 
                      alt={title}
                      className="w-full h-full object-contain transition-transform duration-700 group-hover:scale-105"
                    />
                  </div>
                </div>
              );
            })}
          </div>

          {/* Espaçador inferior para centralizar o último item */}
          <div className="h-[75vh]"></div>

        </div>
      </main>
    );
  }

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [siteTitle, setSiteTitle] = useState('');
  const [segment, setSegment] = useState('');
  const [referenceSites, setReferenceSites] = useState([]);
  const [referenceInput, setReferenceInput] = useState('');
  const [description, setDescription] = useState('');

  if (!product) {
    return (
      <main className="min-h-screen bg-[#050505] text-white flex flex-col items-center justify-center p-8">
        <h2 className="text-2xl font-bold">{language === 'pt' ? 'Produto não encontrado' : 'Product not found'}</h2>
        <Link href="/" className="mt-4 px-6 py-2 border border-white/20 rounded-full hover:bg-white/10">
          {language === 'pt' ? 'Voltar ao Início' : 'Back to Home'}
        </Link>
      </main>
    );
  }

  const langData = product[language];

  const handlePaste = (e) => {
    e.preventDefault();
    const pastedText = e.clipboardData.getData('text');
    if (pastedText && pastedText.trim() !== '') {
      setReferenceSites((prev) => [...prev, pastedText.trim()]);
      setReferenceInput('');
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      if (referenceInput.trim() !== '') {
        setReferenceSites((prev) => [...prev, referenceInput.trim()]);
        setReferenceInput('');
      }
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    let message = '';
    
    if (isCustomForm) {
      if (language === 'pt') {
        message = `Olá! Gostaria de falar sobre o meu projeto:\n- Descrição: ${description}`;
      } else {
        message = `Hello! I'd like to talk about my project:\n- Description: ${description}`;
      }
    } else {
      if (language === 'pt') {
        message = `Olá! Gostaria de falar sobre o meu projeto:
- Título do site: ${siteTitle}
- Segmento: ${segment}
- Referências: ${referenceSites.join(', ')}
- Descrição: ${description}`;
      } else {
        message = `Hello! I'd like to talk about my project:
- Site Title: ${siteTitle}
- Segment: ${segment}
- References: ${referenceSites.join(', ')}
- Description: ${description}`;
      }
    }
    
    const encodedMessage = encodeURIComponent(message);
    window.open(`https://wa.me/5511970741310?text=${encodedMessage}`, '_blank');
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
            <span className="group-hover:-translate-x-1 transition-transform">←</span> {language === 'pt' ? 'Início' : 'Home'}
          </Link>
          {/* Botão Oráculo Sonoro Removido a pedido */}
        </div>

        {/* Card do Produto */}
        <div className={`bg-white/[0.02] backdrop-blur-xl rounded-[40px] border border-white/5 p-8 md:p-16 shadow-[0_30px_100px_rgba(0,0,0,0.8)] ${product.shadow} transition-all duration-700`}>
          
          <div className="mb-8">
            <Link 
              href="/produtos"
              className={`inline-block px-4 py-1.5 text-xs uppercase tracking-widest rounded-full bg-gradient-to-r ${product.color} text-black font-semibold mb-4 hover:scale-105 hover:opacity-90 active:scale-95 transition-all duration-300 cursor-pointer`}
              title={language === 'pt' ? "Voltar para Produtos" : "Back to Products"}
            >
              {langData.title}
            </Link>
            <h1 className="text-3xl md:text-5xl font-extralight tracking-widest uppercase text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-400 leading-tight">
              {langData.subtitle}
            </h1>
          </div>

          {/* Descrição */}
          <p className="text-lg md:text-xl text-gray-300 font-light leading-relaxed mb-10">
            {langData.desc}
          </p>

          {slug === "desvio" && (
            <div className="mb-10">
              <a 
                href="https://geracaozsistemas.com.br/" 
                target="_blank" 
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-full font-medium text-black bg-gradient-to-r from-orange-400 to-rose-400 hover:from-orange-500 hover:to-rose-500 transition-all duration-300 hover:scale-105 active:scale-95 shadow-lg shadow-orange-500/20"
              >
                Visitar Geração Z Sistemas 
                <span className="text-sm">↗</span>
              </a>
            </div>
          )}

          {/* Badges de Tecnologias */}
          {!hideTechBadges && (
            <div className="mb-12">
              <h3 className="text-xs uppercase tracking-[0.2em] text-gray-500 mb-4">{language === 'pt' ? 'Tecnologias Envolvidas' : 'Core Technologies'}</h3>
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
          )}

          {/* Botão Vamos conversar e Formulário */}
          <div className="mt-8 border-t border-white/5 pt-8">
            {!isFormOpen ? (
              <button
                onClick={() => setIsFormOpen(true)}
                className={`w-full md:w-auto px-8 py-4 rounded-full font-semibold tracking-wider text-black bg-gradient-to-r ${product.color} hover:opacity-90 hover:scale-105 transition-all duration-300 flex items-center justify-center gap-3 active:scale-95 shadow-lg cursor-pointer`}
              >
                {language === 'pt' ? 'Vamos conversar' : 'Let\'s talk'}
              </button>
            ) : (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-medium tracking-wide text-white">{language === 'pt' ? 'Nos conte sobre o seu projeto' : 'Tell us about your project'}</h3>
                  <button 
                    type="button"
                    onClick={() => setIsFormOpen(false)}
                    className="text-xs uppercase tracking-widest text-gray-400 hover:text-white transition-colors cursor-pointer"
                  >
                    {language === 'pt' ? 'Fechar formulário' : 'Close form'}
                  </button>
                </div>
                
                <form onSubmit={handleSubmit} className="space-y-4">
                  {!isCustomForm && (
                    <>
                      <div>
                        <label className="block text-xs uppercase tracking-[0.2em] text-gray-400 mb-2 font-medium">{language === 'pt' ? 'Título do site' : 'Site Title'}</label>
                        <input
                          type="text"
                          value={siteTitle}
                          onChange={(e) => setSiteTitle(e.target.value)}
                          placeholder={language === 'pt' ? "Ex: Meu E-commerce Premium" : "Ex: My Premium E-commerce"}
                          className="w-full px-4 py-3 rounded-xl border border-white/10 bg-white/[0.02] focus:bg-white/[0.05] focus:border-indigo-500 focus:outline-none text-white transition-all font-light"
                          required={!isCustomForm}
                        />
                      </div>

                      <div>
                        <label className="block text-xs uppercase tracking-[0.2em] text-gray-400 mb-2 font-medium">{language === 'pt' ? 'Segmento de atuação' : 'Business Segment'}</label>
                        <input
                          type="text"
                          value={segment}
                          onChange={(e) => setSegment(e.target.value)}
                          placeholder={language === 'pt' ? "Ex: Tecnologia, Moda, Alimentação..." : "Ex: Technology, Fashion, Food..."}
                          className="w-full px-4 py-3 rounded-xl border border-white/10 bg-white/[0.02] focus:bg-white/[0.05] focus:border-indigo-500 focus:outline-none text-white transition-all font-light"
                          required={!isCustomForm}
                        />
                      </div>

                      <div>
                        <label className="block text-xs uppercase tracking-[0.2em] text-gray-400 mb-2 font-medium">{language === 'pt' ? 'Alguns sites de referência' : 'Some reference sites'}</label>
                        <input
                          type="text"
                          value={referenceInput}
                          onChange={(e) => setReferenceInput(e.target.value)}
                          onPaste={handlePaste}
                          onKeyDown={handleKeyDown}
                          placeholder={language === 'pt' ? "Cole o link" : "Paste link here"}
                          className="w-full px-4 py-3 rounded-xl border border-white/10 bg-white/[0.02] focus:bg-white/[0.05] focus:border-indigo-500 focus:outline-none text-white transition-all font-light"
                        />
                        
                        {/* Lista de links colados */}
                        {referenceSites.length > 0 && (
                          <div className="flex flex-wrap gap-2 mt-3">
                            {referenceSites.map((site, index) => (
                              <div 
                                key={index}
                                className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 text-xs text-gray-300"
                              >
                                <span className="truncate max-w-[200px] font-mono">{site}</span>
                                <button
                                  type="button"
                                  onClick={() => setReferenceSites(prev => prev.filter((_, i) => i !== index))}
                                  className="text-gray-400 hover:text-white font-bold cursor-pointer"
                                >
                                  ×
                                </button>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    </>
                  )}

                  <div>
                    <label className="block text-xs uppercase tracking-[0.2em] text-gray-400 mb-2 font-medium">
                      {isCustomForm 
                        ? (language === 'pt' ? 'Pequena descrição do projeto' : 'Short project description') 
                        : (language === 'pt' ? 'Pequena descrição do site' : 'Short site description')}
                    </label>
                    <textarea
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      placeholder={isCustomForm 
                        ? (language === 'pt' ? "Descreva o que o projeto precisará fazer." : "Describe what the project will need to do.")
                        : (language === 'pt' ? "Compartilhe as informações que achar que são relevantes sobre sua casa digital (site)" : "Share the information you think is relevant about your digital home (site)")}
                      rows={4}
                      className="w-full px-4 py-3 rounded-xl border border-white/10 bg-white/[0.02] focus:bg-white/[0.05] focus:border-indigo-500 focus:outline-none text-white transition-all font-light resize-none"
                      required
                    />
                  </div>

                  <div className="flex justify-start">
                    <button
                      type="submit"
                      className="px-8 py-3 rounded-xl font-semibold tracking-wider text-black bg-white hover:bg-gray-200 transition-all duration-300 active:scale-95 shadow-lg cursor-pointer text-center text-sm"
                    >
                      {language === 'pt' ? 'Enviar' : 'Send'}
                    </button>
                  </div>
                </form>

                {/* Alternativa do WhatsApp Direto */}
                <div className="flex flex-col items-center justify-center pt-6 border-t border-white/5 space-y-3">
                  <span className="text-xs uppercase tracking-[0.3em] text-gray-500">{language === 'pt' ? 'ou' : 'or'}</span>
                  <p className="text-sm text-gray-400 font-light">{language === 'pt' ? 'Me mande uma mensagem direto e vamos falar.' : 'Send me a direct message and let\'s talk.'}</p>
                  
                  <a
                    href={`https://wa.me/5511970741310?text=${encodeURIComponent(language === 'pt' ? 'Olá! Gostaria de conversar sobre meu projeto.' : 'Hello! I would like to talk about my project.')}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-8 py-4 rounded-full border border-emerald-500/20 bg-emerald-500/10 text-emerald-300 hover:bg-emerald-500/20 hover:border-emerald-500/40 transition-all duration-300 flex items-center gap-2 text-sm font-semibold hover:scale-105 active:scale-95 cursor-pointer shadow-lg"
                  >
                    <svg className="w-5 h-5 fill-current text-emerald-400" viewBox="0 0 24 24">
                      <path d="M12.012 2c-5.506 0-9.988 4.482-9.988 9.988 0 1.758.459 3.473 1.332 4.987l-1.356 4.954 5.074-1.33c1.458.795 3.09 1.217 4.75 1.217h.004c5.506 0 9.99-4.484 9.99-9.99 0-2.67-1.04-5.18-2.93-7.07-1.89-1.89-4.4-2.93-7.076-2.93zm5.836 14.195c-.24.675-1.18 1.312-1.63 1.373-.45.06-1.01.12-2.9-.62-2.42-.96-3.97-3.41-4.09-3.58-.12-.17-.99-1.31-.99-2.5 0-1.19.62-1.78.84-2.02.22-.24.49-.3.65-.3h.47c.15 0 .36-.06.56.42.2.49.69 1.68.75 1.8.06.12.1.27.02.43-.08.16-.12.26-.24.4-.12.14-.26.31-.37.42-.12.12-.25.25-.11.49.14.24.62 1.02 1.33 1.65.91.81 1.68 1.06 1.92 1.18.24.12.38.1.52-.06.14-.17.61-.71.77-.95.16-.24.32-.2.54-.12.22.08 1.4.66 1.64.78.24.12.4.18.46.28.06.1.06.57-.18 1.25z"/>
                    </svg>
                    {language === 'pt' ? 'Falar no WhatsApp' : 'Chat on WhatsApp'}
                  </a>
                </div>
              </div>
            )}
          </div>

        </div>

      </div>
    </main>
  );
}
