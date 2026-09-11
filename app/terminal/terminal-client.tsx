'use client';

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Terminal as TerminalIcon, Home, Zap, Loader2, ArrowLeft } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { Navbar } from '@/components/navbar';
import { getFallbackGhostResponse } from '@/lib/ai-fallback';

import referralsData from '@/data/referrals.json';
import payData from '@/data/pay.json';
import transparencyData from '@/data/transparency.json';
import { useWideLayout } from '@/hooks/use-wide-layout';
import { generateSystemStats } from '@/lib/data-hub';
import { soundEngine } from '@/lib/audio';
import { gameEngine } from '@/lib/game-engine';

export default function TerminalClient({ locale = 'en' }: { locale?: 'en' | 'id' }) {
  useWideLayout('lg');
  const homeHref = locale === 'id' ? '/id/' : '/';
  const workHref = locale === 'id' ? '/id/work/' : '/work/';
  const projectsHref = locale === 'id' ? '/id/projects/' : '/projects/';
  const dataLakeHref = locale === 'id' ? '/id/data-lake/' : '/data-lake/';

  const [input, setInput] = useState('');
  const [questStage, setQuestStage] = useState<number>(0);
  const [history, setHistory] = useState<string[]>(
    locale === 'id' ? [
      "PORTFOLIO_OS V2.1.0 (September 2026)",
      "AUTENTIKASI: BERHASIL (SEBAGAI GUEST)",
      "MENGINISIASI PROTOKOL NEURAL_GHOST...",
      "KETIK 'HELP' UNTUK DAFTAR PERINTAH ATAU 'QUEST' UNTUK MAINFRAME DIAGNOSTIC",
      " "
    ] : [
      "PORTFOLIO_OS V2.1.0 (September 2026)",
      "AUTHENTICATION: SUCCESS (AS GUEST)",
      "INITIALIZING NEURAL_GHOST PROTOCOL...",
      "TYPE 'HELP' FOR LIST OF COMMANDS OR 'QUEST' FOR MAINFRAME DIAGNOSTIC",
      " "
    ]
  );

  const [isProcessing, setIsProcessing] = useState(false);
  const [cmdHistory, setCmdHistory] = useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const [theme, setTheme] = useState<'cyan' | 'matrix' | 'amber' | 'cobalt'>('cyan');
  const [ghostMode, setGhostMode] = useState(false);
  const [ghostStatus, setGhostStatus] = useState<'LIVE' | 'LOCAL' | null>(null);

  const [activeSimulation, setActiveSimulation] = useState<'pipeline' | null>(null);
  const [simFrame, setSimFrame] = useState(0);
  const [simTelemetry, setSimTelemetry] = useState({
    ingestRate: 0,
    processedCount: 0,
    errorCount: 0,
    bufferFill: 0,
    elapsed: 0
  });
  const [simLogs, setSimLogs] = useState<string[]>([]);

  const simTelemetryRef = useRef({
    ingestRate: 0,
    processedCount: 0,
    errorCount: 0,
    bufferFill: 0,
    elapsed: 0
  });
  const simLogsEndRef = useRef<HTMLDivElement>(null);

  const inputRef = useRef<HTMLInputElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  const themeStyles = {
    cyan: {
      bg: 'bg-[#09090b]',
      border: 'border-border-subtle',
      text: 'text-[#71717a]',
      accentText: 'text-[#00e1cf]',
      accentBorder: 'border-[#00e1cf]/20 hover:border-[#00e1cf]/40',
      accentSel: 'selection:bg-[#00e1cf]/20 selection:text-[#00e1cf]',
      accentBg: 'bg-[#00e1cf]/5',
      glow: 'shadow-2xl',
      dot: 'bg-[#00e1cf]',
    },
    matrix: {
      bg: 'bg-[#020502]',
      border: 'border-[#00ff41]/20',
      text: 'text-[#00ff41]/60',
      accentText: 'text-[#00ff41]',
      accentBorder: 'border-[#00ff41]/20 hover:border-[#00ff41]/40',
      accentSel: 'selection:bg-[#00ff41]/20 selection:text-[#00ff41]',
      accentBg: 'bg-[#00ff41]/5',
      glow: 'shadow-[0_0_30px_rgba(0,255,65,0.1)]',
      dot: 'bg-[#00ff41]',
    },
    amber: {
      bg: 'bg-[#0c0800]',
      border: 'border-[#ffb000]/20',
      text: 'text-[#ffb000]/60',
      accentText: 'text-[#ffb000]',
      accentBorder: 'border-[#ffb000]/20 hover:border-[#ffb000]/40',
      accentSel: 'selection:bg-[#ffb000]/20 selection:text-[#ffb000]',
      accentBg: 'bg-[#ffb000]/5',
      glow: 'shadow-[0_0_30px_rgba(255,176,0,0.1)]',
      dot: 'bg-[#ffb000]',
    },
    cobalt: {
      bg: 'bg-[#030a16]',
      border: 'border-[#38bdf8]/20',
      text: 'text-[#38bdf8]/60',
      accentText: 'text-[#38bdf8]',
      accentBorder: 'border-[#38bdf8]/20 hover:border-[#38bdf8]/40',
      accentSel: 'selection:bg-[#38bdf8]/20 selection:text-[#38bdf8]',
      accentBg: 'bg-[#38bdf8]/5',
      glow: 'shadow-[0_0_30px_rgba(56,189,248,0.1)]',
      dot: 'bg-[#38bdf8]',
    }
  }[theme];

  const handleCommand = async (e: React.FormEvent) => {
    e.preventDefault();
    const cmd = input.trim().toLowerCase();
    if (!cmd) return;

    soundEngine.playClick(900);
    const currentInput = input;
    setInput('');
    setHistory(prev => [...prev, `${ghostMode ? 'ghost@neural' : 'ichsanul@portfolio'} ~ $ ${currentInput}`]);
    setCmdHistory(prev => [...prev, currentInput]);
    setHistoryIndex(-1);


    // If ghostMode is active, send all input to the AI endpoint (except exit/quit commands)
    if (ghostMode) {
      if (cmd === 'exit' || cmd === 'quit') {
        setGhostMode(false);
        setHistory(prev => [...prev, "TERMINATING LINK. RETURNING TO STANDARD SHELL.", " "]);
        return;
      }
      setIsProcessing(true);
      setHistory(prev => [...prev, "ROUTING TELEMETRY TO COGNITIVE CORE...", " "]);
      try {
        const res = await fetch('/api/ghost', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ query: currentInput })
        });
        if (!res.ok) throw new Error("API Route unreachable");
        const data = await res.json();
        setGhostStatus('LIVE');
        setHistory(prev => [...prev, `GHOST: ${data.response}`, " "]);
      } catch {
        setGhostStatus('LOCAL');
        const fallback = getFallbackGhostResponse(currentInput);
        setHistory(prev => [...prev, `GHOST: ${fallback}`, " "]);
      } finally {
        setIsProcessing(false);
      }
      return;
    }

    if (cmd === 'pipeline' || cmd === 'monitor') {
      setActiveSimulation('pipeline');
      return;
    }

    if (cmd === 'clear') {
      setHistory([]);
      return;
    }

    // Enter interactive Neural Ghost chat mode
    if (cmd === 'ghost') {
      setGhostMode(true);
      setHistory(prev => [
        ...prev, 
        "NEURAL_LINK_ESTABLISHED. ENTERING DIRECT COGNITIVE LINK.",
        "TYPE 'exit' or 'quit' TO RETURN TO STANDARD TERMINAL.",
        " "
      ]);
      return;
    }

    // Support inline ghost commands: e.g. "ghost who are you?"
    if (cmd.startsWith('ghost ')) {
      const query = currentInput.substring(6).trim();
      if (!query) {
        setHistory(prev => [...prev, "Usage: ghost <query_or_question>", " "]);
        return;
      }
      setIsProcessing(true);
      setHistory(prev => [...prev, "COMMUNICATING WITH NEURAL_GHOST...", " "]);
      try {
        const res = await fetch('/api/ghost', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ query })
        });
        if (!res.ok) throw new Error("API Route unreachable");
        const data = await res.json();
        setGhostStatus('LIVE');
        setHistory(prev => [...prev, `GHOST: ${data.response}`, " "]);
      } catch {
        setGhostStatus('LOCAL');
        const fallback = getFallbackGhostResponse(query);
        setHistory(prev => [...prev, `GHOST: ${fallback}`, " "]);
      } finally {
        setIsProcessing(false);
      }
      return;
    }

    let response: string[] = [];

    // File structure checks
    if (cmd === 'ls') {
      response = [
        "Volume in drive C is PORTFOLIO_SYS",
        "Directory of ichsanul@portfolio",
        " ",
        "05/17/2026  12:00 PM    <DIR>          .",
        "05/17/2026  12:00 PM    <DIR>          ..",
        "05/17/2026  02:54 PM               412 bio.txt",
        "05/17/2026  02:54 PM             2,409 achievements.md",
        "05/17/2026  02:54 PM            14,024 system_logs.log",
        "               3 File(s)         16,845 bytes"
      ];
    } else if (cmd.startsWith('cat')) {
      const parts = cmd.split(' ');
      const filename = parts[1];
      if (filename === 'bio.txt') {
        response = [
          "File: bio.txt",
          "==================================================",
          "Name: Ichsanul Amal",
          "Role: Data Engineer / System Architect",
          "Motto: Invisible Reliability. I build clean,",
          "       scalable ETL nervous systems so the business",
          "       never has to think about the data foundations.",
          "=================================================="
        ];
      } else if (filename === 'achievements.md') {
        response = [
          "File: achievements.md",
          "==================================================",
          "- Top Technology Winner, Tokopedia Devcamp Hackathon",
          "- Automated 4,000+ configuration migrations @ Accenture",
          "- Spearheaded dbt implementation for modular data flows",
          "=================================================="
        ];
      } else if (filename === 'system_logs.log') {
        response = [
          "File: system_logs.log",
          "==================================================",
          "[2026-05-17 14:54:35] INGEST_RATE: 90,580 msg/s",
          "[2026-05-17 14:54:36] TELEMETRY_PING: OK (14ms latency)",
          "[2026-05-17 14:54:37] KERNEL_STATUS: STABLE",
          "[2026-05-17 14:54:38] NEURAL_LINK: CONTEXT_SYNCED",
          "=================================================="
        ];
      } else {
        response = [
          "Usage: cat <filename>",
          "Available files: bio.txt, achievements.md, system_logs.log"
        ];
      }
    } else if (cmd.startsWith('biome')) {
      const parts = cmd.split(' ');
      const targetBiome = parts[1]?.toLowerCase();
      const validBiomes = ['cyber', 'oled', 'terminal', 'ocean', 'forest', 'quantum', 'nebula'];
      if (!targetBiome) {
        let activeBiome = 'cyber';
        if (typeof document !== 'undefined') {
          for (const b of validBiomes) {
            if (document.documentElement.classList.contains(`biome-${b}`)) {
              activeBiome = b;
              break;
            }
          }
        }
        response = [
          "CURRENT_BIOME: " + activeBiome.toUpperCase(),
          "AVAILABLE_BIOMES: " + validBiomes.map(b => b.toUpperCase()).join(', '),
          "USAGE: biome <biome_name>"
        ];
      } else if (validBiomes.includes(targetBiome)) {
        if (typeof window !== 'undefined') {
          document.documentElement.classList.remove(...validBiomes.map(b => `biome-${b}`));
          document.documentElement.classList.add(`biome-${targetBiome}`);
          localStorage.setItem('selected-biome', targetBiome);
          window.dispatchEvent(new CustomEvent('selected-biome-change', { detail: targetBiome }));
        }
        response = [
          `ENVIRONMENT BIOME OVERRIDDEN TO ${targetBiome.toUpperCase()}`,
          "SYNCHRONIZING SYSTEM WIDGETS... SUCCESS"
        ];
      } else {
        response = [
          `UNKNOWN_BIOME: ${targetBiome}`,
          "AVAILABLE_BIOMES: " + validBiomes.map(b => b.toUpperCase()).join(', ')
        ];
      }
    } else if (cmd.startsWith('audio') || cmd.startsWith('sound')) {
      const parts = cmd.split(' ');
      const action = parts[1]?.toLowerCase();
      if (!action || action === 'toggle') {
        const active = gameEngine.toggleAudio();
        response = [
          `AUDIO SOUNDSCAPE: ${active ? 'ENGAGED [ACTIVE]' : 'MUTED [IDLE]'}`,
          "AUDIO HARMONICS CONFIGURED."
        ];
      } else if (action === 'on') {
        if (soundEngine.getIsMuted()) gameEngine.toggleAudio();
        response = ["AUDIO SOUNDSCAPE: ENGAGED [ACTIVE]"];
      } else if (action === 'off') {
        if (!soundEngine.getIsMuted()) gameEngine.toggleAudio();
        response = ["AUDIO SOUNDSCAPE: MUTED [IDLE]"];
      } else if (action === 'status') {
        response = [`AUDIO STATUS: ${!soundEngine.getIsMuted() ? 'ACTIVE' : 'MUTED'}`];
      } else {
        response = ["USAGE: audio <on|off|toggle|status>"];
      }
    } else if (cmd.startsWith('lockdown')) {
      const parts = cmd.split(' ');
      const action = parts[1]?.toLowerCase();
      const isCurrentlyActive = typeof document !== 'undefined' && document.body.classList.contains('sensory-lockdown');
      if (!action || action === 'toggle') {
        window.dispatchEvent(new CustomEvent('toggle-sensory-lockdown'));
        response = [
          `SENSORY LOCKDOWN: ${!isCurrentlyActive ? 'ACTIVATED (Noise & FX suppressed)' : 'DISENGAGED (Visuals restored)'}`
        ];
      } else if (action === 'on') {
        if (!isCurrentlyActive) window.dispatchEvent(new CustomEvent('toggle-sensory-lockdown'));
        response = ["SENSORY LOCKDOWN: ACTIVATED (Noise & FX suppressed)"];
      } else if (action === 'off') {
        if (isCurrentlyActive) window.dispatchEvent(new CustomEvent('toggle-sensory-lockdown'));
        response = ["SENSORY LOCKDOWN: DISENGAGED (Visuals restored)"];
      } else if (action === 'status') {
        response = [`SENSORY LOCKDOWN STATUS: ${isCurrentlyActive ? 'ACTIVE' : 'IDLE'}`];
      } else {
        response = ["USAGE: lockdown <on|off|toggle|status>"];
      }
    } else if (cmd.startsWith('theme')) {
      const parts = cmd.split(' ');
      const targetTheme = parts[1];
      if (!targetTheme) {
        response = [
          "CURRENT_TERMINAL_THEME: " + theme.toUpperCase(),
          "AVAILABLE_TERMINAL_THEMES: CYAN, MATRIX, AMBER, COBALT",
          "USAGE: theme <theme_name>",
          " ",
          "INFO: To change the global site environment biome, use the 'biome' command.",
          "USAGE: biome <cyber|ocean|forest>"
        ];
      } else if (['cyan', 'matrix', 'amber', 'cobalt'].includes(targetTheme)) {
        setTheme(targetTheme as any);
        response = [
          `THEME CHANGED TO ${targetTheme.toUpperCase()}`,
          "RECONFIGURING TERMINAL INTERFACE... OK"
        ];
      } else {
        response = [
          `UNKNOWN_THEME: ${targetTheme}`,
          "AVAILABLE_THEMES: CYAN, MATRIX, AMBER, COBALT"
        ];
      }
    } else if (cmd.startsWith('solve')) {
      const answer = cmd.replace('solve', '').trim().toLowerCase();
      if (questStage === 1 && (answer.includes('partition') || answer.includes('date') || answer === '1')) {
        soundEngine.playChime(880);
        setQuestStage(2);
        response = [
          "✅ LEVEL 1 PASSED! SQL Partition Pruning Enabled (Latency reduced 4200ms -> 8ms).",
          " ",
          "============================================================",
          "[LEVEL 2 OF 3: CORRUPTED LOG PARSER]",
          "============================================================",
          "LOG CHUNK: [2026-07-21 14:02:11] status=CRITICAL_OOM_ALERT payload=0x99 checksum=FAIL",
          "TASK: Extract the exact failure status string. Type 'solve CRITICAL_OOM_ALERT'."
        ];
      } else if (questStage === 2 && (answer.includes('critical') || answer.includes('oom') || answer === '2')) {
        soundEngine.playChime(1046);
        setQuestStage(3);
        response = [
          "✅ LEVEL 2 PASSED! Corrupted log stream isolated & pushed to DLQ.",
          " ",
          "============================================================",
          "[LEVEL 3 OF 3: KAFKA PARTITION SKEW REBALANCE]",
          "============================================================",
          "SCENARIO: Hot partition bottlenecking cluster (Partition 0 has 90% load).",
          "TASK: Apply uniform key hashing strategy. Type 'solve murmur3' (or 'solve hash')."
        ];
      } else if (questStage === 3 && (answer.includes('murmur') || answer.includes('hash') || answer === '3')) {
        soundEngine.playModemHandshake();
        setQuestStage(4);
        setTheme('matrix');
        response = [
          "🏆 CONGRATULATIONS! ALL MAINFRAME DIAGNOSTICS CLEARED!",
          "============================================================",
          "CLEARANCE GRANTED: CLASS_5_SYSTEM_ADMIN",
          "REWARD: Matrix Override Theme Unlocked!",
          "TYPE 'VAULT' TO ACCESS SECRET ARCHITECTURE FILES.",
          "============================================================"
        ];
      } else {
        soundEngine.playClick(300);
        response = [
          "❌ DIAGNOSTIC TEST FAILED: Incorrect answer or no active quest level.",
          "TYPE 'QUEST' TO REVIEW CURRENT LEVEL INSTRUCTIONS."
        ];
      }
    } else {

      switch(cmd) {
        case 'help':
          response = locale === 'id' ? [
            "PERINTAH_YANG_TERSEDIA:",
            "  EXIT / QUIT   - KELUAR DARI TERMINAL DAN KEMBALI KE BERANDA",
            "  HOME / BACK   - KEMBALI KE BERANDA (HQ)",
            "  WORK          - NAVIGASI KE ARSIP KARIR",
            "  PROJECTS      - LIHAT ARSIP ENGINEERING",
            "  DATA-LAKE     - BUKA WORKBENCH SQL DATA LAKE",
            "  GARDEN        - BUKA KEBUN DIGITAL",
            "  QUEST         - MULAI QUIZ DIAGNOSTIK MAINFRAME (3 LEVEL)",
            "  SOLVE <ans>   - SELESAIKAN SOAL QUEST AKTIF",
            "  VAULT         - RAHASIA ARSITEKTUR (PERLU CLEARANCE CLASS 5)",
            "  GHOST         - KONSULTASI DENGAN AI KECERDASAN PROYEK",
            "  HACK          - INISIASI PROTOKOL PENETRASI CEPAT",
            "  CLEAR         - BERSIHKAN BUFFER KONSOL",
            "  NEOFETCH      - IKHTISAR SISTEM",
            "  WHOAMI        - TAMPILKAN PROFIL USER AKTIF",
            "  SKILLS        - DAFTAR MODUL YANG DIMUAT",
            "  LS            - TAMPILKAN DIREKTORI VIRTUAL",
            "  CAT <file>    - TAMPILKAN ISI FILE VIRTUAL",
            "  THEME <name>  - UBAH TEMA TERMINAL (CYAN, MATRIX, AMBER, COBALT)",
            "  BIOME <name>  - UBAH BIOMA ENVIRONMENT SITE (CYBER, OLED, TERMINAL, OCEAN, FOREST, QUANTUM, NEBULA)",
            "  AUDIO <cmd>   - KONTROL SOUNDSCAPE AUDIO (ON, OFF, TOGGLE, STATUS)",
            "  LOCKDOWN <cmd>- KONTROL SENSORY LOCKDOWN (ON, OFF, TOGGLE, STATUS)",
            "  STATUS        - LAPORAN DIAGNOSTIK LIVE MONITOR SISTEM",
            "  REFERRALS     - DAFTAR GERBANG INGESTI EKSTERNAL",
            "  PAY           - DAFTAR AKUN PEMBAYARAN DAN TRANSFER SECURE",
            "  TRANSPARENCY  - RADAR TRANSPARANSI FINANSIAL & ALLOKASI BARBELL",
            "  PIPELINE      - LIVE SIMULATOR PIPELINE DATA"
          ] : [
            "AVAILABLE_COMMANDS:",
            "  EXIT / QUIT   - EXIT TERMINAL & RETURN TO HQ",
            "  HOME / BACK   - RETURN TO HQ",
            "  WORK          - NAVIGATE TO CAREER ARCHIVE",
            "  PROJECTS      - VIEW ENGINEERING ARCHIVE",
            "  DATA-LAKE     - OPEN DATA LAKE SQL WORKBENCH",
            "  GARDEN        - OPEN DIGITAL GARDEN",
            "  QUEST         - START MAINFRAME DIAGNOSTIC QUEST (3 STAGES)",
            "  SOLVE <ans>   - SUBMIT ANSWER FOR ACTIVE QUEST LEVEL",
            "  VAULT         - SECRET ARCHITECTURE FILE (REQUIRES CLASS 5 CLEARANCE)",
            "  GHOST         - CHAT WITH THE PROJECT INTELLIGENCE",
            "  HACK          - INITIALIZE RAPID PENETRATION PROTOCOL",
            "  CLEAR         - WIPE BUFFER",
            "  NEOFETCH      - SYSTEM OVERVIEW",
            "  WHOAMI        - PRINT CURRENT USER PROFILE",
            "  SKILLS        - LIST LOADED MODULES",
            "  LS            - LIST VIRTUAL DIRECTORY CONTENT",
            "  CAT <file>    - DISPLAY CONTENT OF A VIRTUAL FILE",
            "  THEME <name>  - CHANGE TERMINAL STYLE (CYAN, MATRIX, AMBER, COBALT)",
            "  BIOME <name>  - CHANGE GLOBAL ENVIRONMENT BIOME (CYBER, OLED, TERMINAL, OCEAN, FOREST, QUANTUM, NEBULA)",
            "  AUDIO <cmd>   - CONTROL AUDIO SOUNDSCAPE (ON, OFF, TOGGLE, STATUS)",
            "  LOCKDOWN <cmd>- CONTROL SENSORY LOCKDOWN (ON, OFF, TOGGLE, STATUS)",
            "  STATUS        - PRINT LIVE SYSTEM MONITOR DIAGNOSTIC REPORT",
            "  REFERRALS     - LIST EXTERNAL INGESTION GATEWAYS",
            "  PAY           - LIST SECURE PAYMENT AND TRANSFER NODES",
            "  TRANSPARENCY  - VERIFIABLE SOVEREIGN RUNWAY & BARBELL ALLOCATION",
            "  PIPELINE      - LIVE DATA PIPELINE SIMULATOR"
          ];
          break;
        case 'quest':
          if (questStage === 0) {
            setQuestStage(1);
            soundEngine.playChime(700);
            response = [
              "============================================================",
              "[MAINFRAME DIAGNOSTIC QUEST INITIATED - LEVEL 1 OF 3]",
              "============================================================",
              "ALERT: High latency detected on SQL query execution engine!",
              "QUERY: SELECT * FROM telemetry_events WHERE event_timestamp >= '2026-07-01';",
              "ISSUE: Full table scan scanning 1.4 Billion rows. Partition pruning inactive.",
              " ",
              "TASK: Type 'solve partition_date' (or 'solve <key>') to apply partition key pruning!"
            ];
          } else if (questStage === 1) {
            response = [
              "[CURRENT QUEST: LEVEL 1 OF 3]",
              "TASK: Apply partition key to fix SQL full table scan.",
              "USAGE: solve partition_date"
            ];
          } else if (questStage === 2) {
            response = [
              "[CURRENT QUEST: LEVEL 2 OF 3]",
              "TASK: Parse payload status from corrupted log stream.",
              "LOG: [2026-07-21] status=CRITICAL_OOM_ALERT payload=0x99",
              "USAGE: solve CRITICAL_OOM_ALERT"
            ];
          } else if (questStage === 3) {
            response = [
              "[CURRENT QUEST: LEVEL 3 OF 3]",
              "TASK: Partition skew detected! 90% traffic routed to Partition 0.",
              "USAGE: solve murmur3"
            ];
          } else {
            response = [
              "[MAINFRAME QUEST COMPLETED]",
              "CLEARANCE STATUS: CLASS_5_ADMIN",
              "TYPE 'VAULT' TO INSPECT SECRET ARCHITECTURE METRICS."
            ];
          }
          break;
        case 'vault':
          if (questStage === 4) {
            soundEngine.playChime(1200);
            response = [
              "============================================================",
              "🔒 CLASS 5 SECURE ARCHITECTURE VAULT",
              "============================================================",
              "ENGINEER: Ichsanul Amal (Nich)",
              "CORE PIPELINES: 40+ Production dbt Models / Spark Streaming",
              "INFRASTRUCTURE: Cloudflare OpenNext Edge Workers + GCP BigQuery",
              "SLO: 99.99% Pipeline Uptime, <50ms Global Edge Response",
              "SECRET CODE: [NICHSEDGE_MASTER_KEY_2026]",
              "============================================================"
            ];
          } else {
            soundEngine.playClick(300);
            response = [
              "⛔ ACCESS DENIED: CLASS_5_ADMIN CLEARANCE REQUIRED.",
              "RUN 'QUEST' AND COMPLETE ALL 3 DIAGNOSTIC STAGES TO UNLOCK."
            ];
          }
          break;

        case 'whoami':
          response = [
            "USER_PROFILE_LOADED:",
            "  NAME: Ichsanul Amal",
            "  ROLE: Data Engineer / System Architect",
            "  TRAITS:",
            "    - Hypersensitive I/O: Requires silence (0dB). Open offices = Kernel Panic.",
            "    - Energy Strategy: Utilitarian. Prefers unflavored oatmeal, raw veg, water.",
            "    - Known Bugs: Caffeine causes memory leaks (insomnia). Capsaicin causes I/O delays.",
            "    - Social Modes: Futsal, Karaoke, Tennis (v0.1 / Noob)"
          ];
          break;
        case 'skills':
          response = [
            "LOADED_MODULES:",
            "  [CORE]: Python, SQL, Git",
            "  [SYS_ARCHITECTURE]: Airflow, DBT, Kafka",
            "  [VIBE_CODING]: React, Next.js, Tailwind",
            "  [PASSIVE_BUFFS]: Reading, Philosophy, Finance"
          ];
          break;
        case 'hack':
          setIsProcessing(true);
          response = ["BYPASSING MAINFRAME..."];
          const hackLines = [
            "ACCESSING NODE_0X4492...",
            "OVERRIDING TCP/IP HANDSHAKE...",
            "DECRYPTING AES-256 KERNEL DB...",
            "DOWNLOAD: 14% ... 49% ... 99%",
            "INJECTING PAYLOAD /root/exploit.sh",
            "ROOT PRIVILEGES GRANTED.",
            "Welcome back, Admin."
          ];
          
          let counter = 0;
          const interval = setInterval(() => {
            if (counter < hackLines.length) {
              setHistory(prev => [...prev, `[SYS] ${hackLines[counter]}`]);
              counter++;
            } else {
              clearInterval(interval);
              setIsProcessing(false);
              setHistory(prev => [...prev, " "]);
            }
          }, 400);
          return;
        case 'exit':
        case 'quit':
        case 'back':
        case 'cd ..':
        case 'home':
        case 'hq':
          response = [locale === 'id' ? "KEMBALI KE BERANDA (HQ)..." : "RETURNING TO HQ..."];
          soundEngine.playClick(400);
          setTimeout(() => router.push(homeHref), 400);
          break;
        case 'work':
        case 'career':
          response = [locale === 'id' ? "NAVIGASI KE ARSIP KARIR..." : "NAVIGATING TO CAREER ARCHIVE..."];
          soundEngine.playClick(400);
          setTimeout(() => router.push(workHref), 400);
          break;
        case 'projects':
        case 'repos':
          response = [locale === 'id' ? "NAVIGASI KE ARSIP PROYEK..." : "REDIRECTING TO /PROJECTS..."];
          soundEngine.playClick(400);
          setTimeout(() => router.push(projectsHref), 400);
          break;
        case 'data-lake':
        case 'datalake':
        case 'lake':
          response = [locale === 'id' ? "NAVIGASI KE DATA LAKE..." : "NAVIGATING TO DATA LAKE..."];
          soundEngine.playClick(400);
          setTimeout(() => router.push(dataLakeHref), 400);
          break;
        case 'garden':
          response = ["OPENING DIGITAL GARDEN..."];
          setTimeout(() => window.open('https://nichsedge.github.io/digital-garden/', '_blank'), 400);
          break;
        case 'ichsan':
        case 'neofetch':
          response = [
            "  ███╗   ██╗██╗ ██████╗██╗  ██╗  USER: ichsanul@nichsedge",
            "  ████╗  ██║██║██╔════╝██║  ██║  HOST: NICHSEDGE-MAINFRAME-V2",
            "  ██╔██╗ ██║██║██║     ███████║  OS: Portfolio-OS 2026.07 (Edge Native)",
            "  ██║╚██╗██║██║██║     ██╔══██║  KERNEL: Next.js 16.2 + Cloudflare Workers",
            "  ██║ ╚████║██║╚██████╗██║  ██║  UPTIME: 99.999% (Continuous Deployment)",
            "  ╚═╝  ╚═══╝╚═╝ ╚═════╝╚═╝  ╚═╝  ROLE: Data Engineer & System Architect",
            "                                 STACK: Python 3.12, SQL, dbt, Spark, Kafka",
            "                                 DATA LAKE: Iceberg, DuckDB, BigQuery",
            "                                 LOCATION: Jakarta, ID (UTC+7)"
          ];
          break;
        case 'status':
        case 'diagnose':
          const stats = generateSystemStats();
          response = [
            "+--------------------------------------------------+",
            "|         SYSTEM MONITOR DIAGNOSTIC REPORT         |",
            "+----------------------+---------------------------+",
            `| TIMESTAMP            | ${new Date().toISOString().substring(0, 19).replace('T', ' ').padEnd(25)} |`,
            `| UPTIME               | ${stats.uptime.padEnd(25)} |`,
            `| THROUGHPUT           | ${stats.throughput.padEnd(25)} |`,
            `| LATENCY              | ${stats.latency.padEnd(25)} |`,
            `| CPU LOAD             | ${stats.cpuLoad.padEnd(25)} |`,
            `| ACTIVE NODES         | ${String(stats.activeNodes).padEnd(25)} |`,
            `| COGNITIVE CORE       | NEURAL_GHOST ACTIVE (100%)|`,
            `| LAKE ENGINE          | STANDBY (0 IN-FLIGHT)     |`,
            "+----------------------+---------------------------+",
            "| STATUS: ALL SYSTEMS RUNNING WITHIN DESIGN SPEC   |",
            "+--------------------------------------------------+"
          ];
          break;
        case 'referrals':
        case 'gateways':
          response = [
            "+----------------------------------------------------------------------------------+",
            "|                     ACTIVE INGESTION GATEWAYS (REFERRALS)                        |",
            "+----------------------+-----------------------+-----------------------------------+",
            "| NAME                 | CATEGORY              | ROUTING CODE                      |",
            "+----------------------+-----------------------+-----------------------------------+",
            ...referralsData.map(node => 
              `| ${node.name.padEnd(20)} | ${node.category.padEnd(21)} | ${node.code.padEnd(33)} |`
            ),
            "+----------------------+-----------------------+-----------------------------------+",
            "| TIP: Navigate to /referrals in your browser to view the interactive dashboard.   |",
            "+----------------------------------------------------------------------------------+"
          ];
          break;
        case 'pay':
        case 'transfer':
          response = [
            "+----------------------+--------------------+-----------------+-------------------------+",
            `| ${("FINANCIAL TRANSFER ACCOUNTS").padEnd(83)} |`,
            "+----------------------+--------------------+-----------------+-------------------------+",
            "| NAME                 | CATEGORY           | ACCOUNT/ROUT NO | RECIPIENT               |",
            "+----------------------+--------------------+-----------------+-------------------------+",
            ...payData.map(node => 
              `| ${node.name.padEnd(20)} | ${node.category.padEnd(18)} | ${node.number.padEnd(15)} | ${node.recipient.padEnd(22)} |`
            ),
            "+----------------------+--------------------+-----------------+-------------------------+",
            `| ${(locale === 'id' ? "TIP: Navigasi ke /pay di browser untuk melihat detail pembayaran." : "TIP: Navigate to /pay in browser to view the payment details page.").padEnd(83)} |`,
            "+----------------------+--------------------+-----------------+-------------------------+"
          ];
          break;
        case 'transparency':
        case 'sovereignty':
        case 'runway':
        case 'barbell':
          response = [
            "+----------------------------------------------------------------------------------+",
            "|                🏛️  SOVEREIGN FINANCIAL TRANSPARENCY & BARBELL RADAR               |",
            "+----------------------------------------------------------------------------------+",
            `| BALANCE SHEET STATUS: ${(transparencyData.sovereign_status.badge).padEnd(58)} |`,
            `| RUNWAY RESILIENCE:    ${(transparencyData.sovereign_status.runway_tier).padEnd(58)} |`,
            `| PRESERVATION PROFILE: ${(transparencyData.sovereign_status.capital_preservation).padEnd(58)} |`,
            "+----------------------------------------------------------------------------------+",
            "| ASSET CLASS          | ALLOCATION | RISK REGIME / PURPOSE                        |",
            "+----------------------+------------+----------------------------------------------+",
            ...transparencyData.barbell_allocation.map((item: any) => 
              `| ${item.asset_class.padEnd(20)} | ${(item.percentage.toFixed(1) + '%').padStart(10)} | ${item.risk_profile.padEnd(44)} |`
            ),
            "+----------------------+------------+----------------------------------------------+",
            `| DEEP FOCUS TELEMETRY: ${(`${transparencyData.telemetry.deep_work_hours_30d} hrs active work / 30d (${transparencyData.telemetry.velocity_percentile})`).padEnd(58)} |`,
            "+----------------------------------------------------------------------------------+",
            "| NOTE: Privacy-safe SSOT telemetry synced from iERP events.db (Zero debt recorded)|",
            "+----------------------------------------------------------------------------------+"
          ];
          break;
        case 'benchmark':
          response = [
            "============================================================",
            "[PORTFOLIO NODE BENCHMARK ENGINE v2.5]",
            "============================================================",
            "CALCULATING PIPELINE THROUGHPUT...",
            "↳ Ingestion Latency:    1.2ms (P99: 4.8ms)",
            "↳ Spark Microbatch:     128,400 msg/sec",
            "↳ dbt Model Build:      4.2 sec (Incremental Merge)",
            "↳ DuckDB Memory Scans:  45.8 GB/sec",
            "↳ SLA Compliance Rate:  99.999%",
            "============================================================",
            "VERDICT: EXTREMELY OPTIMAL PERFORMANCE (CLASS-A PIPELINE)"
          ];
          soundEngine.playChime(1200, 0.3);
          break;
        case 'voice':
          if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
            window.speechSynthesis.cancel();
            const lastLines = history.slice(-6).join(' ').replace(/[*_#`\[\]+|-]/g, '');
            const utterance = new SpeechSynthesisUtterance(lastLines);
            utterance.rate = 1.0;
            window.speechSynthesis.speak(utterance);
            response = ["[SPEECH_SYNTHESIZER_ACTIVATED: READING RECENT TERMINAL BUFFER]"];
          } else {
            response = ["ERR: Speech synthesis not supported by this user agent."];
          }
          break;
        case 'export':
          if (typeof window !== 'undefined') {
            const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(referralsData, null, 2));
            const downloadAnchor = document.createElement('a');
            downloadAnchor.setAttribute("href", dataStr);
            downloadAnchor.setAttribute("download", "nichsedge_portfolio_data.json");
            document.body.appendChild(downloadAnchor);
            downloadAnchor.click();
            downloadAnchor.remove();
            response = ["EXPORT COMPLETE: Downloaded 'nichsedge_portfolio_data.json'."];
          }
          break;
        case 'audio':
          const isEnabled = soundEngine.toggleAudio();
          response = [`AUDIO SYNTHESIZER TOGGLED: ${isEnabled ? 'ONLINE (HUM ACTIVE)' : 'MUTED'}`];
          break;
        default:
          response = [`COMMAND_NOT_FOUND: ${cmd}. TYPE 'HELP' FOR ASSISTANCE.`];
      }
    }

    setHistory(prev => [...prev, ...response, " "]);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (cmdHistory.length === 0) return;
      const newIndex = historyIndex === -1 ? cmdHistory.length - 1 : Math.max(0, historyIndex - 1);
      setHistoryIndex(newIndex);
      setInput(cmdHistory[newIndex]);
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (historyIndex === -1) return;
      const newIndex = historyIndex + 1;
      if (newIndex >= cmdHistory.length) {
        setHistoryIndex(-1);
        setInput('');
      } else {
        setHistoryIndex(newIndex);
        setInput(cmdHistory[newIndex]);
      }
    } else if (e.key === 'Tab') {
      e.preventDefault();
      const commandsList = [
        'help', 'exit', 'quit', 'back', 'home', 'work', 'projects', 'data-lake', 'datalake',
        'garden', 'ghost', 'hack', 'clear', 'neofetch', 'whoami', 'skills', 'theme', 'biome',
        'status', 'diagnose', 'ls', 'cat', 'referrals', 'gateways', 'pipeline', 'monitor',
        'pay', 'transfer', 'benchmark', 'voice', 'export', 'audio', 'sound', 'lockdown', 'quest', 'solve', 'vault'
      ];
      const match = commandsList.find(c => c.startsWith(input.trim().toLowerCase()));
      if (match) {
        setInput(match);
      }
    }
  };

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [history]);

  // Conveyor belt animator for ASCII pipeline diagram
  const getBelt = (frame: number, length: number = 8) => {
    const chars = ['>', '>', '·', '·'];
    let result = '';
    for (let i = 0; i < length; i++) {
      result += chars[(i - frame + 100) % chars.length];
    }
    return result;
  };

  const getProgressBar = (percentage: number) => {
    const totalBlocks = 15;
    const filledBlocks = Math.round((percentage / 100) * totalBlocks);
    const emptyBlocks = Math.max(0, totalBlocks - filledBlocks);
    const bar = '█'.repeat(filledBlocks) + '░'.repeat(emptyBlocks);
    return `[${bar}] ${percentage}%`;
  };

  const getProgressBarMini = (percentage: number) => {
    const totalBlocks = 6;
    const filledBlocks = Math.round((percentage / 100) * totalBlocks);
    const emptyBlocks = Math.max(0, totalBlocks - filledBlocks);
    const bar = '█'.repeat(filledBlocks) + '░'.repeat(emptyBlocks);
    return `${bar} ${percentage}%`;
  };

  const renderAsciiDiagram = () => {
    const c1 = getBelt(simFrame, 8);
    const c2 = getBelt(simFrame + 1, 8);
    const c3 = getBelt(simFrame + 2, 8);

    return `
[ SOURCES ]             [ BUFFER QUEUE ]             [ PROCESS ENGINE ]             [ DATA LAKE ]
postgres  --+          +----------------+          +--------------------+          +---------------+
crawler   --+-- ${c1} -|   ${getProgressBarMini(simTelemetry.bufferFill)}   |--- ${c2} -| dbt-spark active   |--- ${c3} -| BigQuery Lake |
kafka_hub --+          +----------------+          +--------------------+          +---------------+
`;
  };

  // Main simulation tick interval
  useEffect(() => {
    if (activeSimulation !== 'pipeline') return;

    // Initialize telemetry data
    const initialTelemetry = {
      ingestRate: 104230,
      processedCount: 12543900,
      errorCount: 0,
      bufferFill: 54,
      elapsed: 0
    };
    setSimTelemetry(initialTelemetry);
    simTelemetryRef.current = initialTelemetry;
    setSimFrame(0);
    
    // Set up initial rolling logs
    const initialLogs = [
      `[0.0s] [SYSTEM] Initializing stream simulator pipeline v2.4...`,
      `[0.0s] [CONNECT] Connected to postgres://prod-rds-db:5432/core`,
      `[0.0s] [CONNECT] Handshake completed with kafka://kafka-broker-1:9092`,
      `[0.0s] [SYSTEM] Listening on topics: telemetry.user_actions, staging.transactions`,
      `[0.0s] [DBT] Initializing incremental model build context...`,
      `[0.0s] [SPARK] SparkSession initialized. Master node: spark://spark-master-01:7077`
    ];
    setSimLogs(initialLogs);

    let currentLogs = [...initialLogs];

    const logTemplates = [
      // Kafka ingestion
      (elapsed: string, records: string) => `[${elapsed}s] [INFO] [KAFKA] Consumed ${records} messages from topic: telemetry.user_actions.`,
      (elapsed: string) => `[${elapsed}s] [INFO] [KAFKA] Rebalancing consumer group 'pipeline-consumers'... OK.`,
      (elapsed: string) => `[${elapsed}s] [INFO] [KAFKA] Committed offsets for partition #0, #1, #2.`,
      // Postgres/Scrapers ingestion
      (elapsed: string, records: string) => `[${elapsed}s] [INFO] [SCRAPER] Ingested ${records} raw documents from web-crawler-node-04.`,
      (elapsed: string) => `[${elapsed}s] [INFO] [POSTGRES] Queried replication logs. Found 0 schema modifications.`,
      // Spark/dbt transformation
      (elapsed: string) => `[${elapsed}s] [INFO] [SPARK] Running micro-batch execution on executor node_0x4492.`,
      (elapsed: string) => `[${elapsed}s] [INFO] [DBT] Compiling model: staging.stg_user_actions... success.`,
      (elapsed: string, records: string) => `[${elapsed}s] [SUCCESS] [DBT] Merged ${records} rows into target table warehouse.dim_users.`,
      (elapsed: string) => `[${elapsed}s] [INFO] [SPARK] GC run finished. Cleared 1.4GB heap memory.`,
      // BigQuery loads
      (elapsed: string, records: string) => `[${elapsed}s] [SUCCESS] [BIGQUERY] Loaded parquet partition to core_lake.user_telemetry (+${records} rows).`,
      (elapsed: string) => `[${elapsed}s] [INFO] [BIGQUERY] Cluster health: green. Query cache hit rate: 94.2%.`,
      // Common warnings/errors
      (elapsed: string) => `[${elapsed}s] [WARNING] [DBT] Model: warehouse.fact_billing timed out. Retrying execution batch...`,
      (elapsed: string) => `[${elapsed}s] [WARNING] [KAFKA] Consumer heartbeat delayed (142ms). Session remained active.`,
      (elapsed: string) => `[${elapsed}s] [ERROR] [POSTGRES] SSL handshake timeout. Attempting socket reconnect... Reconnected.`
    ];

    const intervalId = setInterval(() => {
      // 1. Telemetry updates
      const nextIngest = Math.floor(95000 + Math.random() * 20000);
      const processedIncrement = Math.floor(nextIngest * 0.4);
      
      const fillDiff = Math.floor(Math.random() * 7) - 3; // -3 to +3
      const nextFill = Math.max(10, Math.min(95, simTelemetryRef.current.bufferFill + fillDiff));
      
      let errorDiff = 0;
      if (Math.random() < 0.03) {
        errorDiff = 1;
      }

      const nextTelemetry = {
        ingestRate: nextIngest,
        processedCount: simTelemetryRef.current.processedCount + processedIncrement,
        errorCount: simTelemetryRef.current.errorCount + errorDiff,
        bufferFill: nextFill,
        elapsed: Number((simTelemetryRef.current.elapsed + 0.4).toFixed(1))
      };

      setSimTelemetry(nextTelemetry);
      simTelemetryRef.current = nextTelemetry;

      // 2. Frame progression for conveyors
      setSimFrame(prev => (prev + 1) % 4);

      // 3. Dynamic log stream
      if (Math.random() < 0.75) {
        const elapsedStr = nextTelemetry.elapsed.toFixed(1);
        const recordsFormatted = new Intl.NumberFormat().format(Math.floor(nextIngest * 0.4));
        
        let logText = "";
        if (errorDiff > 0) {
          logText = `[${elapsedStr}s] [ERROR] [PIPELINE] Detected malformed packet in stream. Routing to dead-letter queue.`;
        } else {
          const randomIndex = Math.floor(Math.random() * logTemplates.length);
          const template = logTemplates[randomIndex];
          if (template.length === 2) {
            logText = template(elapsedStr, recordsFormatted);
          } else {
            logText = template(elapsedStr, "");
          }
        }

        currentLogs = [...currentLogs, logText];
        if (currentLogs.length > 15) {
          currentLogs.shift();
        }
        setSimLogs(currentLogs);
      }
    }, 400);

    return () => {
      clearInterval(intervalId);
    };
  }, [activeSimulation]);

  // Capturing keyboard cancellation handler
  useEffect(() => {
    if (activeSimulation !== 'pipeline') return;

    const handleKeyDownGlobal = (e: KeyboardEvent) => {
      e.preventDefault();
      e.stopPropagation();

      // Exit simulation mode
      setActiveSimulation(null);

      // Print summary exit log to main terminal history
      const endCount = simTelemetryRef.current.processedCount;
      const endSeconds = simTelemetryRef.current.elapsed;
      const formattedProcessed = new Intl.NumberFormat().format(Math.floor(endCount));

      setHistory(prev => [
        ...prev,
        "==================================================",
        `[PIPELINE SIMULATION INTERRUPTED BY USER]`,
        `  ELAPSED TIME      : ${endSeconds.toFixed(1)}s`,
        `  RECORDS PROCESSED : ${formattedProcessed}`,
        `  AVG INGEST SPEED  : ~105,000 msg/s`,
        `  FATAL ERRORS      : ${simTelemetryRef.current.errorCount}`,
        `  INTEGRITY CHECK   : PASS (99.99% accuracy)`,
        "==================================================",
        " "
      ]);

      // Refocus the standard shell command input
      setTimeout(() => {
        if (inputRef.current) {
          inputRef.current.focus();
        }
      }, 50);
    };

    window.addEventListener('keydown', handleKeyDownGlobal, true);
    return () => {
      window.removeEventListener('keydown', handleKeyDownGlobal, true);
    };
  }, [activeSimulation]);

  // Auto scroll logs stream
  useEffect(() => {
    if (activeSimulation === 'pipeline') {
      simLogsEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [simLogs, activeSimulation]);

  useEffect(() => {
    gameEngine.completeQuest('terminal_access');
    const handleGlobalClick = () => {
      // Focus input if clicked inside terminal container
      if (inputRef.current) {
        inputRef.current.focus();
      }
    };
    window.addEventListener('click', handleGlobalClick);
    return () => window.removeEventListener('click', handleGlobalClick);
  }, []);

  return (
    <div className={`min-h-screen ${themeStyles.bg} ${themeStyles.text} font-mono ${themeStyles.accentSel} transition-all duration-500 selection:bg-accent selection:text-bg`}>
      <Navbar />
      <div className="pt-6 sm:pt-10 md:pt-14 pb-12 sm:pb-16 px-4 md:px-8">
        <div className={`max-w-4xl mx-auto border ${themeStyles.border} bg-[#000000]/60 backdrop-blur-md ${themeStyles.glow} relative overflow-hidden group transition-all duration-500`}>
          <div className="absolute inset-0 pointer-events-none opacity-[0.03]" style={{ background: 'repeating-linear-gradient(0deg, #00e1cf, #00e1cf 1px, transparent 1px, transparent 2px)' }} />
          
          {/* Terminal Header */}
          <div className={`bg-[#000000]/30 border-b ${themeStyles.border} px-4 py-2.5 flex items-center justify-between relative z-10 transition-colors duration-500`}>
            <div className="flex items-center gap-3">
              <div className="flex gap-1.5 items-center">
                <button
                  type="button"
                  onClick={() => router.push(homeHref)}
                  title={locale === 'id' ? 'Keluar Terminal (Kembali ke Beranda)' : 'Exit Terminal (Return to HQ)'}
                  className="w-3 h-3 rounded-full bg-red-500/80 hover:bg-red-500 transition-all cursor-pointer flex items-center justify-center group/btn"
                >
                  <span className="opacity-0 group-hover/btn:opacity-100 text-[8px] text-black font-bold leading-none">×</span>
                </button>
                <button
                  type="button"
                  onClick={() => setHistory([])}
                  title={locale === 'id' ? 'Bersihkan Konsol' : 'Clear Buffer'}
                  className="w-3 h-3 rounded-full bg-yellow-500/80 hover:bg-yellow-500 transition-all cursor-pointer flex items-center justify-center group/btn"
                >
                  <span className="opacity-0 group-hover/btn:opacity-100 text-[8px] text-black font-bold leading-none">-</span>
                </button>
                <button
                  type="button"
                  onClick={() => setInput('status')}
                  title={locale === 'id' ? 'Status Sistem' : 'System Diagnostic'}
                  className="w-3 h-3 rounded-full bg-green-500/80 hover:bg-green-500 transition-all cursor-pointer flex items-center justify-center group/btn"
                >
                  <span className="opacity-0 group-hover/btn:opacity-100 text-[8px] text-black font-bold leading-none">+</span>
                </button>
              </div>
              <button
                type="button"
                onClick={() => router.push(homeHref)}
                className="font-mono text-[9px] uppercase tracking-wider text-text-3 hover:text-accent flex items-center gap-1.5 transition-colors cursor-pointer border-l border-border-subtle pl-3"
              >
                <ArrowLeft size={10} />
                <span>{locale === 'id' ? 'Kembali ke Beranda' : 'Back to HQ'}</span>
              </button>
            </div>
            <div className="text-[10px] uppercase tracking-widest opacity-60 flex items-center gap-2">
              <TerminalIcon size={12} className={themeStyles.accentText} /> 
              <span>tty — 128x64</span>
            </div>
            <div className="flex items-center gap-2">
               <button
                 type="button"
                 onClick={() => router.push(homeHref)}
                 className={`font-mono text-[10px] uppercase tracking-widest px-2.5 py-1 border ${themeStyles.border} rounded-sm text-text-3 hover:${themeStyles.accentText} hover:border-accent/40 transition-colors flex items-center gap-1.5 cursor-pointer bg-bg-1/40`}
               >
                 <Home size={10} /> {locale === 'id' ? 'Keluar' : 'Exit'}
               </button>
            </div>
          </div>

        {/* Content */}
        <div ref={scrollRef} className={`p-6 h-[75vh] space-y-1 text-[13px] relative z-10 scrollbar-none ${activeSimulation === 'pipeline' ? 'overflow-hidden' : 'overflow-y-auto'}`}>
          {activeSimulation === 'pipeline' ? (
            <div className="flex flex-col h-full space-y-4 select-none">
              {/* Header Info */}
              <div className={`flex justify-between items-center border-b ${themeStyles.border} pb-2`}>
                <div className="flex items-center gap-2">
                  <span className={`${themeStyles.accentText} font-bold animate-pulse`}>●</span>
                  <span className="font-bold tracking-wider uppercase text-xs md:text-sm">Stream Pipeline Monitor v2.4</span>
                </div>
                <div className="flex gap-4 text-[10px] md:text-xs opacity-60">
                  <span>ELAPSED: {simTelemetry.elapsed.toFixed(1)}s</span>
                  <span>STATUS: ACTIVE</span>
                </div>
              </div>

              {/* ASCII Flow Diagram */}
              <div className={`p-4 bg-[#000000]/40 border ${themeStyles.border} rounded font-mono text-[9px] sm:text-[11px] md:text-xs overflow-x-auto whitespace-pre leading-normal ${themeStyles.accentText} text-center`}>
                {renderAsciiDiagram()}
              </div>

              {/* Telemetry Metrics Grid */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                <div className={`p-3 bg-[#000000]/40 border ${themeStyles.border} rounded flex flex-col justify-between`}>
                  <span className="text-[10px] uppercase tracking-wider opacity-50">Ingest Speed</span>
                  <span className={`text-xs sm:text-sm md:text-base font-bold ${themeStyles.accentText}`}>
                    {new Intl.NumberFormat().format(simTelemetry.ingestRate)} msg/s
                  </span>
                </div>
                <div className={`p-3 bg-[#000000]/40 border ${themeStyles.border} rounded flex flex-col justify-between`}>
                  <span className="text-[10px] uppercase tracking-wider opacity-50">Processed</span>
                  <span className="text-xs sm:text-sm md:text-base font-bold text-white">
                    {new Intl.NumberFormat().format(Math.floor(simTelemetry.processedCount))}
                  </span>
                </div>
                <div className={`p-3 bg-[#000000]/40 border ${themeStyles.border} rounded flex flex-col justify-between`}>
                  <span className="text-[10px] uppercase tracking-wider opacity-50">Buffer Fill</span>
                  <span className="text-[10px] sm:text-xs md:text-sm font-bold text-white whitespace-nowrap">
                    {getProgressBar(simTelemetry.bufferFill)}
                  </span>
                </div>
                <div className={`p-3 bg-[#000000]/40 border ${themeStyles.border} rounded flex flex-col justify-between`}>
                  <span className="text-[10px] uppercase tracking-wider opacity-50">Error Count</span>
                  <span className={`text-xs sm:text-sm md:text-base font-bold ${simTelemetry.errorCount > 0 ? 'text-red-500 animate-pulse font-extrabold' : 'text-green-400'}`}>
                    {simTelemetry.errorCount} Fails
                  </span>
                </div>
              </div>

              {/* Simulated Log Output Panel */}
              <div className="flex-1 flex flex-col min-h-0 overflow-hidden">
                <div className="text-[10px] uppercase tracking-wider opacity-50 mb-1 flex justify-between items-center">
                  <span>Runtime Logs Stream</span>
                  <span className="animate-pulse text-[10px] text-green-400 flex items-center gap-1">● RECEIVING</span>
                </div>
                <div className={`flex-1 p-3 bg-[#000000]/60 border ${themeStyles.border} rounded overflow-y-auto font-mono text-[10px] md:text-[11px] space-y-1 scrollbar-none`}>
                  {simLogs.map((log, index) => {
                    let logColor = "";
                    if (log.includes("[ERROR]")) logColor = "text-red-400 font-bold";
                    else if (log.includes("[WARNING]")) logColor = "text-yellow-400";
                    else if (log.includes("[SUCCESS]")) logColor = "text-green-400 font-bold";
                    else if (log.includes("[SYSTEM]")) logColor = "text-cyan-400";
                    return (
                      <div key={index} className={`whitespace-pre-wrap leading-tight ${logColor || 'text-zinc-300'}`}>
                        {log}
                      </div>
                    );
                  })}
                  <div ref={simLogsEndRef} />
                </div>
              </div>

              {/* Interruption Prompt Footer */}
              <div className="text-center text-[9px] md:text-[10px] opacity-40 uppercase tracking-widest animate-pulse py-1">
                PRESS ANY KEY TO HALT MONITORING AND RETURN TO TERMINAL
              </div>
            </div>
          ) : (
            <>
              <AnimatePresence mode="popLayout">
                {history.map((line, i) => (
                  <motion.div 
                    initial={{ opacity: 0, x: -5 }}
                    animate={{ opacity: 1, x: 0 }}
                    key={i} 
                    className={(line.startsWith('ichsanul@') || line.startsWith('ghost@')) ? (line.startsWith('ghost@') ? 'text-rose-400 font-bold animate-pulse' : `${themeStyles.accentText} font-bold`) : line.startsWith('GHOST:') ? 'text-[#ffffff]' : ''}
                  >
                    {line}
                  </motion.div>
                ))}
              </AnimatePresence>
              
              <form onSubmit={handleCommand} className="flex items-center gap-2 pt-2">
                <span className={`${ghostMode ? 'text-rose-400 font-bold animate-pulse' : `${themeStyles.accentText} font-bold`}`}>
                  {ghostMode ? 'ghost@neural ~ $' : 'ichsanul@portfolio ~ $'}
                </span>
                <input 
                  ref={inputRef}
                  autoFocus
                  disabled={isProcessing}
                  type="text" 
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                  className="flex-1 bg-transparent border-none outline-none text-[#ffffff] focus:ring-0 p-0 disabled:opacity-50"
                  spellCheck={false}
                  autoComplete="off"
                />
                {isProcessing && <Loader2 size={12} className={`${themeStyles.accentText} animate-spin`} />}
              </form>
            </>
          )}
        </div>

        {/* Footer info */}
        <div className={`bg-[#000000]/20 border-t ${themeStyles.border} px-4 py-2 text-[10px] flex justify-between relative z-10 transition-colors duration-500`}>
          <div className="flex gap-4">
            <span className={themeStyles.accentText}>GIT(MAIN)</span>
            <span className="opacity-40">UTF-8</span>
          </div>
          <div className="flex gap-4 uppercase tracking-[0.2em] font-bold">
             <span className="opacity-40">V2.0.5</span>
             {ghostStatus === 'LIVE' ? (
               <span className="text-green-400 font-bold animate-pulse flex items-center gap-1">● LIVE_AI</span>
             ) : ghostStatus === 'LOCAL' ? (
               <span className="text-cyan-400 font-bold flex items-center gap-1">● LOCAL_EMULATION</span>
             ) : (
               <span className={`${themeStyles.accentText} animate-pulse`}>● CONNECTED</span>
             )}
          </div>
        </div>
      </div>
      </div>
      
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 flex items-center gap-4 bg-bg/90 border border-border-subtle px-4 py-2 rounded-full shadow-lg backdrop-blur-md"
      >
        <button 
          onClick={() => router.back()} 
          className={`flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-wider text-text-3 hover:${themeStyles.accentText} transition-colors cursor-pointer`}
        >
          <ArrowLeft size={11} /> {locale === 'id' ? 'Kembali' : 'Back'}
        </button>
        <span className="opacity-20 text-text-3">|</span>
        <button 
          onClick={() => router.push(homeHref)} 
          className={`flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-wider text-text-3 hover:${themeStyles.accentText} transition-colors cursor-pointer`}
        >
          <Home size={11} /> {locale === 'id' ? 'Beranda' : 'HQ Home'}
        </button>
        <span className="opacity-20 text-text-3">|</span>
        <button 
          onClick={() => setInput('ghost')} 
          className={`flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-wider text-text-3 hover:${themeStyles.accentText} transition-colors cursor-pointer`}
        >
          <Zap size={11} className="text-accent" /> Ghost
        </button>
      </motion.div>
    </div>
  );
}
