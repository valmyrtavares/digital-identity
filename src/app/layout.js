import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "VT Tech | Websites, aplicativos, sistemas de gestão e soluções sob medida",
  description: "Websites, aplicativos, sistemas de gestão e soluções sob medida design e estratégia para gerar resultados",
};

import SmoothScroll from "@/components/SmoothScroll";
import { MenuProvider } from "@/context/MenuContext";
import { LanguageProvider } from "@/context/LanguageContext";
import Scene from "@/components/Scene";
import AudioVisualizer from "@/components/AudioVisualizer";
import LanguageToggle from "@/components/LanguageToggle";

export default function RootLayout({ children }) {
  return (
    <html
      lang="pt-BR"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <body className="min-h-full flex flex-col bg-[#050505] text-white" suppressHydrationWarning>
        <LanguageProvider>
          <MenuProvider>
            <Scene />
            <AudioVisualizer />
            <LanguageToggle />
            <SmoothScroll>{children}</SmoothScroll>
          </MenuProvider>
        </LanguageProvider>
      </body>
    </html>
  );
}
