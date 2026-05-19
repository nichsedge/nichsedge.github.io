'use client';

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Terminal as TerminalIcon, Home, Zap, Loader2, Cpu, Globe, Database } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { getFallbackGhostResponse } from '@/lib/ai-fallback';
import referralsData from '@/data/referrals.json';

export default function TerminalClient() {
  const [input, setInput] = useState('');
  const [history, setHistory] = useState<string[]>([
    "PORTFOLIO_OS V2.0.5 (May 2026)",
    "AUTHENTICATION: SUCCESS (AS GUEST)",
    "INITIALIZING NEURAL_GHOST PROTOCOL...",
    "TYPE 'HELP' FOR LIST OF COMMANDS",
    " "
  ]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [cmdHistory, setCmdHistory] = useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const [theme, setTheme] = useState<'cyan' | 'matrix' | 'amber' | 'cobalt'>('cyan');
  const [ghostMode, setGhostMode] = useState(false);
  const [ghostStatus, setGhostStatus] = useState<'LIVE' | 'LOCAL' | null>(null);

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
    } else if (cmd.startsWith('theme')) {
      const parts = cmd.split(' ');
      const targetTheme = parts[1];
      if (!targetTheme) {
        response = [
          "CURRENT_THEME: " + theme.toUpperCase(),
          "AVAILABLE_THEMES: CYAN, MATRIX, AMBER, COBALT",
          "USAGE: theme <theme_name>"
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
    } else {
      switch(cmd) {
        case 'help':
          response = [
            "AVAILABLE_COMMANDS:",
            "  PROJECTS      - VIEW ENGINEERING ARCHIVE",
            "  HOME          - RETURN TO HQ",
            "  GARDEN        - OPEN DIGITAL GARDEN",
            "  GHOST         - CHAT WITH THE PROJECT INTELLIGENCE",
            "  HACK          - INITIALIZE RAPID PENETRATION PROTOCOL",
            "  CLEAR         - WIPE BUFFER",
            "  NEOFETCH      - SYSTEM OVERVIEW",
            "  WHOAMI        - PRINT CURRENT USER PROFILE",
            "  SKILLS        - LIST LOADED MODULES",
            "  LS            - LIST VIRTUAL DIRECTORY CONTENT",
            "  CAT <file>    - DISPLAY CONTENT OF A VIRTUAL FILE",
            "  THEME <name>  - CHANGE TERMINAL STYLE (CYAN, MATRIX, AMBER, COBALT)",
            "  REFERRALS     - LIST EXTERNAL INGESTION GATEWAYS"
          ];
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
        case 'projects':
          response = ["REDIRECTING TO /PROJECTS..."];
          setTimeout(() => router.push('/projects'), 1000);
          break;
        case 'garden':
          response = ["OPENING DIGITAL GARDEN..."];
          setTimeout(() => window.open('https://nichsedge.github.io/digital-garden/', '_blank'), 1000);
          break;
        case 'home':
          response = ["RETURNING TO HQ..."];
          setTimeout(() => router.push('/'), 1000);
          break;
        case 'neofetch':
          response = [
            "      .---.      USER: ichsanul.amal",
            "     /     \\     OS: PORTFOLIO_OS v2",
            "    | () () |    SHELL: ts-node-custom",
            "     \\  ^  /     CORE: data-engineer.v1",
            "      |||||      STACK: python, dbt, gcp",
            "      |||||      LOC: Jakarta, ID"
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
      const commandsList = ['help', 'projects', 'home', 'garden', 'ghost', 'hack', 'clear', 'neofetch', 'whoami', 'skills', 'theme', 'ls', 'cat', 'referrals', 'gateways'];
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

  useEffect(() => {
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
    <div className={`min-h-screen ${themeStyles.bg} ${themeStyles.text} font-mono p-4 md:p-8 ${themeStyles.accentSel} transition-all duration-500 selection:bg-accent selection:text-bg`}>
      <div className={`max-w-4xl mx-auto border ${themeStyles.border} bg-[#000000]/60 backdrop-blur-md ${themeStyles.glow} relative overflow-hidden group transition-all duration-500`}>
        <div className="absolute inset-0 pointer-events-none opacity-[0.03]" style={{ background: 'repeating-linear-gradient(0deg, #00e1cf, #00e1cf 1px, transparent 1px, transparent 2px)' }} />
        
        {/* Terminal Header */}
        <div className={`bg-[#000000]/20 border-b ${themeStyles.border} px-4 py-2 flex items-center justify-between relative z-10 transition-colors duration-500`}>
          <div className="flex gap-1.5 group">
            <div className="w-2.5 h-2.5 rounded-full bg-red-500/20 group-hover:bg-red-500 transition-colors" />
            <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/20 group-hover:bg-yellow-500 transition-colors" />
            <div className="w-2.5 h-2.5 rounded-full bg-green-500/20 group-hover:bg-green-500 transition-colors" />
          </div>
          <div className="text-[10px] uppercase tracking-widest opacity-50 flex items-center gap-2 relative">
            <TerminalIcon size={12} className={themeStyles.accentText} /> 
            <span className="after:content-[''] hover:after:content-['tty-ERR'] transition-all">tty — 128x64</span>
          </div>
          <div className="flex items-center gap-3 opacity-30">
             <Cpu size={10} /> <Globe size={10} /> <Database size={10} />
          </div>
        </div>

        {/* Content */}
        <div ref={scrollRef} className="p-6 h-[75vh] overflow-y-auto space-y-1 text-[13px] relative z-10 scrollbar-none">
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
      
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="fixed bottom-12 left-1/2 -translate-x-1/2 flex items-center gap-6"
      >
        <button onClick={() => router.push('/')} className={`flex items-center gap-2 text-[10px] uppercase tracking-widest hover:${themeStyles.accentText} transition-colors group`}>
          <Home size={10} className="group-hover:-translate-y-0.5 transition-transform" /> Exit to HQ
        </button>
        <span className="opacity-20">/</span>
        <button onClick={() => setInput('ghost')} className={`flex items-center gap-2 text-[10px] uppercase tracking-widest hover:${themeStyles.accentText} transition-colors group`}>
          <Zap size={10} className="group-hover:scale-125 transition-transform" /> Call Ghost
        </button>
      </motion.div>
    </div>
  );
}
