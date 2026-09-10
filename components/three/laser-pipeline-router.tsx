'use client';

import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { Layers, Zap } from 'lucide-react';
import { soundEngine } from '@/lib/audio';
import { gameEngine } from '@/lib/game-engine';

interface PipelineNode3D {
  id: string;
  name: string;
  tier: 'source' | 'transform' | 'sink';
  tech: string;
  pos: THREE.Vector3;
  color: number;
}

const NODES_3D: PipelineNode3D[] = [
  // Sources (Left x = -3.5)
  { id: 'kafka', name: 'Kafka Event Bus', tier: 'source', tech: 'Apache Kafka (1.2M/s)', pos: new THREE.Vector3(-3.5, 1.5, 0), color: 0x00e1cf },
  { id: 'cdc', name: 'Postgres CDC', tier: 'source', tech: 'Debezium / WAL2JSON', pos: new THREE.Vector3(-3.5, 0, 0), color: 0x38bdf8 },
  { id: 's3', name: 'S3 Object Lake', tier: 'source', tech: 'Parquet / Iceberg', pos: new THREE.Vector3(-3.5, -1.5, 0), color: 0x3b82f6 },

  // Transformers (Middle x = 0)
  { id: 'spark', name: 'Spark Processing', tier: 'transform', tech: 'PySpark / Delta', pos: new THREE.Vector3(0, 1.5, 0), color: 0xf97316 },
  { id: 'duckdb', name: 'DuckDB Engine', tier: 'transform', tech: 'Vectorized C++', pos: new THREE.Vector3(0, 0, 0), color: 0xfacc15 },
  { id: 'dbt', name: 'dbt Core Models', tier: 'transform', tech: 'SQL / Jinja Staging', pos: new THREE.Vector3(0, -1.5, 0), color: 0xf97316 },

  // Sinks (Right x = 3.5)
  { id: 'bigquery', name: 'BigQuery Warehouse', tier: 'sink', tech: 'Petabyte Warehouse', pos: new THREE.Vector3(3.5, 1.5, 0), color: 0x60a5fa },
  { id: 'clickhouse', name: 'ClickHouse OLAP', tier: 'sink', tech: '15M events/sec OLAP', pos: new THREE.Vector3(3.5, 0, 0), color: 0xf59e0b },
  { id: 'redis', name: 'Redis Cache', tier: 'sink', tech: 'In-Memory Key/Val', pos: new THREE.Vector3(3.5, -1.5, 0), color: 0xef4444 },
];

export function LaserPipelineRouter({ locale = 'en' }: { locale?: 'en' | 'id' }) {
  const isID = locale === 'id';
  const mountRef = useRef<HTMLDivElement>(null);

  const [activeSources, setActiveSources] = useState<string[]>(['kafka', 'cdc']);
  const [activeTransforms, setActiveTransforms] = useState<string[]>(['spark', 'duckdb']);
  const [activeSinks, setActiveSinks] = useState<string[]>(['bigquery', 'clickhouse']);
  const [isBursting, setIsBursting] = useState(false);
  const [selectedNodeInfo, setSelectedNodeInfo] = useState<PipelineNode3D | null>(null);

  const stateRef = useRef({
    activeSources: ['kafka', 'cdc'],
    activeTransforms: ['spark', 'duckdb'],
    activeSinks: ['bigquery', 'clickhouse'],
    isBursting: false,
  });

  useEffect(() => {
    stateRef.current.activeSources = activeSources;
    stateRef.current.activeTransforms = activeTransforms;
    stateRef.current.activeSinks = activeSinks;
    stateRef.current.isBursting = isBursting;
  }, [activeSources, activeTransforms, activeSinks, isBursting]);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    const width = container.clientWidth || 600;
    const height = container.clientHeight || 450;

    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x09090b, 0.02);

    const camera = new THREE.PerspectiveCamera(50, width / height, 0.1, 50);
    camera.position.set(0, 0, 8.2);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container.appendChild(renderer.domElement);

    // Ambient & Directional Lights
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.9);
    scene.add(ambientLight);

    const dirLight = new THREE.DirectionalLight(0x00e1cf, 2);
    dirLight.position.set(0, 5, 5);
    scene.add(dirLight);

    // Node Meshes
    const nodeMeshes: THREE.Group[] = [];
    const nodeGeo = new THREE.OctahedronGeometry(0.45);

    NODES_3D.forEach((node, idx) => {
      const group = new THREE.Group();
      group.position.copy(node.pos);

      const mat = new THREE.MeshStandardMaterial({
        color: node.color,
        emissive: node.color,
        emissiveIntensity: 0.5,
        metalness: 0.8,
        roughness: 0.2
      });
      const mesh = new THREE.Mesh(nodeGeo, mat);
      group.add(mesh);

      // Wireframe Halo
      const haloGeo = new THREE.IcosahedronGeometry(0.65);
      const haloMat = new THREE.MeshBasicMaterial({ color: node.color, wireframe: true, transparent: true, opacity: 0.35 });
      const halo = new THREE.Mesh(haloGeo, haloMat);
      group.add(halo);

      (group as any).userData = { nodeIndex: idx };
      scene.add(group);
      nodeMeshes.push(group);
    });

    // Laser Beam Tubes
    let laserLinesGroup = new THREE.Group();
    scene.add(laserLinesGroup);

    // Energy Photons Pulses
    const photonCount = 40;
    const photonGeo = new THREE.SphereGeometry(0.08, 8, 8);
    const photonMat = new THREE.MeshBasicMaterial({ color: 0xffffff });
    const photons: { mesh: THREE.Mesh; start: THREE.Vector3; end: THREE.Vector3; progress: number; speed: number }[] = [];

    for (let i = 0; i < photonCount; i++) {
      const pMesh = new THREE.Mesh(photonGeo, photonMat);
      scene.add(pMesh);
      photons.push({
        mesh: pMesh,
        start: new THREE.Vector3(),
        end: new THREE.Vector3(),
        progress: Math.random(),
        speed: 0.015 + Math.random() * 0.01
      });
    }

    const updateLaserTubes = () => {
      // Clear old laser meshes
      while (laserLinesGroup.children.length > 0) {
        const obj = laserLinesGroup.children[0] as THREE.Mesh;
        obj.geometry.dispose();
        (obj.material as THREE.Material).dispose();
        laserLinesGroup.remove(obj);
      }

      const currentSources = stateRef.current.activeSources;
      const currentTransforms = stateRef.current.activeTransforms;
      const currentSinks = stateRef.current.activeSinks;

      const pairs: [THREE.Vector3, THREE.Vector3, number][] = [];

      // Source -> Transform links
      currentSources.forEach(sId => {
        const sNode = NODES_3D.find(n => n.id === sId);
        if (!sNode) return;
        currentTransforms.forEach(tId => {
          const tNode = NODES_3D.find(n => n.id === tId);
          if (!tNode) return;
          pairs.push([sNode.pos, tNode.pos, 0x00e1cf]);
        });
      });

      // Transform -> Sink links
      currentTransforms.forEach(tId => {
        const tNode = NODES_3D.find(n => n.id === tId);
        if (!tNode) return;
        currentSinks.forEach(kId => {
          const kNode = NODES_3D.find(n => n.id === kId);
          if (!kNode) return;
          pairs.push([tNode.pos, kNode.pos, 0xf59e0b]);
        });
      });

      pairs.forEach(([start, end, color]) => {
        const path = new THREE.LineCurve3(start, end);
        const tubeGeo = new THREE.TubeGeometry(path, 12, 0.025, 6, false);
        const tubeMat = new THREE.MeshBasicMaterial({ color, transparent: true, opacity: 0.5 });
        const tube = new THREE.Mesh(tubeGeo, tubeMat);
        laserLinesGroup.add(tube);
      });

      // Assign pairs to photons
      photons.forEach((p, idx) => {
        if (pairs.length > 0) {
          const pair = pairs[idx % pairs.length];
          p.start.copy(pair[0]);
          p.end.copy(pair[1]);
        }
      });
    };

    updateLaserTubes();

    // Mouse Interaction
    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();
    let isDragging = false;
    let prevX = 0;
    let prevY = 0;
    let rotY = 0;
    let rotX = 0;

    const onMouseDown = (e: MouseEvent) => {
      isDragging = true;
      prevX = e.clientX;
      prevY = e.clientY;
    };

    const onMouseMove = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      mouse.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      mouse.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;

      if (isDragging) {
        const deltaX = e.clientX - prevX;
        const deltaY = e.clientY - prevY;
        rotY += deltaX * 0.005;
        rotX = Math.max(-0.4, Math.min(0.4, rotX + deltaY * 0.005));
        prevX = e.clientX;
        prevY = e.clientY;
      }
    };

    const onMouseUp = () => {
      if (!isDragging) return;
      isDragging = false;

      raycaster.setFromCamera(mouse, camera);
      const intersects = raycaster.intersectObjects(nodeMeshes, true);

      if (intersects.length > 0) {
        let obj: any = intersects[0].object;
        while (obj.parent && obj.parent !== scene) {
          obj = obj.parent;
        }
        if (obj.userData && typeof obj.userData.nodeIndex === 'number') {
          const node = NODES_3D[obj.userData.nodeIndex];
          soundEngine.playNodeConnect();
          setSelectedNodeInfo(node);

          if (node.tier === 'source') {
            setActiveSources(prev => prev.includes(node.id) ? (prev.length > 1 ? prev.filter(i => i !== node.id) : prev) : [...prev, node.id]);
          } else if (node.tier === 'transform') {
            setActiveTransforms(prev => prev.includes(node.id) ? (prev.length > 1 ? prev.filter(i => i !== node.id) : prev) : [...prev, node.id]);
          } else {
            setActiveSinks(prev => prev.includes(node.id) ? (prev.length > 1 ? prev.filter(i => i !== node.id) : prev) : [...prev, node.id]);
          }
          gameEngine.completeQuest('calibrate_pipeline');
        }
      }
    };

    container.addEventListener('mousedown', onMouseDown);
    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', onMouseUp);

    // Animation Loop with Visibility & Battery Optimization
    let animationId: number;
    let isRunning = false;
    let isIntersecting = true;

    const animate = () => {
      if (!isRunning) return;
      animationId = requestAnimationFrame(animate);

      // Smooth camera orbit
      camera.position.x = Math.sin(rotY) * 8.5;
      camera.position.z = Math.cos(rotY) * 8.5;
      camera.position.y = rotX * 5;
      camera.lookAt(0, 0, 0);

      // Rotate nodes & halos
      nodeMeshes.forEach(m => {
        m.children[0].rotation.y += 0.015;
        m.children[1].rotation.x += 0.01;
        m.children[1].rotation.z += 0.01;
      });

      // Animate Energy Photons along lasers
      const speedMult = stateRef.current.isBursting ? 3.5 : 1.0;
      photons.forEach(p => {
        p.progress += p.speed * speedMult;
        if (p.progress > 1) p.progress = 0;
        p.mesh.position.lerpVectors(p.start, p.end, p.progress);
      });

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
        cancelAnimationFrame(animationId);
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

    // Initial check and kick-off
    updateVisibility();

    const handleResize = () => {
      if (!container) return;
      const w = container.clientWidth;
      const h = container.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      isRunning = false;
      cancelAnimationFrame(animationId);
      observer?.disconnect();
      document.removeEventListener('visibilitychange', onVisibilityChange);
      window.removeEventListener('toggle-sensory-lockdown', onVisibilityChange);
      container.removeEventListener('mousedown', onMouseDown);
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onMouseUp);
      window.removeEventListener('resize', handleResize);
      nodeGeo.dispose();
      photonGeo.dispose();
      renderer.dispose();
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
    };
  }, [activeSources, activeTransforms, activeSinks]);

  const triggerBurstTest = () => {
    soundEngine.playStreamSpike();
    setIsBursting(true);
    gameEngine.completeQuest('laser_router');
    gameEngine.unlockBadge('laser_master');
    setTimeout(() => {
      soundEngine.playSuccessChord();
      setIsBursting(false);
    }, 4000);
  };

  return (
    <div className="relative w-full h-[450px] bg-[#09090b] border border-border-subtle rounded-lg overflow-hidden font-mono select-none">
      {/* 3D Canvas */}
      <div ref={mountRef} className="absolute inset-0 w-full h-full cursor-grab active:cursor-grabbing" />

      {/* Top Header & Burst Action */}
      <div className="absolute top-3 left-3 right-3 flex flex-wrap items-center justify-between gap-2 z-10 pointer-events-none">
        <div className="flex items-center gap-2 bg-bg/80 border border-border-subtle backdrop-blur-md px-3 py-1.5 rounded-sm">
          <Layers size={14} className="text-accent" />
          <span className="text-[11px] font-bold text-text-0 uppercase tracking-widest">
            {isID ? 'PIPELINE LASER 3D' : '3D LASER PIPELINE ROUTER'}
          </span>
          <span className="text-[9px] text-text-3 hidden sm:inline">
            ({isID ? 'Klik node untuk menghubungkan jalur data' : 'Click nodes to route photonic channels'})
          </span>
        </div>

        <div className="pointer-events-auto">
          <button
            onClick={triggerBurstTest}
            disabled={isBursting}
            className={`flex items-center gap-1.5 px-3 py-1.5 text-[10px] font-bold uppercase rounded-sm transition-all shadow-[0_0_20px_rgba(0,225,207,0.3)] cursor-pointer ${
              isBursting 
                ? 'bg-amber-500 text-bg animate-pulse' 
                : 'bg-accent hover:bg-white text-bg'
            }`}
          >
            <Zap size={13} />
            <span>{isBursting ? (isID ? 'BURST 10M EVENTS AKTIF!' : 'BURSTING 10M EVENTS!') : (isID ? 'UJI BURST PULSA (+150 XP)' : 'TEST LASER BURST (+150 XP)')}</span>
          </button>
        </div>
      </div>

      {/* Selected Node Details */}
      {selectedNodeInfo && (
        <div className="absolute bottom-3 left-3 right-3 sm:right-auto sm:w-72 bg-bg/90 border border-accent/40 rounded-sm p-3.5 backdrop-blur-md shadow-2xl z-10 text-xs font-mono">
          <div className="flex items-center justify-between border-b border-border-subtle pb-1.5 mb-2">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-accent animate-ping" />
              <span className="font-bold text-text-0">{selectedNodeInfo.name}</span>
            </div>
            <button 
              onClick={() => setSelectedNodeInfo(null)} 
              className="text-text-3 hover:text-text-0 text-[10px]"
            >
              [X]
            </button>
          </div>
          <div className="text-[11px] text-text-2 space-y-1">
            <div><span className="text-text-3">Tier: </span><span className="text-accent uppercase font-bold">{selectedNodeInfo.tier}</span></div>
            <div><span className="text-text-3">Engine: </span><span className="text-text-1">{selectedNodeInfo.tech}</span></div>
          </div>
        </div>
      )}
    </div>
  );
}
