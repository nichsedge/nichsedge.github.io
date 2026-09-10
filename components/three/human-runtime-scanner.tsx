'use client';

import React, { useEffect, useRef, useState, useCallback } from 'react';
import { createPortal } from 'react-dom';
import * as THREE from 'three';
import { 
  Scan, 
  RotateCcw, 
  Shield, 
  Cpu, 
  Flame, 
  Coffee, 
  Activity, 
  Volume2, 
  VolumeX, 
  Maximize2, 
  Minimize2, 
  Sparkles,
  Zap,
  Mic,
  Circle,
  Terminal,
  Brain,
  LineChart,
  BookOpen,
  ChevronDown,
  ChevronUp,
  X
} from 'lucide-react';
import { soundEngine } from '@/lib/audio';

export type SubsystemId = 'overview' | 'sensory' | 'fuel' | 'compute' | 'multiplayer';
export type FuelTestType = 'clean' | 'caffeine' | 'capsaicin';
export type MultiplayerSubroutine = 'futsal' | 'karaoke' | 'tennis';
export type ComputeThreadId = 'vibe' | 'philosophy' | 'finance' | 'literature';

interface HumanRuntimeScannerProps {
  locale?: 'en' | 'id';
  activeSubsystem?: SubsystemId;
  onSubsystemChange?: (subsystem: SubsystemId) => void;
  sensoryShieldEngaged?: boolean;
  onToggleSensoryShield?: () => void;
  externalFuelTrigger?: FuelTestType | null;
  externalMultiplayerTrigger?: MultiplayerSubroutine | null;
  externalComputeTrigger?: ComputeThreadId | null;
}

export function HumanRuntimeScanner({
  locale = 'en',
  activeSubsystem: controlledSubsystem,
  onSubsystemChange,
  sensoryShieldEngaged = false,
  onToggleSensoryShield,
  externalFuelTrigger = null,
  externalMultiplayerTrigger = null,
  externalComputeTrigger = null,
}: HumanRuntimeScannerProps) {
  const isID = locale === 'id';
  const mountRef = useRef<HTMLDivElement>(null);

  // Viewport Control States (Minimize / Maximize)
  const [mounted, setMounted] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);

  // Subsystem States
  const [currentSubsystem, setCurrentSubsystem] = useState<SubsystemId>(controlledSubsystem || 'overview');
  const [fuelMode, setFuelMode] = useState<FuelTestType>('clean');
  const [multiplayerMode, setMultiplayerMode] = useState<MultiplayerSubroutine>('futsal');
  const [computeMode, setComputeMode] = useState<ComputeThreadId>('vibe');
  const [isShieldActive, setIsShieldActive] = useState<boolean>(sensoryShieldEngaged);
  const [telemetryValues, setTelemetryValues] = useState({
    heartbeat: 72,
    temp: 36.8,
    attenuation: -48.2,
    threads: 4,
    status: 'OPTIMAL'
  });

  // Keep references for animation loop
  const stateRef = useRef({
    subsystem: currentSubsystem,
    fuelMode,
    multiplayerMode,
    computeMode,
    coreOverclock: [0, 0, 0, 0],
    isShieldActive,
    cameraTargetPos: new THREE.Vector3(0, 0.2, 6.8),
    cameraTargetLookAt: new THREE.Vector3(0, 0, 0),
    rotationY: 0,
    targetRotationY: 0,
    rotationX: 0,
    targetRotationX: 0,
    isDragging: false,
    lastMouseX: 0,
    lastMouseY: 0,
    time: 0,
    thermalSpike: 0,
    caffeineOverclock: 0,
  });

  useEffect(() => {
    setMounted(true);
  }, []);

  // Lock scroll & handle ESC key when in Fullscreen
  useEffect(() => {
    if (isFullscreen) {
      const originalOverflow = document.body.style.overflow;
      document.body.style.overflow = 'hidden';

      const handleKeyDown = (e: KeyboardEvent) => {
        if (e.key === 'Escape') {
          setIsFullscreen(false);
          soundEngine.playClick(400, 0.05);
        }
      };
      window.addEventListener('keydown', handleKeyDown);

      return () => {
        document.body.style.overflow = originalOverflow;
        window.removeEventListener('keydown', handleKeyDown);
      };
    }
  }, [isFullscreen]);

  const handleSubsystemSelect = useCallback((id: SubsystemId) => {
    setCurrentSubsystem(id);
    if (onSubsystemChange) {
      onSubsystemChange(id);
    }
    soundEngine.playClick(900, 0.05);

    switch (id) {
      case 'sensory':
        stateRef.current.cameraTargetPos.set(0, 1.85, 3.4);
        stateRef.current.cameraTargetLookAt.set(0, 1.8, 0);
        break;
      case 'compute':
        stateRef.current.cameraTargetPos.set(0, 0.72, 3.0);
        stateRef.current.cameraTargetLookAt.set(0, 0.72, 0);
        break;
      case 'fuel':
        stateRef.current.cameraTargetPos.set(0, -0.3, 3.2);
        stateRef.current.cameraTargetLookAt.set(0, -0.35, 0);
        break;
      case 'multiplayer':
        stateRef.current.cameraTargetPos.set(0, -1.0, 4.4);
        stateRef.current.cameraTargetLookAt.set(0, -0.85, 0);
        break;
      case 'overview':
      default:
        stateRef.current.cameraTargetPos.set(0, 0.2, 6.8);
        stateRef.current.cameraTargetLookAt.set(0, 0, 0);
        break;
    }
  }, [onSubsystemChange]);

  const handleComputeSelect = (core: ComputeThreadId) => {
    setComputeMode(core);
    handleSubsystemSelect('compute');

    const coreIdx = core === 'vibe' ? 0 : core === 'philosophy' ? 1 : core === 'finance' ? 2 : 3;
    stateRef.current.coreOverclock[coreIdx] = 2.5;

    if (core === 'vibe') {
      soundEngine.playSqlExecute();
    } else if (core === 'philosophy') {
      soundEngine.playChime(360, 0.4);
    } else if (core === 'finance') {
      soundEngine.playNodeConnect();
    } else {
      soundEngine.playClick(1000, 0.08);
    }
  };

  // Sync external props
  useEffect(() => {
    if (controlledSubsystem && controlledSubsystem !== currentSubsystem) {
      setCurrentSubsystem(controlledSubsystem);
    }
  }, [controlledSubsystem, currentSubsystem]);

  useEffect(() => {
    setIsShieldActive(sensoryShieldEngaged);
  }, [sensoryShieldEngaged]);

  useEffect(() => {
    if (externalFuelTrigger) {
      setFuelMode(externalFuelTrigger);
    }
  }, [externalFuelTrigger]);

  useEffect(() => {
    if (externalMultiplayerTrigger) {
      setMultiplayerMode(externalMultiplayerTrigger);
      handleSubsystemSelect('multiplayer');
    }
  }, [externalMultiplayerTrigger, handleSubsystemSelect]);

  useEffect(() => {
    if (externalComputeTrigger) {
      handleComputeSelect(externalComputeTrigger);
    }
  }, [externalComputeTrigger]);

  const handleFuelSelect = (type: FuelTestType) => {
    setFuelMode(type);
    if (type === 'caffeine') {
      soundEngine.playSqlExecute();
      stateRef.current.caffeineOverclock = 1.0;
    } else if (type === 'capsaicin') {
      soundEngine.playGlitch();
      stateRef.current.thermalSpike = 1.0;
    } else {
      soundEngine.playChime(440, 0.2);
    }
  };

  const handleMultiplayerSelect = (mode: MultiplayerSubroutine) => {
    setMultiplayerMode(mode);
    if (mode === 'futsal') {
      soundEngine.playNodeConnect();
      stateRef.current.cameraTargetPos.set(0.3, -1.3, 3.8);
      stateRef.current.cameraTargetLookAt.set(0.3, -1.6, 0);
    } else if (mode === 'karaoke') {
      soundEngine.playChime(660, 0.3);
      stateRef.current.cameraTargetPos.set(0, 1.7, 3.2);
      stateRef.current.cameraTargetLookAt.set(0, 1.7, 0);
    } else if (mode === 'tennis') {
      soundEngine.playGlitch();
      stateRef.current.cameraTargetPos.set(-0.8, -0.5, 4.2);
      stateRef.current.cameraTargetLookAt.set(-0.6, -0.8, 0);
    }
  };

  const handleToggleShield = () => {
    const next = !isShieldActive;
    setIsShieldActive(next);
    if (onToggleSensoryShield) {
      onToggleSensoryShield();
    }
    if (next) {
      soundEngine.playNodeConnect();
    } else {
      soundEngine.playClick(400, 0.05);
    }
  };

  const handleResetCamera = () => {
    handleSubsystemSelect('overview');
    stateRef.current.targetRotationX = 0;
    stateRef.current.targetRotationY = 0;
  };

  // Sync state ref
  useEffect(() => {
    stateRef.current.subsystem = currentSubsystem;
    stateRef.current.fuelMode = fuelMode;
    stateRef.current.multiplayerMode = multiplayerMode;
    stateRef.current.computeMode = computeMode;
    stateRef.current.isShieldActive = isShieldActive;
  }, [currentSubsystem, fuelMode, multiplayerMode, computeMode, isShieldActive]);

  // Telemetry real-time updates
  useEffect(() => {
    const interval = setInterval(() => {
      let baseBpm = 72;
      let baseTemp = 36.8;
      let baseAtten = -48.2;
      let status = 'OPTIMAL';

      if (currentSubsystem === 'compute') {
        if (computeMode === 'vibe') {
          baseBpm = 88 + Math.floor(Math.random() * 8);
          status = 'TURBO_BOOST_94%';
        } else if (computeMode === 'philosophy') {
          baseBpm = 58 + Math.floor(Math.random() * 4);
          status = 'STOIC_EQUILIBRIUM';
        } else if (computeMode === 'finance') {
          baseBpm = 82 + Math.floor(Math.random() * 6);
          status = 'VOLATILITY_HEDGE';
        } else if (computeMode === 'literature') {
          baseBpm = 64 + Math.floor(Math.random() * 4);
          status = 'TOKEN_INGESTION_450WPM';
        }
      } else if (currentSubsystem === 'multiplayer') {
        if (multiplayerMode === 'futsal') {
          baseBpm = 162 + Math.floor(Math.random() * 14);
          status = 'HIGH_CARDIO_MESH';
        } else if (multiplayerMode === 'karaoke') {
          baseBpm = 95 + Math.floor(Math.random() * 8);
          baseAtten = 94.2 + (Math.random() * 4);
          status = 'ACOUSTIC_RESONANCE';
        } else if (multiplayerMode === 'tennis') {
          baseBpm = 128 + Math.floor(Math.random() * 10);
          status = 'BALL_AI_TRAJECTORY_ERR';
        }
      } else {
        if (fuelMode === 'caffeine') {
          baseBpm = 138 + Math.floor(Math.random() * 12);
          status = 'THREAD_LOCKED';
        } else if (fuelMode === 'capsaicin') {
          baseTemp = 86.4 + (Math.random() * 6.2);
          baseBpm = 96 + Math.floor(Math.random() * 8);
          status = 'HEAT_OVERLOAD';
        }

        if (!isShieldActive) {
          baseAtten = -12.4 + (Math.random() * 4);
        } else {
          baseAtten = -89.6 - (Math.random() * 2);
        }
      }

      setTelemetryValues({
        heartbeat: baseBpm,
        temp: Number(baseTemp.toFixed(1)),
        attenuation: Number(baseAtten.toFixed(1)),
        threads: 4,
        status
      });
    }, 800);

    return () => clearInterval(interval);
  }, [currentSubsystem, fuelMode, isShieldActive, multiplayerMode, computeMode]);

  // Three.js Mount & Render Loop (re-attaches cleanly when isFullscreen changes)
  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    let width = container.clientWidth || 600;
    let height = container.clientHeight || 480;

    // 1. Scene, Camera, Renderer
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
    camera.position.copy(stateRef.current.cameraTargetPos);
    camera.lookAt(stateRef.current.cameraTargetLookAt);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: 'high-performance' });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setClearColor(0x000000, 0);
    container.appendChild(renderer.domElement);

    // 2. Hologram Cyber Mannequin Group
    const mannequinGroup = new THREE.Group();
    scene.add(mannequinGroup);

    // Palette
    const cyan = 0x00e1cf;
    const blue = 0x38bdf8;
    const amber = 0xf59e0b;
    const red = 0xef4444;
    const green = 0x10b981;
    const dimLine = 0x27272a;

    // --- A. Head Subsystem ---
    const headGroup = new THREE.Group();
    headGroup.position.set(0, 1.8, 0);

    // Skull wireframe
    const skullGeo = new THREE.IcosahedronGeometry(0.38, 1);
    const skullMat = new THREE.MeshBasicMaterial({
      color: cyan,
      wireframe: true,
      transparent: true,
      opacity: 0.75,
    });
    const skullMesh = new THREE.Mesh(skullGeo, skullMat);
    headGroup.add(skullMesh);

    // Visor optical scanner ring
    const visorGeo = new THREE.TorusGeometry(0.36, 0.015, 12, 32);
    const visorMat = new THREE.MeshBasicMaterial({ color: blue, transparent: true, opacity: 0.9 });
    const visorMesh = new THREE.Mesh(visorGeo, visorMat);
    visorMesh.rotation.x = Math.PI / 2;
    visorMesh.position.y = 0.05;
    headGroup.add(visorMesh);

    // Acoustic Bubble (Sensory Shield)
    const shieldGeo = new THREE.IcosahedronGeometry(0.72, 2);
    const shieldMat = new THREE.MeshBasicMaterial({
      color: cyan,
      wireframe: true,
      transparent: true,
      opacity: 0.15,
    });
    const shieldMesh = new THREE.Mesh(shieldGeo, shieldMat);
    headGroup.add(shieldMesh);

    // Karaoke Acoustic Expanding Ripples
    const karaokeWaveGroup = new THREE.Group();
    const rippleCount = 3;
    const rippleMeshes: THREE.Mesh[] = [];
    for (let r = 0; r < rippleCount; r++) {
      const rGeo = new THREE.RingGeometry(0.2, 0.22, 24);
      const rMat = new THREE.MeshBasicMaterial({ color: cyan, side: THREE.DoubleSide, transparent: true, opacity: 0 });
      const rMesh = new THREE.Mesh(rGeo, rMat);
      rMesh.position.set(0, -0.05, 0.35 + r * 0.2);
      karaokeWaveGroup.add(rMesh);
      rippleMeshes.push(rMesh);
    }
    headGroup.add(karaokeWaveGroup);
    mannequinGroup.add(headGroup);

    // --- B. Cyber Spine ---
    const spineGroup = new THREE.Group();
    const vertebraeCount = 10;
    const vertebraeMeshes: THREE.Mesh[] = [];
    for (let i = 0; i < vertebraeCount; i++) {
      const vGeo = new THREE.CylinderGeometry(0.12 - (i * 0.005), 0.13 - (i * 0.005), 0.06, 6);
      const vMat = new THREE.MeshBasicMaterial({
        color: i % 2 === 0 ? cyan : dimLine,
        wireframe: true,
        transparent: true,
        opacity: 0.65,
      });
      const vMesh = new THREE.Mesh(vGeo, vMat);
      vMesh.position.set(0, 1.35 - (i * 0.16), 0);
      spineGroup.add(vMesh);
      vertebraeMeshes.push(vMesh);
    }
    const busGeo = new THREE.BufferGeometry().setFromPoints([
      new THREE.Vector3(0, 1.4, 0),
      new THREE.Vector3(0, -0.6, 0),
    ]);
    const busMat = new THREE.LineBasicMaterial({ color: cyan, transparent: true, opacity: 0.8 });
    const busLine = new THREE.Line(busGeo, busMat);
    spineGroup.add(busLine);
    mannequinGroup.add(spineGroup);

    // --- C. Chest / Allocated Compute Core ---
    const chestGroup = new THREE.Group();
    chestGroup.position.set(0, 0.72, 0);

    const ribGeo = new THREE.TorusGeometry(0.68, 0.012, 6, 24, Math.PI * 1.2);
    const ribMat = new THREE.MeshBasicMaterial({ color: dimLine, wireframe: false, transparent: true, opacity: 0.5 });
    for (let r = 0; r < 3; r++) {
      const ribMesh = new THREE.Mesh(ribGeo, ribMat);
      ribMesh.rotation.z = Math.PI * 0.4;
      ribMesh.rotation.y = (r - 1) * 0.15;
      ribMesh.position.set(0, 0.15 - (r * 0.18), 0);
      chestGroup.add(ribMesh);
    }

    const coreOrbGeo = new THREE.SphereGeometry(0.14, 16, 16);
    const coreOrbMat = new THREE.MeshBasicMaterial({ color: cyan, wireframe: true, transparent: true, opacity: 0.85 });
    const coreOrb = new THREE.Mesh(coreOrbGeo, coreOrbMat);
    chestGroup.add(coreOrb);

    const threadRings: THREE.Mesh[] = [];
    const threadColors = [cyan, blue, amber, green];
    for (let t = 0; t < 4; t++) {
      const ringGeo = new THREE.TorusGeometry(0.26 + (t * 0.08), 0.008, 8, 32);
      const ringMat = new THREE.MeshBasicMaterial({ color: threadColors[t], transparent: true, opacity: 0.8 });
      const ringMesh = new THREE.Mesh(ringGeo, ringMat);
      ringMesh.rotation.x = Math.PI / (1.5 + t * 0.4);
      ringMesh.rotation.y = (Math.PI / 4) * t;
      chestGroup.add(ringMesh);
      threadRings.push(ringMesh);
    }
    mannequinGroup.add(chestGroup);

    // --- D. Fuel Pipeline / Reactor Chamber ---
    const fuelGroup = new THREE.Group();
    fuelGroup.position.set(0, -0.35, 0);

    const reactorGeo = new THREE.CylinderGeometry(0.24, 0.18, 0.45, 8, 2, true);
    const reactorMat = new THREE.MeshBasicMaterial({
      color: cyan,
      wireframe: true,
      transparent: true,
      opacity: 0.7,
    });
    const reactorMesh = new THREE.Mesh(reactorGeo, reactorMat);
    fuelGroup.add(reactorMesh);

    const fuelParticleCount = 28;
    const fuelParticlesGeo = new THREE.BufferGeometry();
    const fuelPosArray = new Float32Array(fuelParticleCount * 3);
    for (let p = 0; p < fuelParticleCount * 3; p += 3) {
      fuelPosArray[p] = (Math.random() - 0.5) * 0.28;
      fuelPosArray[p + 1] = (Math.random() - 0.5) * 0.38;
      fuelPosArray[p + 2] = (Math.random() - 0.5) * 0.28;
    }
    fuelParticlesGeo.setAttribute('position', new THREE.BufferAttribute(fuelPosArray, 3));
    const fuelParticleMat = new THREE.PointsMaterial({
      color: cyan,
      size: 0.04,
      transparent: true,
      opacity: 0.85,
    });
    const fuelParticles = new THREE.Points(fuelParticlesGeo, fuelParticleMat);
    fuelGroup.add(fuelParticles);
    mannequinGroup.add(fuelGroup);

    // --- E. Pelvis & Limbs ---
    const limbsGroup = new THREE.Group();

    const pelvisGeo = new THREE.TorusGeometry(0.38, 0.015, 6, 16);
    const pelvisMat = new THREE.MeshBasicMaterial({ color: dimLine, transparent: true, opacity: 0.6 });
    const pelvisMesh = new THREE.Mesh(pelvisGeo, pelvisMat);
    pelvisMesh.rotation.x = Math.PI / 2;
    pelvisMesh.position.set(0, -0.7, 0);
    limbsGroup.add(pelvisMesh);

    const createLimb = (start: THREE.Vector3, end: THREE.Vector3, color = dimLine) => {
      const g = new THREE.Group();
      const points = [start, end];
      const lineGeo = new THREE.BufferGeometry().setFromPoints(points);
      const lineMat = new THREE.LineBasicMaterial({ color, transparent: true, opacity: 0.65 });
      g.add(new THREE.Line(lineGeo, lineMat));

      const jointGeo = new THREE.SphereGeometry(0.05, 8, 8);
      const jointMat = new THREE.MeshBasicMaterial({ color: cyan, wireframe: true, transparent: true, opacity: 0.8 });
      const jointA = new THREE.Mesh(jointGeo, jointMat);
      jointA.position.copy(start);
      const jointB = new THREE.Mesh(jointGeo, jointMat);
      jointB.position.copy(end);
      g.add(jointA);
      g.add(jointB);
      return g;
    };

    // Arms
    limbsGroup.add(createLimb(new THREE.Vector3(0.55, 0.95, 0), new THREE.Vector3(0.85, 0.45, 0.1)));
    limbsGroup.add(createLimb(new THREE.Vector3(0.85, 0.45, 0.1), new THREE.Vector3(0.95, -0.05, 0.2)));
    limbsGroup.add(createLimb(new THREE.Vector3(-0.55, 0.95, 0), new THREE.Vector3(-0.85, 0.45, 0.1)));
    limbsGroup.add(createLimb(new THREE.Vector3(-0.85, 0.45, 0.1), new THREE.Vector3(-0.95, -0.05, 0.2)));

    // Legs
    limbsGroup.add(createLimb(new THREE.Vector3(0.28, -0.75, 0), new THREE.Vector3(0.35, -1.45, 0.05)));
    limbsGroup.add(createLimb(new THREE.Vector3(0.35, -1.45, 0.05), new THREE.Vector3(0.38, -2.15, 0)));
    limbsGroup.add(createLimb(new THREE.Vector3(-0.28, -0.75, 0), new THREE.Vector3(-0.35, -1.45, 0.05)));
    limbsGroup.add(createLimb(new THREE.Vector3(-0.35, -1.45, 0.05), new THREE.Vector3(-0.38, -2.15, 0)));

    // --- F. Kinetic Subroutine 3D Objects ---
    // 1. Futsal Mini-ball & Kinetic Ground Radar
    const futsalGroup = new THREE.Group();
    const soccerBallGeo = new THREE.IcosahedronGeometry(0.12, 1);
    const soccerBallMat = new THREE.MeshBasicMaterial({ color: green, wireframe: true, transparent: true, opacity: 0.9 });
    const soccerBall = new THREE.Mesh(soccerBallGeo, soccerBallMat);
    soccerBall.position.set(0.48, -2.15, 0.35);
    futsalGroup.add(soccerBall);

    const futsalRadarGeo = new THREE.RingGeometry(0.3, 0.45, 16);
    const futsalRadarMat = new THREE.MeshBasicMaterial({ color: green, side: THREE.DoubleSide, transparent: true, opacity: 0.4 });
    const futsalRadar = new THREE.Mesh(futsalRadarGeo, futsalRadarMat);
    futsalRadar.rotation.x = Math.PI / 2;
    futsalRadar.position.set(0.48, -2.25, 0.35);
    futsalGroup.add(futsalRadar);
    limbsGroup.add(futsalGroup);

    // 2. Tennis Ball & Parabolic Trajectory
    const tennisGroup = new THREE.Group();
    const tennisCurve = new THREE.CatmullRomCurve3([
      new THREE.Vector3(-0.95, -0.05, 0.2),
      new THREE.Vector3(-1.4, -0.9, 0.7),
      new THREE.Vector3(-1.6, -2.2, 1.2),
      new THREE.Vector3(-2.1, -1.2, 1.8),
    ]);
    const tennisCurvePoints = tennisCurve.getPoints(30);
    const tennisLineGeo = new THREE.BufferGeometry().setFromPoints(tennisCurvePoints);
    const tennisLineMat = new THREE.LineDashedMaterial({
      color: amber,
      dashSize: 0.08,
      gapSize: 0.04,
      transparent: true,
      opacity: 0.7,
    });
    const tennisTrajectory = new THREE.Line(tennisLineGeo, tennisLineMat);
    tennisTrajectory.computeLineDistances();
    tennisGroup.add(tennisTrajectory);

    const tennisBallGeo = new THREE.SphereGeometry(0.08, 8, 8);
    const tennisBallMat = new THREE.MeshBasicMaterial({ color: amber, wireframe: true, transparent: true, opacity: 0.9 });
    const tennisBall = new THREE.Mesh(tennisBallGeo, tennisBallMat);
    tennisGroup.add(tennisBall);

    const outOfBoundsGeo = new THREE.RingGeometry(0.18, 0.24, 16);
    const outOfBoundsMat = new THREE.MeshBasicMaterial({ color: red, side: THREE.DoubleSide, transparent: true, opacity: 0.8 });
    const outOfBoundsRing = new THREE.Mesh(outOfBoundsGeo, outOfBoundsMat);
    outOfBoundsRing.rotation.x = Math.PI / 2;
    outOfBoundsRing.position.set(-1.6, -2.2, 1.2);
    tennisGroup.add(outOfBoundsRing);
    limbsGroup.add(tennisGroup);

    mannequinGroup.add(limbsGroup);

    // --- G. Telemetry Floor Grid & Ambient Particles ---
    const floorGroup = new THREE.Group();
    floorGroup.position.set(0, -2.35, 0);

    const floorRingGeo = new THREE.RingGeometry(1.6, 2.2, 32);
    const floorRingMat = new THREE.MeshBasicMaterial({ color: cyan, side: THREE.DoubleSide, wireframe: true, transparent: true, opacity: 0.25 });
    const floorRing = new THREE.Mesh(floorRingGeo, floorRingMat);
    floorRing.rotation.x = Math.PI / 2;
    floorGroup.add(floorRing);

    const needleGeo = new THREE.BufferGeometry().setFromPoints([
      new THREE.Vector3(0, 0, 0),
      new THREE.Vector3(2.1, 0, 0),
    ]);
    const needleMat = new THREE.LineBasicMaterial({ color: cyan, transparent: true, opacity: 0.6 });
    const radarNeedle = new THREE.Line(needleGeo, needleMat);
    floorGroup.add(radarNeedle);
    scene.add(floorGroup);

    const ambientCount = 80;
    const ambientGeo = new THREE.BufferGeometry();
    const ambientPositions = new Float32Array(ambientCount * 3);
    for (let a = 0; a < ambientCount * 3; a += 3) {
      ambientPositions[a] = (Math.random() - 0.5) * 8;
      ambientPositions[a + 1] = (Math.random() - 0.5) * 6;
      ambientPositions[a + 2] = (Math.random() - 0.5) * 6;
    }
    ambientGeo.setAttribute('position', new THREE.BufferAttribute(ambientPositions, 3));
    const ambientMat = new THREE.PointsMaterial({
      color: 0x52525b,
      size: 0.035,
      transparent: true,
      opacity: 0.4,
    });
    const ambientPoints = new THREE.Points(ambientGeo, ambientMat);
    scene.add(ambientPoints);

    // 3. Mouse & Touch Drag Controls
    const onPointerDown = (e: MouseEvent | TouchEvent) => {
      stateRef.current.isDragging = true;
      const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
      const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;
      stateRef.current.lastMouseX = clientX;
      stateRef.current.lastMouseY = clientY;
    };

    const onPointerMove = (e: MouseEvent | TouchEvent) => {
      if (!stateRef.current.isDragging) return;
      const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
      const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;
      const deltaX = clientX - stateRef.current.lastMouseX;
      const deltaY = clientY - stateRef.current.lastMouseY;

      stateRef.current.targetRotationY += deltaX * 0.008;
      stateRef.current.targetRotationX = Math.max(-0.4, Math.min(0.4, stateRef.current.targetRotationX + deltaY * 0.006));

      stateRef.current.lastMouseX = clientX;
      stateRef.current.lastMouseY = clientY;
    };

    const onPointerUp = () => {
      stateRef.current.isDragging = false;
    };

    const dom = renderer.domElement;
    dom.addEventListener('mousedown', onPointerDown);
    dom.addEventListener('touchstart', onPointerDown, { passive: true });
    window.addEventListener('mousemove', onPointerMove);
    window.addEventListener('touchmove', onPointerMove, { passive: true });
    window.addEventListener('mouseup', onPointerUp);
    window.addEventListener('touchend', onPointerUp);

    // 4. Resize Handler with ResizeObserver
    const handleResize = () => {
      if (!container) return;
      const newWidth = container.clientWidth || 600;
      const newHeight = container.clientHeight || 480;
      camera.aspect = newWidth / newHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(newWidth, newHeight);
    };

    const resizeObserver = new ResizeObserver(handleResize);
    resizeObserver.observe(container);
    window.addEventListener('resize', handleResize);

    // 5. Visibility & Battery Optimization
    let isRunning = false;
    let isIntersecting = true;
    let animationFrameId: number;
    const currentLookAt = new THREE.Vector3(0, 0, 0);

    const animate = () => {
      if (!isRunning) return;
      animationFrameId = requestAnimationFrame(animate);

      const state = stateRef.current;
      state.time += 0.016;
      const t = state.time;

      camera.position.lerp(state.cameraTargetPos, 0.05);
      currentLookAt.lerp(state.cameraTargetLookAt, 0.05);
      camera.lookAt(currentLookAt);

      state.rotationY += (state.targetRotationY - state.rotationY) * 0.08;
      state.rotationX += (state.targetRotationX - state.rotationX) * 0.08;

      if (!state.isDragging) {
        state.targetRotationY += 0.0025;
      }
      mannequinGroup.rotation.y = state.rotationY;
      mannequinGroup.rotation.x = state.rotationX;

      floorGroup.rotation.y -= 0.01;

      // Head
      skullMesh.rotation.y = Math.sin(t * 0.8) * 0.08;
      visorMesh.position.y = 0.05 + Math.sin(t * 3.0) * 0.02;

      // Sensory Shield
      if (state.isShieldActive) {
        shieldMesh.visible = true;
        const shieldPulse = 1.0 + Math.sin(t * 4.0) * 0.04;
        shieldMesh.scale.set(shieldPulse, shieldPulse, shieldPulse);
        shieldMat.opacity = 0.45 + Math.sin(t * 2.5) * 0.15;
        shieldMat.color.setHex(cyan);
      } else {
        shieldMesh.visible = state.subsystem === 'sensory';
        shieldMat.opacity = 0.1;
        shieldMat.color.setHex(0x52525b);
      }

      // Compute Core Threads
      for (let c = 0; c < 4; c++) {
        state.coreOverclock[c] = Math.max(0, state.coreOverclock[c] - 0.015);
      }

      threadRings.forEach((ring, idx) => {
        const baseSpeed = (idx + 1) * 0.8;
        const boost = 1 + (state.coreOverclock[idx] * 4);
        ring.rotation.z += 0.015 * baseSpeed * boost;
        ring.rotation.x += 0.01 * baseSpeed * boost;
        const pulse = 1.0 + Math.sin(t * 4.0 + idx) * (0.04 + state.coreOverclock[idx] * 0.1);
        ring.scale.set(pulse, pulse, pulse);
      });
      coreOrb.rotation.y += 0.02;

      // Fuel Ingestion
      state.thermalSpike = Math.max(0, state.thermalSpike - 0.008);
      state.caffeineOverclock = Math.max(0, state.caffeineOverclock - 0.006);

      if (state.fuelMode === 'caffeine' || state.caffeineOverclock > 0.05) {
        const jitter = Math.sin(t * 24.0) * 0.012;
        reactorMesh.position.x = jitter;
        reactorMat.color.setHex(amber);
        fuelParticleMat.color.setHex(amber);
        coreOrbMat.color.setHex(amber);
        fuelParticles.rotation.y += 0.08;
      } else if (state.fuelMode === 'capsaicin' || state.thermalSpike > 0.05) {
        reactorMat.color.setHex(red);
        fuelParticleMat.color.setHex(red);
        coreOrbMat.color.setHex(red);
        reactorMesh.position.x = (Math.random() - 0.5) * 0.02;
        fuelParticles.rotation.y += 0.04;
      } else {
        reactorMesh.position.x = 0;
        reactorMat.color.setHex(cyan);
        fuelParticleMat.color.setHex(cyan);
        coreOrbMat.color.setHex(cyan);
        fuelParticles.rotation.y += 0.015;
      }

      // Vertebrae wave pulse
      vertebraeMeshes.forEach((v, idx) => {
        const wave = Math.sin(t * 3.0 - idx * 0.4);
        v.scale.set(1 + wave * 0.08, 1, 1 + wave * 0.08);
      });

      // Multiplayer Subroutines Dynamics
      const isMulti = state.subsystem === 'multiplayer';
      futsalGroup.visible = isMulti && state.multiplayerMode === 'futsal';
      karaokeWaveGroup.visible = isMulti && state.multiplayerMode === 'karaoke';
      tennisGroup.visible = isMulti && state.multiplayerMode === 'tennis';

      if (isMulti) {
        if (state.multiplayerMode === 'futsal') {
          const bounce = Math.abs(Math.sin(t * 5.0));
          soccerBall.position.y = -2.15 + bounce * 0.35;
          soccerBall.rotation.x += 0.04;
          soccerBall.rotation.y += 0.03;
          futsalRadar.scale.set(1 + bounce * 0.5, 1 + bounce * 0.5, 1);
        } else if (state.multiplayerMode === 'karaoke') {
          rippleMeshes.forEach((rMesh, i) => {
            const phase = (t * 2.0 + i * 0.6) % 1.8;
            const rScale = 1.0 + phase * 2.4;
            rMesh.scale.set(rScale, rScale, 1);
            rMesh.position.z = 0.35 + phase * 0.6;
            (rMesh.material as THREE.MeshBasicMaterial).opacity = Math.max(0, 0.8 - (phase / 1.8));
          });
        } else if (state.multiplayerMode === 'tennis') {
          const progress = (t * 0.8) % 1.0;
          const point = tennisCurve.getPoint(progress);
          tennisBall.position.copy(point);
          const outPulse = 1.0 + Math.sin(t * 8.0) * 0.2;
          outOfBoundsRing.scale.set(outPulse, outPulse, 1);
        }
      }

      // Ambient noise particles drift
      const positions = ambientGeo.attributes.position.array as Float32Array;
      for (let i = 1; i < ambientCount * 3; i += 3) {
        positions[i] -= 0.006;
        if (positions[i] < -3) positions[i] = 3;
      }
      ambientGeo.attributes.position.needsUpdate = true;

      renderer.render(scene, camera);
    };

    const updateVisibility = () => {
      const isDocVisible = typeof document !== 'undefined' ? !document.hidden : true;
      const isLockdown = typeof document !== 'undefined' ? document.body.classList.contains('sensory-lockdown') : false;
      const shouldRun = isIntersecting && isDocVisible && !isLockdown;

      if (shouldRun && !isRunning) {
        isRunning = true;
        animate();
      } else if (!shouldRun && isRunning) {
        isRunning = false;
        cancelAnimationFrame(animationFrameId);
      }
    };

    let observer: IntersectionObserver | null = null;
    if (typeof IntersectionObserver !== 'undefined' && container) {
      observer = new IntersectionObserver(([entry]) => {
        isIntersecting = entry.isIntersecting;
        updateVisibility();
      }, { threshold: 0.05 });
      observer.observe(container);
    }

    const onVisibilityChange = () => updateVisibility();
    document.addEventListener('visibilitychange', onVisibilityChange);
    window.addEventListener('toggle-sensory-lockdown', onVisibilityChange);

    updateVisibility();

    // 7. Cleanup
    return () => {
      isRunning = false;
      cancelAnimationFrame(animationFrameId);
      observer?.disconnect();
      document.removeEventListener('visibilitychange', onVisibilityChange);
      window.removeEventListener('toggle-sensory-lockdown', onVisibilityChange);
      resizeObserver.disconnect();
      window.removeEventListener('resize', handleResize);
      dom.removeEventListener('mousedown', onPointerDown);
      dom.removeEventListener('touchstart', onPointerDown);
      window.removeEventListener('mousemove', onPointerMove);
      window.removeEventListener('touchmove', onPointerMove);
      window.removeEventListener('mouseup', onPointerUp);
      window.removeEventListener('touchend', onPointerUp);

      if (container.contains(dom)) {
        container.removeChild(dom);
      }

      scene.traverse((obj) => {
        if (obj instanceof THREE.Mesh || obj instanceof THREE.Line || obj instanceof THREE.Points) {
          obj.geometry.dispose();
          if (Array.isArray(obj.material)) {
            obj.material.forEach((m) => m.dispose());
          } else {
            obj.material.dispose();
          }
        }
      });
      renderer.dispose();
    };
  }, [isFullscreen]);

  // The Header UI element
  const renderHeader = (inFullscreen = false) => (
    <div className={`flex flex-wrap items-center justify-between border-b border-border-subtle/80 px-3 py-2 bg-bg/85 backdrop-blur-md gap-2 shrink-0 ${
      inFullscreen ? 'px-4 py-3' : ''
    }`}>
      <div className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-widest text-text-2">
        <span className="flex items-center gap-1.5 font-bold text-accent">
          <Scan size={13} className="animate-pulse" />
          {inFullscreen ? (isID ? 'BIO_SCANNER_3D // LAYAR_PENUH' : '3D_BIO_SCANNER // FULLSCREEN') : (isID ? 'BIO_SCANNER_3D' : '3D_BIO_SCANNER')}
        </span>
        <span className="opacity-30">|</span>
        <span className="hidden sm:inline text-text-3">HRT-v2026.09</span>
      </div>

      {/* Telemetry live gauges */}
      <div className="flex items-center gap-2 sm:gap-3 font-mono text-[9px] uppercase">
        <div className="flex items-center gap-1">
          <Activity size={11} className={telemetryValues.heartbeat > 100 ? 'text-amber-500 animate-ping' : 'text-accent'} />
          <span className={telemetryValues.heartbeat > 100 ? 'text-amber-400 font-bold' : 'text-text-1'}>
            {telemetryValues.heartbeat}BPM
          </span>
        </div>

        <div className="hidden sm:flex items-center gap-1">
          <Flame size={11} className={telemetryValues.temp > 50 ? 'text-red-500 animate-bounce' : 'text-blue-400'} />
          <span className={telemetryValues.temp > 50 ? 'text-red-400 font-bold' : 'text-text-1'}>
            {telemetryValues.temp}°C
          </span>
        </div>

        {/* Window Controls */}
        <div className="flex items-center gap-1 border-l border-border-subtle/80 pl-1.5">
          {inFullscreen ? (
            <>
              <button
                onClick={handleResetCamera}
                title={isID ? 'Atur Ulang Kamera' : 'Reset Camera Angle'}
                className="p-1 hover:text-accent text-text-3 transition-colors cursor-pointer"
              >
                <RotateCcw size={13} />
              </button>
              <button
                onClick={() => setIsFullscreen(false)}
                title={isID ? 'Tutup Layar Penuh (ESC)' : 'Close Fullscreen (ESC)'}
                className="p-1 hover:text-accent text-text-3 transition-colors text-accent font-bold flex items-center gap-1 cursor-pointer"
              >
                <X size={15} />
              </button>
            </>
          ) : (
            <>
              <button
                onClick={handleResetCamera}
                title={isID ? 'Atur Ulang Kamera' : 'Reset Camera Angle'}
                className="p-1 hover:text-accent text-text-3 transition-colors cursor-pointer"
              >
                <RotateCcw size={12} />
              </button>

              <button
                onClick={() => setIsCollapsed(!isCollapsed)}
                title={isCollapsed ? (isID ? 'Buka Scanner' : 'Expand View') : (isID ? 'Minimalisir' : 'Minimize View')}
                className="p-1 hover:text-accent text-text-3 transition-colors cursor-pointer"
              >
                {isCollapsed ? <ChevronDown size={13} /> : <ChevronUp size={13} />}
              </button>

              <button
                onClick={() => setIsFullscreen(true)}
                title={isID ? 'Perbesar Layar Penuh' : 'Maximize Fullscreen'}
                className="p-1 hover:text-accent text-text-3 transition-colors cursor-pointer"
              >
                <Maximize2 size={13} />
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );

  // The 3D HUD controls overlay
  const renderHUDOverlay = () => (
    <>
      {/* Floating HUD Subsystem Selector Pills */}
      <div className="absolute top-3 left-3 z-10 flex flex-wrap gap-1.5 max-w-[calc(100%-24px)]">
        {[
          { id: 'overview', label: isID ? 'Semua' : 'All', icon: Maximize2 },
          { id: 'sensory', label: isID ? '01_Sensori (0dB)' : '01_Sensory (0dB)', icon: Shield },
          { id: 'fuel', label: isID ? '02_Bahan_Bakar' : '02_Fuel_Intake', icon: Zap },
          { id: 'compute', label: isID ? '03_Komputasi' : '03_Allocated_Compute', icon: Cpu },
          { id: 'multiplayer', label: isID ? '04_Multipemain' : '04_Multiplayer', icon: Activity },
        ].map((item) => {
          const isActive = currentSubsystem === item.id;
          const Icon = item.icon;
          return (
            <button
              key={item.id}
              onClick={() => handleSubsystemSelect(item.id as SubsystemId)}
              className={`px-2.5 py-1 text-[9px] font-mono uppercase tracking-wider flex items-center gap-1.5 rounded-sm transition-all backdrop-blur-sm border cursor-pointer ${
                isActive
                  ? 'bg-accent/20 border-accent text-accent shadow-[0_0_12px_rgba(0,225,207,0.25)]'
                  : 'bg-bg/60 border-border-subtle text-text-3 hover:text-text-1 hover:border-text-3'
              }`}
            >
              <Icon size={11} />
              {item.label}
            </button>
          );
        })}
      </div>

      {/* Subsystem Tactical Action Overlay */}
      <div className="absolute bottom-3 left-3 right-3 z-10 flex flex-col sm:flex-row justify-between items-start sm:items-end gap-3 pointer-events-none">
        <div className="bg-bg/85 backdrop-blur-md border border-border-subtle p-2.5 rounded-sm max-w-sm pointer-events-auto">
            {currentSubsystem === 'sensory' && (
              <div className="space-y-1.5 font-mono text-[9px]">
                <div className="flex items-center justify-between gap-4">
                  <span className="text-accent font-bold uppercase flex items-center gap-1">
                    <Shield size={11} /> {isID ? 'PERISAI AKUSTIK 0dB' : '0dB ACOUSTIC SHIELD'}
                  </span>
                  <span className={isShieldActive ? 'text-accent' : 'text-text-3'}>
                    {isShieldActive ? (isID ? 'TERKUNCI' : 'ENGAGED') : (isID ? 'NONAKTIF' : 'DISENGAGED')}
                  </span>
                </div>
                <p className="text-text-3 text-[8px] leading-relaxed">
                  {isID
                    ? 'Mengisolasi input sensorik untuk mencegah gagal context-switching. Target mutlak 0dB.'
                    : 'Acoustic isolation matrix cancels ambient context-switching faults. Target 0dB.'}
                </p>
                <button
                  onClick={handleToggleShield}
                  className={`w-full py-1 text-[8px] uppercase tracking-widest font-bold border transition-colors flex items-center justify-center gap-1.5 ${
                    isShieldActive
                      ? 'bg-accent/20 border-accent text-accent'
                      : 'bg-bg-1 border-border-subtle text-text-2 hover:border-accent hover:text-accent'
                  }`}
                >
                  {isShieldActive ? <VolumeX size={10} /> : <Volume2 size={10} />}
                  {isShieldActive ? (isID ? 'Lepas Perisai' : 'Disengage Shield') : (isID ? 'Aktifkan Perisai' : 'Engage Sensory Shield')}
                </button>
              </div>
            )}

            {currentSubsystem === 'fuel' && (
              <div className="space-y-1.5 font-mono text-[9px]">
                <div className="flex items-center justify-between gap-4">
                  <span className="text-amber-400 font-bold uppercase flex items-center gap-1">
                    <Zap size={11} /> {isID ? 'SIMULASI ASUPAN METABOLISME' : 'METABOLIC INGESTION SIM'}
                  </span>
                  <span className="text-text-3 uppercase text-[8px]">{fuelMode}</span>
                </div>
                <div className="grid grid-cols-3 gap-1 pt-1">
                  <button
                    onClick={() => handleFuelSelect('clean')}
                    className={`px-1.5 py-1 text-[8px] uppercase border transition-all ${
                      fuelMode === 'clean'
                        ? 'bg-accent/20 border-accent text-accent'
                        : 'bg-bg-1 border-border-subtle text-text-3 hover:text-text-1'
                    }`}
                  >
                    Clean Fuel
                  </button>
                  <button
                    onClick={() => handleFuelSelect('caffeine')}
                    className={`px-1.5 py-1 text-[8px] uppercase border transition-all flex items-center justify-center gap-1 ${
                      fuelMode === 'caffeine'
                        ? 'bg-amber-500/20 border-amber-500 text-amber-400 shadow-[0_0_8px_rgba(245,158,11,0.3)]'
                        : 'bg-bg-1 border-border-subtle text-text-3 hover:text-text-1'
                    }`}
                  >
                    <Coffee size={9} /> Caffeine
                  </button>
                  <button
                    onClick={() => handleFuelSelect('capsaicin')}
                    className={`px-1.5 py-1 text-[8px] uppercase border transition-all flex items-center justify-center gap-1 ${
                      fuelMode === 'capsaicin'
                        ? 'bg-red-500/20 border-red-500 text-red-400 shadow-[0_0_8px_rgba(239,68,68,0.3)]'
                        : 'bg-bg-1 border-border-subtle text-text-3 hover:text-text-1'
                    }`}
                  >
                    <Flame size={9} /> Capsaicin
                  </button>
                </div>
              </div>
            )}

            {currentSubsystem === 'compute' && (
              <div className="space-y-1.5 font-mono text-[9px]">
                <div className="flex items-center justify-between gap-4">
                  <span className="text-accent font-bold uppercase flex items-center gap-1">
                    <Cpu size={11} /> {isID ? 'ALOKASI 4-CORE KOMPUTASI' : 'QUAD-THREAD COMPUTE ENGINE'}
                  </span>
                  <span className="text-text-3 uppercase text-[8px]">{computeMode}</span>
                </div>
                <p className="text-text-3 text-[8px] leading-relaxed">
                  {isID
                    ? 'Pilih core untuk overclocking thread gyroscopic 3D secara real-time:'
                    : 'Select core thread to overclock 3D gyroscopic reactor in real time:'}
                </p>
                <div className="grid grid-cols-2 gap-1 pt-1">
                  <button
                    onClick={() => handleComputeSelect('vibe')}
                    className={`px-1.5 py-1 text-[8px] uppercase border transition-all flex items-center justify-center gap-1 ${
                      computeMode === 'vibe'
                        ? 'bg-accent/20 border-accent text-accent shadow-[0_0_8px_rgba(0,225,207,0.3)]'
                        : 'bg-bg-1 border-border-subtle text-text-3 hover:text-text-1'
                    }`}
                  >
                    <Terminal size={9} /> C0: Vibe (88%)
                  </button>
                  <button
                    onClick={() => handleComputeSelect('philosophy')}
                    className={`px-1.5 py-1 text-[8px] uppercase border transition-all flex items-center justify-center gap-1 ${
                      computeMode === 'philosophy'
                        ? 'bg-blue-500/20 border-blue-500 text-blue-400 shadow-[0_0_8px_rgba(56,189,248,0.3)]'
                        : 'bg-bg-1 border-border-subtle text-text-3 hover:text-text-1'
                    }`}
                  >
                    <Brain size={9} /> C1: Philo (42%)
                  </button>
                  <button
                    onClick={() => handleComputeSelect('finance')}
                    className={`px-1.5 py-1 text-[8px] uppercase border transition-all flex items-center justify-center gap-1 ${
                      computeMode === 'finance'
                        ? 'bg-amber-500/20 border-amber-500 text-amber-400 shadow-[0_0_8px_rgba(245,158,11,0.3)]'
                        : 'bg-bg-1 border-border-subtle text-text-3 hover:text-text-1'
                    }`}
                  >
                    <LineChart size={9} /> C2: Finance (65%)
                  </button>
                  <button
                    onClick={() => handleComputeSelect('literature')}
                    className={`px-1.5 py-1 text-[8px] uppercase border transition-all flex items-center justify-center gap-1 ${
                      computeMode === 'literature'
                        ? 'bg-green-500/20 border-green-500 text-green-400 shadow-[0_0_8px_rgba(16,185,129,0.3)]'
                        : 'bg-bg-1 border-border-subtle text-text-3 hover:text-text-1'
                    }`}
                  >
                    <BookOpen size={9} /> C3: Books (25%)
                  </button>
                </div>
              </div>
            )}

            {currentSubsystem === 'multiplayer' && (
              <div className="space-y-1.5 font-mono text-[9px]">
                <div className="flex items-center justify-between gap-4">
                  <span className="text-accent font-bold uppercase flex items-center gap-1">
                    <Activity size={11} /> {isID ? 'SUBRUTIN KINETIK MULTIPEMAIN' : 'KINETIC SUBROUTINES'}
                  </span>
                  <span className="text-text-3 uppercase text-[8px]">{multiplayerMode}</span>
                </div>
                <p className="text-text-3 text-[8px] leading-relaxed">
                  {isID
                    ? 'Simulasi interupsi fisik & pertukaran data peer-to-peer.'
                    : 'Simulate physical peer-to-peer interrupt vectors.'}
                </p>
                <div className="grid grid-cols-3 gap-1 pt-1">
                  <button
                    onClick={() => handleMultiplayerSelect('futsal')}
                    className={`px-1.5 py-1 text-[8px] uppercase border transition-all flex items-center justify-center gap-1 ${
                      multiplayerMode === 'futsal'
                        ? 'bg-green-500/20 border-green-500 text-green-400 shadow-[0_0_8px_rgba(16,185,129,0.3)]'
                        : 'bg-bg-1 border-border-subtle text-text-3 hover:text-text-1'
                    }`}
                  >
                    <Activity size={9} /> Futsal
                  </button>
                  <button
                    onClick={() => handleMultiplayerSelect('karaoke')}
                    className={`px-1.5 py-1 text-[8px] uppercase border transition-all flex items-center justify-center gap-1 ${
                      multiplayerMode === 'karaoke'
                        ? 'bg-blue-500/20 border-blue-500 text-blue-400 shadow-[0_0_8px_rgba(56,189,248,0.3)]'
                        : 'bg-bg-1 border-border-subtle text-text-3 hover:text-text-1'
                    }`}
                  >
                    <Mic size={9} /> Karaoke
                  </button>
                  <button
                    onClick={() => handleMultiplayerSelect('tennis')}
                    className={`px-1.5 py-1 text-[8px] uppercase border transition-all flex items-center justify-center gap-1 ${
                      multiplayerMode === 'tennis'
                        ? 'bg-amber-500/20 border-amber-500 text-amber-400 shadow-[0_0_8px_rgba(245,158,11,0.3)]'
                        : 'bg-bg-1 border-border-subtle text-text-3 hover:text-text-1'
                    }`}
                  >
                    <Circle size={9} /> Tennis
                  </button>
                </div>
              </div>
            )}

            {currentSubsystem === 'overview' && (
              <div className="space-y-1 font-mono text-[9px]">
                <div className="text-accent font-bold uppercase flex items-center gap-1">
                  <Sparkles size={11} /> {isID ? 'IKHTISAR ANATOMI HARDWARE' : 'HARDWARE ANATOMY OVERVIEW'}
                </div>
                <p className="text-text-3 text-[8px] leading-relaxed">
                  {isID
                    ? 'Tarik/geser kursor untuk memutar model 3D. Pilih subsistem di atas untuk inspeksi detail.'
                    : 'Drag mouse / swipe touch to orbit 3D model. Select subsystems above for tactical inspection.'}
                </p>
              </div>
            )}
          </div>

          {/* Status Diagnostic Callout */}
          <div className="font-mono text-[8px] uppercase tracking-widest text-text-3 bg-bg/80 backdrop-blur-sm px-2.5 py-1.5 border border-border-subtle rounded-sm flex items-center gap-2">
            <span className="inline-block w-1.5 h-1.5 rounded-full bg-accent animate-ping" />
            <span>STATUS: {telemetryValues.status}</span>
          </div>
        </div>
    </>
  );

  return (
    <>
      {/* 1. When in Fullscreen, render placeholder in document flow */}
      {isFullscreen && (
        <div className="w-full h-44 border border-dashed border-accent/50 bg-bg-1/40 rounded-sm mb-8 flex flex-col items-center justify-center gap-2 p-6 text-center font-mono select-none">
          <div className="w-2.5 h-2.5 rounded-full bg-accent animate-ping" />
          <span className="text-accent text-[11px] font-bold uppercase tracking-widest">
            {isID ? 'MODE LAYAR PENUH SEDANG AKTIF' : 'FULLSCREEN VIEWPORT ACTIVE'}
          </span>
          <button
            onClick={() => setIsFullscreen(false)}
            className="mt-2 px-3 py-1 bg-accent/15 border border-accent/40 text-accent text-[9px] uppercase tracking-wider font-bold rounded-sm hover:bg-accent/30 transition-colors cursor-pointer"
          >
            [ {isID ? 'KEMBALIKAN TAMPILAN NORMAL' : 'RESTORE INLINE VIEW'} ]
          </button>
        </div>
      )}

      {/* 2. Standard Inline Container (When not fullscreen) */}
      {!isFullscreen && (
        <div className="relative w-full border border-border-subtle bg-bg-1/60 backdrop-blur-md rounded-sm overflow-hidden mb-8 group">
          {renderHeader(false)}

          {/* Collapsed State Bar */}
          {isCollapsed && (
            <div className="px-4 py-2 bg-bg/40 flex items-center justify-between font-mono text-[9px] text-text-3 uppercase tracking-widest">
              <span className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse" />
                {isID ? 'SCANNER 3D DIMINIMALISIR // KERNEL AKTIF' : '3D SCANNER MINIMIZED // KERNEL RUNNING'}
              </span>
              <button
                onClick={() => setIsCollapsed(false)}
                className="text-accent hover:underline flex items-center gap-1 font-bold cursor-pointer"
              >
                [ {isID ? 'PERBESAR SCANNER' : 'EXPAND SCANNER'} ]
              </button>
            </div>
          )}

          {/* The Live WebGL Canvas Area */}
          <div 
            className={`relative w-full cursor-grab active:cursor-grabbing overflow-hidden ${
              isCollapsed ? 'h-0 overflow-hidden' : 'h-[360px] sm:h-[440px]'
            }`}
          >
            <div ref={mountRef} className="absolute inset-0 w-full h-full" />
            {renderHUDOverlay()}
          </div>
        </div>
      )}

      {/* 3. True Fullscreen Portal (Overlaying everything at z-[99999]) */}
      {isFullscreen && mounted && createPortal(
        <div 
          className="fixed inset-0 z-[99999] bg-black/95 backdrop-blur-2xl flex flex-col p-2 sm:p-6 select-none animate-in fade-in duration-200"
          onClick={(e) => {
            if (e.target === e.currentTarget) setIsFullscreen(false);
          }}
        >
          <div className="relative w-full h-full bg-[#09090b] border-2 border-accent/60 shadow-[0_0_80px_rgba(0,225,207,0.25)] rounded-sm overflow-hidden flex flex-col">
            {renderHeader(true)}

            <div className="relative flex-1 w-full cursor-grab active:cursor-grabbing overflow-hidden">
              <div ref={mountRef} className="absolute inset-0 w-full h-full" />
              {renderHUDOverlay()}
            </div>

            {/* Bottom Fullscreen Exit Bar */}
            <div className="px-4 py-2 border-t border-border-subtle/80 bg-bg/80 flex items-center justify-between font-mono text-[9px] uppercase tracking-wider text-text-3">
              <span className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-accent animate-ping" />
                <span>FULLSCREEN 3D BIO-SCANNER ACTIVE // ESC TO EXIT</span>
              </span>
              <button
                onClick={() => setIsFullscreen(false)}
                className="text-accent hover:text-white font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <Minimize2 size={12} /> {isID ? 'Tutup Layar Penuh' : 'Exit Fullscreen'}
              </button>
            </div>
          </div>
        </div>,
        document.body
      )}
    </>
  );
}
