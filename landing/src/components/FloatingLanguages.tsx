"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { playPop } from "@/lib/sound";

interface LanguageItem {
  id: string;
  name: string;
  icon: string;
  bg: string;
  textColor: string;
  top: string;
  left?: string;
  right?: string;
  rotation: number;
  speed: number;
  desktopOnly?: boolean;
}

const languages: LanguageItem[] = [
  { id: "react", name: "React", icon: "⚛️", bg: "#61DAFB", textColor: "text-black", top: "8%", left: "4%", rotation: 5, speed: 1.2 },
  { id: "nextjs", name: "Next.js", icon: "▲", bg: "#000000", textColor: "text-white", top: "10%", right: "4%", rotation: -6, speed: 0.9 },
  { id: "ts", name: "TypeScript", icon: "🔷", bg: "#3178C6", textColor: "text-white", top: "32%", left: "3%", rotation: 8, speed: 1.4 },
  { id: "vite", name: "Vite", icon: "⚡", bg: "#FFE600", textColor: "text-black", top: "36%", right: "3%", rotation: -10, speed: 1.1 },
  { id: "vue", name: "Vue.js", icon: "💚", bg: "#42B883", textColor: "text-black", top: "58%", left: "3%", rotation: -5, speed: 1.3 },
  { id: "python", name: "Python", icon: "🐍", bg: "#FFD43B", textColor: "text-black", top: "60%", right: "4%", rotation: 7, speed: 0.8 },
  { id: "tailwind", name: "Tailwind", icon: "🎨", bg: "#38BDF8", textColor: "text-black", top: "80%", left: "6%", rotation: -7, speed: 1.0, desktopOnly: true },
  { id: "html", name: "HTML5 / Web", icon: "🌐", bg: "#E34F26", textColor: "text-white", top: "82%", right: "6%", rotation: 10, speed: 1.5, desktopOnly: true },
  // Target Platforms Chips
  { id: "android", name: "Android APK", icon: "📱", bg: "#3DDC84", textColor: "text-black", top: "20%", left: "16%", rotation: 6, speed: 1.1, desktopOnly: true },
  { id: "windows", name: "Windows App", icon: "🪟", bg: "#00A4EF", textColor: "text-white", top: "22%", right: "16%", rotation: -6, speed: 0.8, desktopOnly: true },
  { id: "debian", name: "Debian (.deb)", icon: "🐧", bg: "#D70A53", textColor: "text-white", top: "74%", left: "16%", rotation: -9, speed: 1.3, desktopOnly: true },
  { id: "arch", name: "Arch Linux", icon: "🏹", bg: "#1793D1", textColor: "text-white", top: "72%", right: "16%", rotation: 12, speed: 1.0, desktopOnly: true },
];

interface FloatingLanguagesProps {
  mode: "wobble" | "orbit" | "chaos";
}

export default function FloatingLanguages({ mode }: FloatingLanguagesProps) {
  const [orbitAngle, setOrbitAngle] = useState(0);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    if (mode !== "orbit") return;
    const interval = setInterval(() => {
      setOrbitAngle((prev) => prev + 0.015);
    }, 25);
    return () => clearInterval(interval);
  }, [mode]);

  return (
    <div className="absolute inset-0 pointer-events-none z-10 overflow-hidden w-full max-w-full">
      {languages.map((lang, index) => {
        let x = 0;
        let y = 0;
        let rot = lang.rotation;

        if (mode === "orbit") {
          const total = languages.length;
          const angle = orbitAngle + (index * (2 * Math.PI / total));
          const rx = isMobile ? 120 : 320;
          const ry = isMobile ? 80 : 180;
          x = Math.cos(angle) * rx;
          y = Math.sin(angle) * ry;
          rot = Math.sin(angle) * 8;
        } else if (mode === "chaos") {
          const spread = isMobile ? 25 : 50;
          x = Math.sin(index * 3) * spread;
          y = Math.cos(index * 2) * spread;
          rot = lang.rotation * 1.2;
        }

        return (
          <motion.div
            key={lang.id}
            drag
            dragConstraints={{ left: -50, right: 50, top: -50, bottom: 50 }}
            whileHover={{ scale: 1.1, zIndex: 30 }}
            whileTap={{ scale: 0.95 }}
            onHoverStart={() => playPop()}
            style={{
              position: "absolute",
              top: lang.top,
              left: lang.left,
              right: lang.right,
            }}
            animate={
              mode === "orbit"
                ? { x, y, rotate: rot }
                : mode === "chaos"
                ? { x, y, rotate: rot }
                : {
                    y: [0, -(isMobile ? 8 : 14) * lang.speed, 0],
                    rotate: [lang.rotation, lang.rotation * -0.8, lang.rotation],
                  }
            }
            transition={
              mode === "orbit"
                ? { ease: "linear", duration: 0.05 }
                : mode === "chaos"
                ? { type: "spring", damping: 12 }
                : {
                    repeat: Infinity,
                    duration: 3.5 / lang.speed,
                    ease: "easeInOut",
                    delay: index * 0.15,
                  }
            }
            className={`pointer-events-auto cursor-grab active:cursor-grabbing select-none ${
              lang.desktopOnly ? "hidden sm:block" : "block"
            }`}
          >
            <div
              className={`px-2.5 sm:px-3.5 py-1 sm:py-1.5 border-2 sm:border-3 border-ink shadow-neo-xs sm:shadow-neo-sm hover:shadow-neo-md flex items-center gap-1.5 sm:gap-2 font-mono font-black text-[10px] sm:text-xs md:text-sm uppercase tracking-wider ${lang.textColor} transition-all`}
              style={{ backgroundColor: lang.bg }}
            >
              <span className="text-xs sm:text-base md:text-lg">{lang.icon}</span>
              <span className="whitespace-nowrap">{lang.name}</span>
            </div>
          </motion.div>
        );
      })}
    </div>
  );
}
