/**
 * ⚡ WEB2APP NEOBRUTALISM LANDING PAGE ENGINE
 * Interactive controls, physics, retro sound synthesizer, and live conversion simulator
 */

document.addEventListener("DOMContentLoaded", () => {
  initSoundEngine();
  initThemeSwitcher();
  initFloatingPhysics();
  initConverterSimulator();
  initCliTabs();
  initFaqAccordion();
  initMobileMenu();
});

/* ==========================================================================
   1. RETRO WEB AUDIO SYNTHESIZER (Zero external sound files)
   ========================================================================== */
let audioCtx = null;
let soundEnabled = true;

function initSoundEngine() {
  const soundBtn = document.getElementById("soundToggleBtn");
  const soundIcon = document.getElementById("soundIcon");

  soundBtn?.addEventListener("click", () => {
    soundEnabled = !soundEnabled;
    soundIcon.textContent = soundEnabled ? "🔊" : "🔇";
    if (soundEnabled) {
      playTone(600, "triangle", 0.08);
    }
  });
}

function getAudioContext() {
  if (!audioCtx) {
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    if (AudioContext) audioCtx = new AudioContext();
  }
  if (audioCtx && audioCtx.state === "suspended") {
    audioCtx.resume();
  }
  return audioCtx;
}

function playTone(freq, type = "sine", duration = 0.1, gainValue = 0.08) {
  if (!soundEnabled) return;
  try {
    const ctx = getAudioContext();
    if (!ctx) return;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = type;
    osc.frequency.setValueAtTime(freq, ctx.currentTime);

    gain.gain.setValueAtTime(gainValue, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + duration);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start();
    osc.stop(ctx.currentTime + duration);
  } catch (e) {
    // Ignore audio context errors
  }
}

function playClickSound() {
  playTone(850, "triangle", 0.05, 0.05);
}

function playSuccessChime() {
  if (!soundEnabled) return;
  const notes = [523.25, 659.25, 783.99, 1046.5]; // C5, E5, G5, C6
  notes.forEach((note, index) => {
    setTimeout(() => {
      playTone(note, "square", 0.15, 0.06);
    }, index * 80);
  });
}

/* ==========================================================================
   2. THEME SWITCHER
   ========================================================================== */
function initThemeSwitcher() {
  const dropdownBtn = document.getElementById("themeDropdownBtn");
  const menu = document.getElementById("themeMenu");
  const options = document.querySelectorAll(".theme-option");
  const themeDot = document.getElementById("themeDot");
  const currentName = document.getElementById("currentThemeName");

  const themes = {
    "theme-default": { name: "Neo Retro", color: "#FFE600" },
    "theme-cyber": { name: "Cyber Neon", color: "#00F0FF" },
    "theme-bubblegum": { name: "Bubblegum", color: "#FF70A6" },
    "theme-dark": { name: "Dark Brutal", color: "#121212" },
    "theme-emerald": { name: "Emerald Matrix", color: "#80FF72" },
  };

  dropdownBtn?.addEventListener("click", (e) => {
    e.stopPropagation();
    menu?.classList.toggle("hidden");
    playClickSound();
  });

  document.addEventListener("click", () => {
    menu?.classList.add("hidden");
  });

  options.forEach((opt) => {
    opt.addEventListener("click", () => {
      const themeKey = opt.getAttribute("data-theme");
      if (!themeKey) return;

      document.documentElement.className = themeKey;
      if (themeDot) themeDot.style.backgroundColor = themes[themeKey]?.color || "#FFE600";
      if (currentName) currentName.textContent = themes[themeKey]?.name || "Neo Retro";

      playTone(440, "sine", 0.1);
      showToast(`Switched theme to: ${themes[themeKey]?.name}`);
    });
  });
}

/* ==========================================================================
   3. FLOATING LANGUAGES & FRAMEWORKS PHYSICS
   ========================================================================== */
function initFloatingPhysics() {
  const floatingArea = document.getElementById("floatingArea");
  const items = document.querySelectorAll(".floating-item");
  const wobbleBtn = document.getElementById("floatWobbleBtn");
  const orbitBtn = document.getElementById("floatOrbitBtn");
  const chaosBtn = document.getElementById("floatChaosBtn");

  let orbitAngle = 0;
  let orbitInterval = null;

  // Set individual starting rotations
  items.forEach((item) => {
    const rot = item.getAttribute("data-rotation") || "0";
    item.style.setProperty("--chip-rotation", `${rot}deg`);

    // Interactive mouse hover parallax / repulsion
    item.addEventListener("mouseenter", () => {
      playTone(550, "sine", 0.04, 0.03);
      item.style.transform = "scale(1.2) translateY(-6px)";
      item.style.zIndex = "30";
    });

    item.addEventListener("mouseleave", () => {
      item.style.transform = "";
      item.style.zIndex = "15";
    });

    // Click to wobble
    item.addEventListener("click", () => {
      playTone(700, "triangle", 0.15);
      item.classList.add("exploded");
      setTimeout(() => item.classList.remove("exploded"), 800);
    });
  });

  // Wobble Mode
  wobbleBtn?.addEventListener("click", () => {
    if (orbitInterval) clearInterval(orbitInterval);
    floatingArea?.classList.remove("mode-orbit");
    items.forEach((item, i) => {
      item.style.transform = "";
    });
    playTone(600, "sine", 0.08);
    showToast("Floating: Natural Wobble Mode Active");
  });

  // Orbit Mode
  orbitBtn?.addEventListener("click", () => {
    if (orbitInterval) clearInterval(orbitInterval);
    floatingArea?.classList.add("mode-orbit");

    orbitInterval = setInterval(() => {
      orbitAngle += 0.015;
      const count = items.length;
      items.forEach((item, index) => {
        const angle = orbitAngle + (index * (2 * Math.PI / count));
        const rx = 320;
        const ry = 180;
        const x = Math.cos(angle) * rx;
        const y = Math.sin(angle) * ry;
        item.style.transform = `translate(${x}px, ${y}px) rotate(${Math.sin(angle) * 10}deg)`;
      });
    }, 25);

    playTone(750, "sine", 0.08);
    showToast("Floating: Orbiting Galaxy Mode Active");
  });

  // Float Chaos Drift Mode
  chaosBtn?.addEventListener("click", () => {
    if (orbitInterval) clearInterval(orbitInterval);
    floatingArea?.classList.remove("mode-orbit");

    items.forEach((item) => {
      const rx = (Math.random() - 0.5) * 80;
      const ry = (Math.random() - 0.5) * 80;
      const rRot = (Math.random() - 0.5) * 30;
      item.style.transform = `translate(${rx}px, ${ry}px) rotate(${rRot}deg)`;
    });

    playTone(900, "triangle", 0.1);
    showToast("Floating: Chaos Drift Mode Active");
  });
}

/* ==========================================================================
   4. INTERACTIVE LIVE WEB2APP CONVERTER SIMULATOR
   ========================================================================== */
function initConverterSimulator() {
  const urlInput = document.getElementById("urlInput");
  const appNameInput = document.getElementById("appNameInput");
  const pkgNameInput = document.getElementById("pkgNameInput");
  const presetBtns = document.querySelectorAll(".preset-btn");
  const startBtn = document.getElementById("startConvertBtn");
  const convertBtnText = document.getElementById("convertBtnText");
  const convertBtnIcon = document.getElementById("convertBtnIcon");
  const terminalBody = document.getElementById("terminalBody");
  const statusBadge = document.getElementById("terminalStatusBadge");
  const debMockName = document.getElementById("debMockName");
  const downloadBtns = document.querySelectorAll(".download-mock-btn");

  let isConverting = false;

  // Preset Clicks
  presetBtns.forEach((btn) => {
    btn.addEventListener("click", () => {
      const url = btn.getAttribute("data-url");
      const name = btn.getAttribute("data-name");
      const pkg = btn.getAttribute("data-pkg");

      if (urlInput && url) urlInput.value = url;
      if (appNameInput && name) appNameInput.value = name;
      if (pkgNameInput && pkg) pkgNameInput.value = pkg;
      if (debMockName && pkg) debMockName.textContent = `${pkg}_1.0.0`;

      playClickSound();
      showToast(`Selected preset: ${name}`);
    });
  });

  // URL input auto-derives app and package name if manually typed
  urlInput?.addEventListener("input", (e) => {
    const val = e.target.value;
    try {
      if (val.startsWith("http://") || val.startsWith("https://")) {
        const u = new URL(val);
        const host = u.hostname.replace(/^www\./, "");
        const parts = host.split(".");
        const derivedName = parts[0].charAt(0).toUpperCase() + parts[0].slice(1);
        if (appNameInput) appNameInput.value = derivedName;
        if (pkgNameInput) pkgNameInput.value = `com.${parts[0]}.${parts[1] || "app"}`;
        if (debMockName) debMockName.textContent = `com.${parts[0]}.${parts[1] || "app"}_1.0.0`;
      }
    } catch {}
  });

  // Start Conversion Pipeline Simulation
  startBtn?.addEventListener("click", async () => {
    if (isConverting) return;
    isConverting = true;

    const url = urlInput?.value || "https://news.ycombinator.com";
    const appName = appNameInput?.value || "My Application";
    const pkgName = pkgNameInput?.value || "com.company.app";

    if (startBtn) startBtn.disabled = true;
    if (convertBtnText) convertBtnText.textContent = "Compiling Apps...";
    if (convertBtnIcon) convertBtnIcon.textContent = "⏳";
    if (statusBadge) {
      statusBadge.textContent = "BUILDING";
      statusBadge.className = "bg-accent-yellow text-ink font-bold px-1.5 py-0.5 rounded text-[10px]";
    }

    playTone(440, "square", 0.08);

    // Clear Terminal & Log Start
    if (terminalBody) {
      terminalBody.innerHTML = `
        <div class="text-gray-400">$ web2app ${url}</div>
        <div class="text-[#FFE600]">⚡ web2app v0.1.0 — Initializing multi-platform compilation</div>
        <div class="text-gray-300">ℹ Target URL:   🌐 ${url}</div>
        <div class="text-gray-300">ℹ Application:  ${appName} (${pkgName})</div>
        <div class="text-gray-300">ℹ Output Root:  ./app/</div>
        <div class="my-2 border-b border-gray-700"></div>
      `;
    }

    const steps = [
      {
        text: `[1/5] 🌐 Analyzing web manifest & live page assets...`,
        color: "text-[#70D6FF]",
        freq: 500,
        delay: 400,
      },
      {
        text: `[2/5] 📱 Generating Android Kotlin native wrapper in app/android...`,
        color: "text-[#80FF72]",
        freq: 600,
        delay: 500,
      },
      {
        text: `      ✔ Configured AndroidManifest.xml, MainActivity.kt, Gradle wrapper`,
        color: "text-gray-400",
        freq: 650,
        delay: 350,
      },
      {
        text: `[3/5] 🪟 Scaffolding Windows Desktop app in app/windows...`,
        color: "text-[#00A4EF]",
        freq: 700,
        delay: 450,
      },
      {
        text: `      ✔ Generated launch.bat, launch.ps1, start.vbs, install shortcuts`,
        color: "text-gray-400",
        freq: 750,
        delay: 300,
      },
      {
        text: `[4/5] 🐧 Compiling Debian binary package (Pure TypeScript DebPackager)...`,
        color: "text-[#FF70A6]",
        freq: 800,
        delay: 500,
      },
      {
        text: `      ✔ Built app/debian/${pkgName}_1.0.0_all.deb + .desktop launcher`,
        color: "text-gray-400",
        freq: 850,
        delay: 300,
      },
      {
        text: `[5/5] 🏹 Assembling Arch Linux package in app/arch...`,
        color: "text-[#C084FC]",
        freq: 900,
        delay: 400,
      },
      {
        text: `      ✔ Generated PKGBUILD, .SRCINFO, install.sh`,
        color: "text-gray-400",
        freq: 950,
        delay: 300,
      },
      {
        text: `🎉 BUILD SUCCESSFUL! All 4 native packages ready inside ./app/ (1.4s)`,
        color: "text-[#FFE600] font-bold text-sm",
        freq: 1046,
        delay: 400,
      },
    ];

    for (const step of steps) {
      await new Promise((r) => setTimeout(r, step.delay));
      playTone(step.freq, "triangle", 0.06);

      if (terminalBody) {
        const line = document.createElement("div");
        line.className = step.color;
        line.textContent = step.text;
        terminalBody.appendChild(line);
        terminalBody.scrollTop = terminalBody.scrollHeight;
      }
    }

    playSuccessChime();

    if (startBtn) startBtn.disabled = false;
    if (convertBtnText) convertBtnText.textContent = "Convert Again ⚡";
    if (convertBtnIcon) convertBtnIcon.textContent = "✔";
    if (statusBadge) {
      statusBadge.textContent = "COMPLETED";
      statusBadge.className = "bg-accent-green text-ink font-bold px-1.5 py-0.5 rounded text-[10px]";
    }

    isConverting = false;
    showToast("🎉 Build Finished! All packages created in app/");
  });

  // Mock Package Download Buttons
  downloadBtns.forEach((btn) => {
    btn.addEventListener("click", () => {
      const target = btn.getAttribute("data-target");
      playClickSound();
      showToast(`Inspecting simulated app/${target} package!`);
    });
  });
}

/* ==========================================================================
   5. CLI PACKAGE MANAGER TABS & CLIPBOARD
   ========================================================================== */
function initCliTabs() {
  const tabs = document.querySelectorAll(".cli-tab");
  const codeElem = document.getElementById("cliSnippetCode");
  const copyBtn = document.getElementById("copyCliBtn");
  const copyText = document.getElementById("copyText");
  const copyIcon = document.getElementById("copyIcon");

  const commands = {
    npx: "npx web2app https://your-website.com",
    npm: "npm install -g web2app && web2app build",
    pnpm: "pnpm dlx web2app https://your-website.com",
    bun: "bunx web2app https://your-website.com",
  };

  tabs.forEach((tab) => {
    tab.addEventListener("click", () => {
      const pm = tab.getAttribute("data-pm") || "npx";
      tabs.forEach((t) => {
        t.className = "cli-tab px-3 py-1.5 bg-surface hover:bg-accent-yellow/40 border-2 border-transparent hover:border-ink rounded-lg";
      });
      tab.className = "cli-tab active px-3 py-1.5 bg-accent-yellow border-2 border-ink rounded-lg shadow-neo-xs font-bold";

      if (codeElem) codeElem.textContent = commands[pm] || commands.npx;
      playClickSound();
    });
  });

  copyBtn?.addEventListener("click", async () => {
    const textToCopy = codeElem?.textContent?.trim() || "npx web2app";
    try {
      await navigator.clipboard.writeText(textToCopy);
      if (copyText) copyText.textContent = "Copied! ✔";
      if (copyIcon) copyIcon.textContent = "✨";
      playTone(880, "sine", 0.1);
      showToast("📋 Command copied to clipboard!");

      setTimeout(() => {
        if (copyText) copyText.textContent = "Copy";
        if (copyIcon) copyIcon.textContent = "📋";
      }, 2000);
    } catch {
      showToast("Failed to copy command");
    }
  });
}

/* ==========================================================================
   6. FAQ ACCORDION
   ========================================================================== */
function initFaqAccordion() {
  const items = document.querySelectorAll(".faq-item");

  items.forEach((item) => {
    const btn = item.querySelector(".faq-question");
    const answer = item.querySelector(".faq-answer");
    const icon = item.querySelector(".faq-icon");

    btn?.addEventListener("click", () => {
      const isOpen = !answer?.classList.contains("hidden");

      // Close all other items
      items.forEach((other) => {
        other.querySelector(".faq-answer")?.classList.add("hidden");
        const otherIcon = other.querySelector(".faq-icon");
        if (otherIcon) otherIcon.textContent = "+";
      });

      if (!isOpen) {
        answer?.classList.remove("hidden");
        if (icon) icon.textContent = "−";
        playTone(520, "sine", 0.06);
      } else {
        answer?.classList.add("hidden");
        if (icon) icon.textContent = "+";
        playTone(400, "sine", 0.05);
      }
    });
  });
}

/* ==========================================================================
   7. MOBILE NAVIGATION MENU
   ========================================================================== */
function initMobileMenu() {
  const mobileBtn = document.getElementById("mobileMenuBtn");
  const mobileMenu = document.getElementById("mobileMenu");

  mobileBtn?.addEventListener("click", () => {
    mobileMenu?.classList.toggle("hidden");
    playClickSound();
  });

  mobileMenu?.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => {
      mobileMenu.classList.add("hidden");
    });
  });
}

/* ==========================================================================
   8. TOAST NOTIFICATION UTILITY
   ========================================================================== */
let toastTimeout = null;

function showToast(message) {
  let toast = document.getElementById("neoToast");
  if (!toast) {
    toast = document.createElement("div");
    toast.id = "neoToast";
    toast.className = "toast-neo";
    document.body.appendChild(toast);
  }

  toast.textContent = message;
  toast.classList.add("show");

  if (toastTimeout) clearTimeout(toastTimeout);
  toastTimeout = setTimeout(() => {
    toast.classList.remove("show");
  }, 2500);
}
