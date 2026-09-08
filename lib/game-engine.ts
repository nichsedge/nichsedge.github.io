'use client';

import { useState, useEffect } from 'react';
import { soundEngine } from '@/lib/audio';

export interface Quest {
  id: string;
  title: string;
  titleId: string;
  description: string;
  descriptionId: string;
  xp: number;
  category: 'system' | 'architecture' | 'sql' | 'terminal';
}

export interface Badge {
  id: string;
  title: string;
  description: string;
  icon: string;
}

export const INITIAL_QUESTS: Quest[] = [
  {
    id: 'boot_audio',
    title: 'Initialize Audio Synthesizer',
    titleId: 'Inisialisasi Synthesizer Audio',
    description: 'Enable audio feedback via the Game HUD for tactile acoustic telemetry.',
    descriptionId: 'Aktifkan umpan balik audio melalui HUD Game untuk telemetri akustik.',
    xp: 50,
    category: 'system'
  },
  {
    id: 'calibrate_pipeline',
    title: 'Calibrate ETL Topology',
    titleId: 'Kalibrasi Topologi ETL',
    description: 'Toggle node connections or test backpressure in the Architecture DAG.',
    descriptionId: 'Ubah koneksi node atau uji backpressure pada DAG Arsitektur.',
    xp: 150,
    category: 'architecture'
  },
  {
    id: 'execute_query',
    title: 'Query the Data Lake',
    titleId: 'Kueri Data Lake',
    description: 'Run any SQL query in the Interactive SQL Workbench.',
    descriptionId: 'Jalankan kueri SQL di Interactive SQL Workbench.',
    xp: 150,
    category: 'sql'
  },
  {
    id: 'inspect_telemetry',
    title: 'Inspect Live Diagnostics',
    titleId: 'Periksa Diagnostik Langsung',
    description: 'Open the Tactical Diagnostic Deck and inspect system telemetry.',
    descriptionId: 'Buka Tactical Diagnostic Deck dan periksa telemetri sistem.',
    xp: 75,
    category: 'system'
  },
  {
    id: 'highway_arcade',
    title: 'Survive 3D Data Highway',
    titleId: 'Taklukkan 3D Data Highway',
    description: 'Play the 3D Data Highway minigame, catch clean data packets and dodge null-spikes.',
    descriptionId: 'Mainkan minigame 3D Data Highway, tangkap paket data bersih dan hindari error.',
    xp: 200,
    category: 'architecture'
  },
  {
    id: 'server_failover',
    title: 'Mitigate 3D Cluster Outage',
    titleId: 'Atasi Gangguan Cluster 3D',
    description: 'Inspect 3D blade servers and resolve regional outage failover.',
    descriptionId: 'Periksa server blade 3D dan pulihkan sistem dari gangguan failover.',
    xp: 150,
    category: 'architecture'
  },
  {
    id: 'constellation_galaxy',
    title: 'Chart 3D Knowledge Galaxy',
    titleId: 'Jelajahi Galaksi Skill 3D',
    description: 'Explore the 3D celestial tech cluster and inspect skills.',
    descriptionId: 'Jelajahi kluster skill 3D luar angkasa dan periksa teknologi.',
    xp: 75,
    category: 'system'
  },
  {
    id: 'laser_router',
    title: 'Construct 3D Laser Pipeline',
    titleId: 'Rangkai Pipeline Laser 3D',
    description: 'Route 3D laser data lines and trigger photon stream pulses.',
    descriptionId: 'Hubungkan jalur data laser 3D dan aktifkan pulsa energi foton.',
    xp: 150,
    category: 'architecture'
  },
  {
    id: 'terminal_access',
    title: 'Establish Terminal Link',
    titleId: 'Akses Terminal Sistem',
    description: 'Open the Command Palette (Cmd/Ctrl+K) or visit the System Terminal.',
    descriptionId: 'Buka Command Palette (Cmd/Ctrl+K) atau kunjungi Terminal Sistem.',
    xp: 200,
    category: 'terminal'
  }
];

export const BADGES: Badge[] = [
  {
    id: 'cadet_onboarded',
    title: 'System Operator',
    description: 'Initiated first telemetry sync',
    icon: '⚡'
  },
  {
    id: 'highway_pilot',
    title: 'Stream Ace',
    description: 'Piloted the high-throughput 3D Data Highway',
    icon: '🏎️'
  },
  {
    id: 'failover_hero',
    title: 'Chaos Commander',
    description: 'Mastered 3D cluster failover and high availability',
    icon: '🛡️'
  },
  {
    id: 'celestial_stargazer',
    title: 'Knowledge Stargazer',
    description: 'Navigated the 3D celestial technology cosmos',
    icon: '🌌'
  },
  {
    id: 'laser_master',
    title: 'Photonic Architect',
    description: 'Constructed an ultra-low latency 3D laser pipeline',
    icon: '💡'
  },
  {
    id: 'pipeline_engineer',
    title: 'Pipeline Architect',
    description: 'Successfully reconfigured stream topologies',
    icon: '⚙️'
  },
  {
    id: 'sql_ninja',
    title: 'Query Optimizer',
    description: 'Scanned petabyte-scale warehouse partitions',
    icon: '🔍'
  },
  {
    id: 'root_master',
    title: 'Principal Architect',
    description: 'Reached top system security clearance (Level 4)',
    icon: '👑'
  }
];

export interface TelemetryConfig {
  metrics: boolean;
  stream: boolean;
  routing: boolean;
  allocator: boolean;
  monitor: boolean;
}

export interface GameState {
  xp: number;
  level: number;
  title: string;
  audioEnabled: boolean;
  telemetry: TelemetryConfig;
  completedQuests: string[];
  unlockedBadges: string[];
  notification: {
    id: number;
    message: string;
    xp?: number;
    type: 'quest' | 'level' | 'badge';
  } | null;
}

const STORAGE_KEY = 'nichsedge_game_v1';

function getRank(xp: number): { level: number; title: string } {
  if (xp >= 900) return { level: 4, title: 'Principal Architect' };
  if (xp >= 500) return { level: 3, title: 'Stream Architect' };
  if (xp >= 200) return { level: 2, title: 'Pipeline Wrangler' };
  return { level: 1, title: 'Data Cadet' };
}

export function getXpForNextLevel(level: number): number {
  switch (level) {
    case 1: return 200;
    case 2: return 500;
    case 3: return 900;
    default: return 1200;
  }
}

class GameEngine {
  private state: GameState = {
    xp: 0,
    level: 1,
    title: 'Data Cadet',
    audioEnabled: false,
    telemetry: {
      metrics: false,
      stream: false,
      routing: false,
      allocator: false,
      monitor: false,
    },
    completedQuests: [],
    unlockedBadges: [],
    notification: null,
  };

  private listeners: Set<(state: GameState) => void> = new Set();
  private notificationTimeout: ReturnType<typeof setTimeout> | null = null;

  constructor() {
    if (typeof window !== 'undefined') {
      try {
        const saved = localStorage.getItem(STORAGE_KEY);
        if (saved) {
          const parsed = JSON.parse(saved);
          const rank = getRank(parsed.xp || 0);
          this.state = {
            ...this.state,
            ...parsed,
            level: rank.level,
            title: rank.title,
            audioEnabled: !soundEngine.getIsMuted(),
            notification: null,
          };
        } else {
          this.state.audioEnabled = !soundEngine.getIsMuted();
        }
      } catch {
        // Fallback gracefully
      }
    }
  }

  private save() {
    if (typeof window !== 'undefined') {
      try {
        const dataToSave = {
          xp: this.state.xp,
          completedQuests: this.state.completedQuests,
          unlockedBadges: this.state.unlockedBadges,
          telemetry: this.state.telemetry,
        };
        localStorage.setItem(STORAGE_KEY, JSON.stringify(dataToSave));
      } catch {
        // LocalStorage fallback
      }
    }
    this.notify();
  }

  private notify() {
    this.listeners.forEach(fn => fn({ ...this.state }));
  }

  public getState(): GameState {
    return { ...this.state };
  }

  public subscribe(listener: (state: GameState) => void): () => void {
    this.listeners.add(listener);
    listener({ ...this.state });
    return () => {
      this.listeners.delete(listener);
    };
  }

  public triggerNotification(message: string, type: 'quest' | 'level' | 'badge', xp?: number) {
    if (this.notificationTimeout) {
      clearTimeout(this.notificationTimeout);
    }
    this.state.notification = {
      id: Date.now(),
      message,
      type,
      xp
    };
    this.notify();

    this.notificationTimeout = setTimeout(() => {
      this.state.notification = null;
      this.notify();
    }, 4000);
  }

  public addXp(amount: number, reason?: string) {
    const prevLevel = this.state.level;
    const newXp = this.state.xp + amount;
    const rank = getRank(newXp);

    this.state.xp = newXp;
    this.state.level = rank.level;
    this.state.title = rank.title;

    if (rank.level > prevLevel) {
      soundEngine.playSuccessChord();
      this.triggerNotification(`PROMOTION: Level ${rank.level} — ${rank.title}!`, 'level');
      if (rank.level === 4 && !this.state.unlockedBadges.includes('root_master')) {
        this.unlockBadge('root_master');
      }
    } else if (reason) {
      soundEngine.playChime(660, 0.2);
      this.triggerNotification(reason, 'quest', amount);
    }

    this.save();
  }

  public completeQuest(questId: string) {
    if (this.state.completedQuests.includes(questId)) return;

    const quest = INITIAL_QUESTS.find(q => q.id === questId);
    if (!quest) return;

    this.state.completedQuests.push(questId);
    
    // Check corresponding badges
    if (questId === 'calibrate_pipeline') {
      this.unlockBadge('pipeline_engineer');
    } else if (questId === 'execute_query') {
      this.unlockBadge('sql_ninja');
    } else if (this.state.completedQuests.length === 1) {
      this.unlockBadge('cadet_onboarded');
    }

    this.addXp(quest.xp, `COMPLETED: ${quest.title}`);
  }

  public unlockBadge(badgeId: string) {
    if (this.state.unlockedBadges.includes(badgeId)) return;
    const badge = BADGES.find(b => b.id === badgeId);
    if (!badge) return;

    this.state.unlockedBadges.push(badgeId);
    soundEngine.playSuccessChord();
    this.triggerNotification(`BADGE UNLOCKED: ${badge.icon} ${badge.title}`, 'badge');
    this.save();
  }

  public toggleAudio(): boolean {
    const isNowActive = soundEngine.toggleAudio();
    this.state.audioEnabled = isNowActive;
    if (isNowActive && !this.state.completedQuests.includes('boot_audio')) {
      this.completeQuest('boot_audio');
    }
    this.save();
    return isNowActive;
  }

  public toggleTelemetry(key: keyof TelemetryConfig) {
    soundEngine.playClick(900, 0.03);
    this.state.telemetry = {
      ...this.state.telemetry,
      [key]: !this.state.telemetry[key]
    };
    if (!this.state.completedQuests.includes('inspect_telemetry')) {
      this.completeQuest('inspect_telemetry');
    }
    this.save();
  }

  public resetProgress() {
    this.state.xp = 0;
    this.state.level = 1;
    this.state.title = 'Data Cadet';
    this.state.completedQuests = [];
    this.state.unlockedBadges = [];
    this.state.telemetry = {
      metrics: false,
      stream: false,
      routing: false,
      allocator: false,
      monitor: false,
    };
    if (typeof window !== 'undefined') {
      localStorage.removeItem(STORAGE_KEY);
    }
    soundEngine.playGlitch();
    this.triggerNotification('SYSTEM REBOOT: Progress reset', 'quest');
    this.notify();
  }
}

export const gameEngine = new GameEngine();

export const DEFAULT_GAME_STATE: GameState = {
  xp: 0,
  level: 1,
  title: 'Data Cadet',
  audioEnabled: false,
  telemetry: {
    metrics: false,
    stream: false,
    routing: false,
    allocator: false,
    monitor: false,
  },
  completedQuests: [],
  unlockedBadges: [],
  notification: null,
};

export function useGameState(): GameState {
  const [state, setState] = useState<GameState>(DEFAULT_GAME_STATE);

  useEffect(() => {
    setState(gameEngine.getState());
    return gameEngine.subscribe(setState);
  }, []);

  return state;
}
