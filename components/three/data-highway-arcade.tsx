'use client';

import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { Play, RotateCcw, Shield, Award, Zap, X } from 'lucide-react';
import { soundEngine } from '@/lib/audio';
import { gameEngine } from '@/lib/game-engine';

interface DataHighwayArcadeProps {
  onClose?: () => void;
  locale?: 'en' | 'id';
}

interface PacketItem {
  mesh: THREE.Mesh;
  type: 'green' | 'gold' | 'red';
  lane: number;
  z: number;
  speed: number;
  rotationSpeed: { x: number; y: number };
}

export function DataHighwayArcade({ onClose, locale = 'en' }: DataHighwayArcadeProps) {
  const isID = locale === 'id';
  const mountRef = useRef<HTMLDivElement>(null);

  const [isPlaying, setIsPlaying] = useState(false);
  const [isGameOver, setIsGameOver] = useState(false);
  const [score, setScore] = useState(0);
  const [combo, setCombo] = useState(1);
  const [shields, setShields] = useState(3);
  const [timeLeft, setTimeLeft] = useState(30);
  const [highScore, setHighScore] = useState(0);

  const gameStateRef = useRef({
    isPlaying: false,
    score: 0,
    combo: 1,
    shields: 3,
    lane: 0, // -1 (left), 0 (center), 1 (right)
    targetLane: 0,
  });

  useEffect(() => {
    const saved = localStorage.getItem('nichsedge_highway_highscore');
    if (saved) setHighScore(parseInt(saved, 10) || 0);
  }, []);

  useEffect(() => {
    gameStateRef.current.isPlaying = isPlaying;
    gameStateRef.current.score = score;
    gameStateRef.current.combo = combo;
    gameStateRef.current.shields = shields;
  }, [isPlaying, score, combo, shields]);

  // Three.js Game Engine Lifecycle
  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    const width = container.clientWidth || 600;
    const height = container.clientHeight || 400;

    // Scene, Camera, Renderer
    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x09090b, 0.025);

    const camera = new THREE.PerspectiveCamera(60, width / height, 0.1, 100);
    camera.position.set(0, 3.2, 5.5);
    camera.lookAt(0, 0.5, -6);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    container.appendChild(renderer.domElement);

    // Lights
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.8);
    scene.add(ambientLight);

    const dirLight = new THREE.DirectionalLight(0x00e1cf, 2.5);
    dirLight.position.set(0, 10, 5);
    scene.add(dirLight);

    // 3D Grid Highway Floor
    const gridHelper = new THREE.GridHelper(80, 40, 0x00e1cf, 0x1e293b);
    gridHelper.position.set(0, -0.5, -25);
    scene.add(gridHelper);

    // Lane markers
    const laneX = [-2.2, 0, 2.2];
    const laneLinesGeo = new THREE.BufferGeometry();
    const laneLinesPos: number[] = [];
    [-3.3, -1.1, 1.1, 3.3].forEach(x => {
      laneLinesPos.push(x, -0.48, 5, x, -0.48, -50);
    });
    laneLinesGeo.setAttribute('position', new THREE.Float32BufferAttribute(laneLinesPos, 3));
    const laneLinesMat = new THREE.LineBasicMaterial({ color: 0x00e1cf, transparent: true, opacity: 0.3 });
    const laneLines = new THREE.LineSegments(laneLinesGeo, laneLinesMat);
    scene.add(laneLines);

    // Drone / Ship Mesh
    const droneGroup = new THREE.Group();
    const shipGeo = new THREE.ConeGeometry(0.5, 1.2, 4);
    shipGeo.rotateX(Math.PI / 2);
    const shipMat = new THREE.MeshStandardMaterial({ 
      color: 0x00e1cf, 
      roughness: 0.2, 
      metalness: 0.8,
      emissive: 0x00554c,
      emissiveIntensity: 0.6
    });
    const shipMesh = new THREE.Mesh(shipGeo, shipMat);
    droneGroup.add(shipMesh);

    // Thruster light
    const thrusterGeo = new THREE.SphereGeometry(0.18, 8, 8);
    const thrusterMat = new THREE.MeshBasicMaterial({ color: 0x38bdf8 });
    const thrusterMesh = new THREE.Mesh(thrusterGeo, thrusterMat);
    thrusterMesh.position.set(0, 0, 0.6);
    droneGroup.add(thrusterMesh);

    droneGroup.position.set(0, 0, 0);
    scene.add(droneGroup);

    // Starfield Background
    const starCount = 300;
    const starGeo = new THREE.BufferGeometry();
    const starPositions: number[] = [];
    for (let i = 0; i < starCount; i++) {
      starPositions.push(
        (Math.random() - 0.5) * 60,
        Math.random() * 20,
        -Math.random() * 60
      );
    }
    starGeo.setAttribute('position', new THREE.Float32BufferAttribute(starPositions, 3));
    const starMat = new THREE.PointsMaterial({ color: 0xa1a1aa, size: 0.15, transparent: true, opacity: 0.6 });
    const starPoints = new THREE.Points(starGeo, starMat);
    scene.add(starPoints);

    // Geometries & Materials for Packets
    const greenGeo = new THREE.BoxGeometry(0.7, 0.7, 0.7);
    const greenMat = new THREE.MeshStandardMaterial({ color: 0x00e1cf, emissive: 0x00a89a, emissiveIntensity: 0.6, metalness: 0.5 });

    const goldGeo = new THREE.OctahedronGeometry(0.55);
    const goldMat = new THREE.MeshStandardMaterial({ color: 0xf59e0b, emissive: 0xd97706, emissiveIntensity: 0.8, metalness: 0.8 });

    const redGeo = new THREE.IcosahedronGeometry(0.6);
    const redMat = new THREE.MeshStandardMaterial({ color: 0xef4444, emissive: 0xb91c1c, emissiveIntensity: 0.8, wireframe: true });

    const packets: PacketItem[] = [];

    // Spawn Packet Helper
    const spawnPacket = () => {
      if (!gameStateRef.current.isPlaying) return;
      const laneIdx = Math.floor(Math.random() * 3);
      const rand = Math.random();
      let type: 'green' | 'gold' | 'red' = 'green';
      let mesh: THREE.Mesh;

      if (rand > 0.75) {
        type = 'red';
        mesh = new THREE.Mesh(redGeo, redMat);
      } else if (rand > 0.55) {
        type = 'gold';
        mesh = new THREE.Mesh(goldGeo, goldMat);
      } else {
        type = 'green';
        mesh = new THREE.Mesh(greenGeo, greenMat);
      }

      mesh.position.set(laneX[laneIdx], 0, -45);
      scene.add(mesh);

      packets.push({
        mesh,
        type,
        lane: laneIdx - 1, // -1, 0, 1
        z: -45,
        speed: 0.45 + Math.random() * 0.15,
        rotationSpeed: { x: (Math.random() - 0.5) * 0.05, y: (Math.random() - 0.5) * 0.05 }
      });
    };

    let spawnInterval: ReturnType<typeof setInterval>;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (!gameStateRef.current.isPlaying) return;
      if (e.key === 'ArrowLeft' || e.key === 'a' || e.key === 'A') {
        gameStateRef.current.targetLane = Math.max(-1, gameStateRef.current.targetLane - 1);
        soundEngine.playClick(1100, 0.02);
      } else if (e.key === 'ArrowRight' || e.key === 'd' || e.key === 'D') {
        gameStateRef.current.targetLane = Math.min(1, gameStateRef.current.targetLane + 1);
        soundEngine.playClick(1100, 0.02);
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    // Animation Loop
    let animationId: number;
    const animate = () => {
      animationId = requestAnimationFrame(animate);

      // Grid scrolling illusion
      gridHelper.position.z += 0.3;
      if (gridHelper.position.z > -15) {
        gridHelper.position.z = -25;
      }

      // Smooth drone lerping across lanes
      const targetX = laneX[gameStateRef.current.targetLane + 1];
      droneGroup.position.x += (targetX - droneGroup.position.x) * 0.2;
      droneGroup.rotation.z = -(targetX - droneGroup.position.x) * 0.25;

      // Update Packets
      for (let i = packets.length - 1; i >= 0; i--) {
        const p = packets[i];
        p.z += p.speed;
        p.mesh.position.z = p.z;
        p.mesh.rotation.x += p.rotationSpeed.x;
        p.mesh.rotation.y += p.rotationSpeed.y;

        // Collision detection with drone at z ~ 0
        if (p.z >= -0.8 && p.z <= 0.8) {
          const droneLane = gameStateRef.current.targetLane;
          if (p.lane === droneLane) {
            // Hit!
            scene.remove(p.mesh);
            packets.splice(i, 1);

            if (p.type === 'green') {
              soundEngine.playNodeConnect();
              setScore(s => s + 100 * gameStateRef.current.combo);
              setCombo(c => Math.min(4, c + 1));
            } else if (p.type === 'gold') {
              soundEngine.playSuccessChord();
              setScore(s => s + 250 * gameStateRef.current.combo);
              setCombo(c => Math.min(4, c + 1));
            } else if (p.type === 'red') {
              soundEngine.playGlitch();
              setCombo(1);
              setShields(sh => {
                const nextSh = sh - 1;
                if (nextSh <= 0) {
                  // Game Over
                  setIsPlaying(false);
                  setIsGameOver(true);
                }
                return Math.max(0, nextSh);
              });
            }
            continue;
          }
        }

        // Clean up passed packets
        if (p.z > 6) {
          scene.remove(p.mesh);
          packets.splice(i, 1);
        }
      }

      renderer.render(scene, camera);
    };

    animate();

    const handleResize = () => {
      if (!container) return;
      const w = container.clientWidth;
      const h = container.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };

    window.addEventListener('resize', handleResize);

    // Spawn ticker when playing
    if (isPlaying) {
      spawnInterval = setInterval(spawnPacket, 400);
    }

    return () => {
      clearInterval(spawnInterval);
      cancelAnimationFrame(animationId);
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('resize', handleResize);
      packets.forEach(p => scene.remove(p.mesh));
      greenGeo.dispose();
      goldGeo.dispose();
      redGeo.dispose();
      shipGeo.dispose();
      gridHelper.dispose();
      laneLinesGeo.dispose();
      starGeo.dispose();
      renderer.dispose();
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
    };
  }, [isPlaying]);

  // 30s Game Timer
  useEffect(() => {
    if (!isPlaying) return;
    const timer = setInterval(() => {
      setTimeLeft(t => {
        if (t <= 1) {
          setIsPlaying(false);
          setIsGameOver(true);
          return 0;
        }
        return t - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [isPlaying]);

  // End Game Evaluation & XP Dispatch
  useEffect(() => {
    if (isGameOver) {
      soundEngine.playSuccessChord();
      if (score > highScore) {
        setHighScore(score);
        localStorage.setItem('nichsedge_highway_highscore', score.toString());
      }
      if (score >= 500) {
        gameEngine.completeQuest('highway_arcade');
        gameEngine.unlockBadge('highway_pilot');
      }
    }
  }, [isGameOver, score, highScore]);

  const startGame = () => {
    soundEngine.playSqlExecute();
    setScore(0);
    setCombo(1);
    setShields(3);
    setTimeLeft(30);
    setIsGameOver(false);
    setIsPlaying(true);
    gameStateRef.current.targetLane = 0;
  };

  return (
    <div className="relative w-full h-[420px] sm:h-[480px] bg-[#09090b] border border-border-subtle rounded-lg overflow-hidden font-mono select-none">
      {/* 3D WebGL Canvas */}
      <div ref={mountRef} className="absolute inset-0 w-full h-full cursor-grab active:cursor-grabbing" />

      {/* Top HUD Overlay */}
      <div className="absolute top-3 left-3 right-3 flex items-center justify-between pointer-events-none z-10 text-xs">
        <div className="flex items-center gap-3">
          <div className="bg-bg/80 border border-border-subtle backdrop-blur-md px-3 py-1 rounded-sm flex items-center gap-2">
            <span className="text-accent font-bold">SCORE:</span>
            <span className="text-text-0 font-bold">{score}</span>
          </div>

          <div className="bg-bg/80 border border-border-subtle backdrop-blur-md px-2.5 py-1 rounded-sm flex items-center gap-1.5 text-accent font-bold">
            <Zap size={13} />
            <span>x{combo}</span>
          </div>
        </div>

        <div className="flex items-center gap-3 pointer-events-auto">
          {/* Buffer Shields */}
          <div className="bg-bg/80 border border-border-subtle backdrop-blur-md px-2.5 py-1 rounded-sm flex items-center gap-1.5">
            <Shield size={13} className={shields <= 1 ? 'text-red-400 animate-pulse' : 'text-accent'} />
            <div className="flex gap-1">
              {[1, 2, 3].map(s => (
                <div 
                  key={s} 
                  className={`w-2 h-2 rounded-full ${s <= shields ? 'bg-accent shadow-[0_0_8px_rgba(0,225,207,0.8)]' : 'bg-border-subtle'}`} 
                />
              ))}
            </div>
          </div>

          {/* Time Left */}
          <div className={`bg-bg/80 border backdrop-blur-md px-3 py-1 rounded-sm font-bold ${timeLeft <= 5 ? 'border-red-500 text-red-400 animate-ping' : 'border-border-subtle text-text-0'}`}>
            {timeLeft}s
          </div>

          {onClose && (
            <button 
              onClick={onClose}
              className="p-1 bg-bg/80 border border-border-subtle hover:border-accent text-text-3 hover:text-text-0 rounded-sm"
            >
              <X size={15} />
            </button>
          )}
        </div>
      </div>

      {/* Touch / Click Lane Controls for Mobile */}
      {isPlaying && (
        <div className="absolute bottom-3 left-3 right-3 flex gap-2 z-10 sm:hidden">
          <button 
            onClick={() => {
              gameStateRef.current.targetLane = Math.max(-1, gameStateRef.current.targetLane - 1);
              soundEngine.playClick(1100, 0.02);
            }}
            className="flex-1 py-3 bg-bg-1/80 border border-border-subtle active:border-accent text-accent font-bold rounded"
          >
            ← LEFT
          </button>
          <button 
            onClick={() => {
              gameStateRef.current.targetLane = Math.min(1, gameStateRef.current.targetLane + 1);
              soundEngine.playClick(1100, 0.02);
            }}
            className="flex-1 py-3 bg-bg-1/80 border border-border-subtle active:border-accent text-accent font-bold rounded"
          >
            RIGHT →
          </button>
        </div>
      )}

      {/* Start / Game Over Splash Screen */}
      {(!isPlaying || isGameOver) && (
        <div className="absolute inset-0 z-20 flex flex-col items-center justify-center p-6 bg-black/75 backdrop-blur-md text-center">
          <div className="max-w-md space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent/10 border border-accent/30 text-accent text-[10px] uppercase tracking-widest font-bold">
              <Award size={14} />
              {isID ? '3D MINIGAME DATA STREAM' : '3D DATA STREAM ARCADE'}
            </div>

            <h2 className="text-2xl sm:text-3xl font-bold text-text-0 tracking-tight">
              {isGameOver 
                ? (score >= 500 ? (isID ? 'MISI BERHASIL!' : 'STREAM DEFENDED!') : (isID ? 'STREAM OVERLOAD' : 'BUFFER EXHAUSTED'))
                : (isID ? '3D DATA HIGHWAY' : 'THE DATA HIGHWAY')}
            </h2>

            <p className="text-xs text-text-3 leading-relaxed">
              {isGameOver ? (
                isID 
                  ? `Skor Akhir: ${score} poin. ${score >= 500 ? 'Misi Taklukkan 3D Data Highway Selesai (+200 XP)!' : 'Coba lagi untuk mencapai 500+ poin.'}`
                  : `Final Score: ${score} pts. ${score >= 500 ? 'Quest cleared: Survive 3D Data Highway (+200 XP)!' : 'Target: 500+ pts to clear the quest.'}`
              ) : (
                isID 
                  ? 'Kendalikan drone transmisi data dengan tombol [A] / [D] atau [←] / [→]. Tangkap balok hijau (+100) dan diamond emas (+250), hindari error merah!'
                  : 'Steer the transmission collector with [A] / [D] or [←] / [→]. Ingest green schema blocks (+100), golden batches (+250), and avoid red corrupt null-spikes!'
              )}
            </p>

            {highScore > 0 && (
              <div className="text-[10px] text-accent/80 font-bold uppercase tracking-wider">
                {isID ? `Rekor Tertinggi: ${highScore} Poin` : `All-Time High Score: ${highScore} Pts`}
              </div>
            )}

            <div className="pt-2 flex justify-center gap-3">
              <button
                onClick={startGame}
                className="px-6 py-2.5 bg-accent hover:bg-white text-bg font-bold text-xs uppercase tracking-widest rounded-sm transition-all shadow-[0_0_20px_rgba(0,225,207,0.4)] flex items-center gap-2 cursor-pointer"
              >
                {isGameOver ? <RotateCcw size={14} /> : <Play size={14} />}
                <span>{isGameOver ? (isID ? 'MAIN LAGI' : 'RETRY') : (isID ? 'MULAI INGEST' : 'START INGESTION')}</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
