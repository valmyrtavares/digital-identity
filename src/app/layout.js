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
  title: "Digital Identity | Creative Coding",
  description: "Pioneirismo em experiências digitais imersivas e 3D.",
};

import SmoothScroll from "@/components/SmoothScroll";
import { MenuProvider } from "@/context/MenuContext";
import Scene from "@/components/Scene";
import AudioVisualizer from "@/components/AudioVisualizer";

export default function RootLayout({ children }) {
  return (
    <html
      lang="pt-BR"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <body className="min-h-full flex flex-col bg-[#050505] text-white" suppressHydrationWarning>
        <MenuProvider>
          <Scene />
          <AudioVisualizer />
          <SmoothScroll>{children}</SmoothScroll>
        </MenuProvider>
      </body>
    </html>
  );
}
