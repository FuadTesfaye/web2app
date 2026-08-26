"use client";

import React, { useState, useEffect } from "react";
import { motion, useAnimation } from "framer-motion";
import { playPop, playTone } from "../lib/sound";

interface LanguageItem {
  id: string;
  name: string;
  icon: string;
  bg: string;
  textColor: string;
  top: string;
  left?: string;
  right?: string;
  bottom?: string;
  rotation: number;
  speed: number;
}

const languages: LanguageItem[] = [
  { id: "react", name: "React", icon: "⚛️", bg: "#61DAFB", textColor: "text-black", top: "8%", left: "6%", rotation: 6, speed: 1.2 },
  { id: "nextjs", name: "Next.js", icon: "▲", bg: "#000000", textColor: "text-white", top: "14%", right: "8%", rotation: -8, speed: 0.9 },
  { id: "ts", name: "TypeScript", icon: "🔷", bg: "#3178C6", textColor: "text-white", top: "34%", left: "3%", rotation: 12, speed: 1.4 },
  { id: "vite", name: "Vite", icon: "⚡", bg: "#FFE600", textColor: "text-black", top: "40%", right: "5%", rotation: -14, speed: 1.1 },
  { id: "vue", name: "Vue.js", icon: "💚", bg: "#42B883", textColor: "text-black", top: "58%", left: "5%", rotation: -6, speed: 1.3 },
  { id: "python", name: "Python", icon: "🐍", bg: "#FFD43B", textColor: "text-black", top: "64%", right: "7%", rotation: 9, speed: 0.8 },
  { id: "tailwind", name: "Tailwind", icon: "🎨", bg: "#38BDF8", textColor: "text-black", top: "78%", left: "12%", rotation: -10, speed: 1.0 },
  { id: "html", name: "HTML5 / Web", icon: "🌐", bg: "#E34F26", textColor: "text-white", top: "82%", right: "12%", rotation: 14, speed: 1.5 },
  // Target Platforms Chips
  { id: "android", name: "Android APK", icon: "📱", bg: "#3DDC84", textColor: "text-black", top: "24%", left: "20%", rotation: 7, speed: 1.1 },
  { id: "windows", name: "Windows App", icon: "🪟", bg: "#00A4EF", textColor: "text-white", top: "26%", right: "20%", rotation: -7, speed: 0.8 },
  { id: "debian", name: "Debian (.deb)", icon: "🐧", bg: "#D70A53", textColor: "text-white", top: "70%", left: "22%", rotation: -11, speed: 1.3 },
  { id: "arch", name: "Arch Linux", icon: "🏹", bg: "#1793D1", textColor: "text-white", top: "68%", right: "22%", rotation: 15, speed: 1.0 },
];

interface FloatingLanguagesProps {
  mode: "wobble" | "orbit" | "chaos";
}

export default function FloatingLanguages({ mode }: FloatingLanguagesProps) {
  const [orbitAngle, setOrbitAngle] = useState(0);

  useEffect(() => {
    if (mode !== "orbit") return;
    const interval = setInterval(() => {
      setOrbitAngle((prev) => prev + 0.015);
    }, 25);
    return () => clearInterval(interval);
  }, [mode]);

  return (
    <div className="absolute inset-0 pointer-events-none z-10 overflow-hidden">
      {languages.map((lang, index) => {
        let x = 0;
        let y = 0;
        let rot = lang.rotation;

        if (mode === "orbit") {
          const total = languages.length;
          const angle = orbitAngle + (index * (2 * Math.PI / total));
          const rx = 340;
          const ry = 190;
          x = Math.cos(angle) * rx;
          y = Math.sin(angle) * ry;
          rot = Math.sin(angle) * 12;
        } else if (mode === "chaos") {
          x = Math.sin(index * 3) * 50;
          y = Math.cos(index * 2) * 50;
          rot = lang.rotation * 1.5;
        }

        return (
          <motion.div
            key={lang.id}
            drag
            dragConstraints={{ left: -100, right: 100, top: -100, bottom: 100 }}
            whileHover={{ scale: 1.15, zIndex: 30 }}
            whileTap={{ scale: 0.95 }}
            onHoverStart={() => playPop()}
            style={{
              position: "absolute",
              top: lang.top,
              left: lang.left,
              right: lang.right,
              bottom: lang.bottom,
            }}
            animate={
              mode === "orbit"
                ? { x, y, rotate: rot }
                : mode === "chaos"
                ? { x, y, rotate: rot }
                : {
                    y: [0, -14 * lang.speed, 0],
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
                    delay: index * 0.2,
                  }
            }
            className="pointer-events-auto cursor-grab active:cursor-grabbing select-none"
          >
            <div
              className={`px-3 sm:px-4 py-1 sm:py-1.5 rounded-xl border-3 border-ink shadow-neo-sm hover:shadow-neo-md flex items-center gap-2 font-mono font-extrabold text-xs sm:text-sm ${lang.textColor} transition-shadow`}
              style={{ backgroundColor: lang.bg }}
            >
              <span className="text-base sm:text-lg">{lang.icon}</span>
              <span>{lang.name}</span>
            </div>
          </motion.div>
        );
      })}
    </div>
  );
}
