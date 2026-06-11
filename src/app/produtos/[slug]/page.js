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

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [siteTitle, setSiteTitle] = useState('');
  const [segment, setSegment] = useState('');
  const [referenceSites, setReferenceSites] = useState([]);
  const [referenceInput, setReferenceInput] = useState('');
  const [description, setDescription] = useState('');

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
    const message = `Olá! Gostaria de falar sobre o meu projeto:
- Título do site: ${siteTitle}
- Segmento: ${segment}
- Referências: ${referenceSites.join(', ')}
- Descrição: ${description}`;
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
            <span className="group-hover:-translate-x-1 transition-transform">←</span> Início
          </Link>
          {/* Botão Oráculo Sonoro Removido a pedido */}
        </div>

        {/* Card do Produto */}
        <div className={`bg-white/[0.02] backdrop-blur-xl rounded-[40px] border border-white/5 p-8 md:p-16 shadow-[0_30px_100px_rgba(0,0,0,0.8)] ${product.shadow} transition-all duration-700`}>
          
          {/* Header */}
          <div className="mb-8">
            <span className={`inline-block px-4 py-1.5 text-xs uppercase tracking-widest rounded-full bg-gradient-to-r ${product.color} text-black font-semibold mb-4`}>
              {product.title}
            </span>
            <h1 className="text-3xl md:text-5xl font-extralight tracking-widest uppercase text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-400 leading-tight">
              {product.subtitle}
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

          {/* Botão Vamos conversar e Formulário */}
          <div className="mt-8 border-t border-white/5 pt-8">
            {!isFormOpen ? (
              <button
                onClick={() => setIsFormOpen(true)}
                className={`w-full md:w-auto px-8 py-4 rounded-full font-semibold tracking-wider text-black bg-gradient-to-r ${product.color} hover:opacity-90 hover:scale-105 transition-all duration-300 flex items-center justify-center gap-3 active:scale-95 shadow-lg cursor-pointer`}
              >
                Vamos conversar
              </button>
            ) : (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-medium tracking-wide text-white">Nos conte sobre o seu projeto</h3>
                  <button 
                    type="button"
                    onClick={() => setIsFormOpen(false)}
                    className="text-xs uppercase tracking-widest text-gray-400 hover:text-white transition-colors cursor-pointer"
                  >
                    Fechar formulário
                  </button>
                </div>
                
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label className="block text-xs uppercase tracking-[0.2em] text-gray-400 mb-2 font-medium">Título do site</label>
                    <input
                      type="text"
                      value={siteTitle}
                      onChange={(e) => setSiteTitle(e.target.value)}
                      placeholder="Ex: Meu E-commerce Premium"
                      className="w-full px-4 py-3 rounded-xl border border-white/10 bg-white/[0.02] focus:bg-white/[0.05] focus:border-indigo-500 focus:outline-none text-white transition-all font-light"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-xs uppercase tracking-[0.2em] text-gray-400 mb-2 font-medium">Segmento de atuação</label>
                    <input
                      type="text"
                      value={segment}
                      onChange={(e) => setSegment(e.target.value)}
                      placeholder="Ex: Tecnologia, Moda, Alimentação..."
                      className="w-full px-4 py-3 rounded-xl border border-white/10 bg-white/[0.02] focus:bg-white/[0.05] focus:border-indigo-500 focus:outline-none text-white transition-all font-light"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-xs uppercase tracking-[0.2em] text-gray-400 mb-2 font-medium">Alguns sites de referência</label>
                    <input
                      type="text"
                      value={referenceInput}
                      onChange={(e) => setReferenceInput(e.target.value)}
                      onPaste={handlePaste}
                      onKeyDown={handleKeyDown}
                      placeholder="Cole o link"
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

                  <div>
                    <label className="block text-xs uppercase tracking-[0.2em] text-gray-400 mb-2 font-medium">Pequena descrição do site</label>
                    <textarea
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      placeholder="Compartilhe as informações que achar que são relevantes sobre sua casa digital (site)"
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
                      Enviar
                    </button>
                  </div>
                </form>

                {/* Alternativa do WhatsApp Direto */}
                <div className="flex flex-col items-center justify-center pt-6 border-t border-white/5 space-y-3">
                  <span className="text-xs uppercase tracking-[0.3em] text-gray-500">ou</span>
                  <p className="text-sm text-gray-400 font-light">Me mande uma mensagem direto e vamos falar.</p>
                  
                  <a
                    href="https://wa.me/5511970741310?text=Ol%C3%A1!%20Gostaria%20de%20conversar%20sobre%20meu%20projeto."
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-8 py-4 rounded-full border border-emerald-500/20 bg-emerald-500/10 text-emerald-300 hover:bg-emerald-500/20 hover:border-emerald-500/40 transition-all duration-300 flex items-center gap-2 text-sm font-semibold hover:scale-105 active:scale-95 cursor-pointer shadow-lg"
                  >
                    <svg className="w-5 h-5 fill-current text-emerald-400" viewBox="0 0 24 24">
                      <path d="M12.012 2c-5.506 0-9.988 4.482-9.988 9.988 0 1.758.459 3.473 1.332 4.987l-1.356 4.954 5.074-1.33c1.458.795 3.09 1.217 4.75 1.217h.004c5.506 0 9.99-4.484 9.99-9.99 0-2.67-1.04-5.18-2.93-7.07-1.89-1.89-4.4-2.93-7.076-2.93zm5.836 14.195c-.24.675-1.18 1.312-1.63 1.373-.45.06-1.01.12-2.9-.62-2.42-.96-3.97-3.41-4.09-3.58-.12-.17-.99-1.31-.99-2.5 0-1.19.62-1.78.84-2.02.22-.24.49-.3.65-.3h.47c.15 0 .36-.06.56.42.2.49.69 1.68.75 1.8.06.12.1.27.02.43-.08.16-.12.26-.24.4-.12.14-.26.31-.37.42-.12.12-.25.25-.11.49.14.24.62 1.02 1.33 1.65.91.81 1.68 1.06 1.92 1.18.24.12.38.1.52-.06.14-.17.61-.71.77-.95.16-.24.32-.2.54-.12.22.08 1.4.66 1.64.78.24.12.4.18.46.28.06.1.06.57-.18 1.25z"/>
                    </svg>
                    Falar no WhatsApp
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
