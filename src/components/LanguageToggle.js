"use client";

import { useLanguage } from '@/context/LanguageContext';

export default function LanguageToggle() {
  const { language, toggleLanguage } = useLanguage();

  return (
    <button
      onClick={toggleLanguage}
      className="fixed top-8 left-8 z-[70] font-light text-sm uppercase tracking-[0.2em] text-white hover:text-indigo-300 transition-colors duration-300 cursor-pointer pointer-events-auto"
      title={language === 'pt' ? 'Switch to English' : 'Mudar para Português'}
    >
      {language === 'pt' ? 'English' : 'Português'}
    </button>
  );
}
