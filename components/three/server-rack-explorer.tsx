'use client';

import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { Server, AlertTriangle, ShieldCheck, RotateCcw } from 'lucide-react';
import { soundEngine } from '@/lib/audio';
import { gameEngine } from '@/lib/game-engine';

interface ServerNodeData {
  id: number;
  name: string;
  role: string;
  roleId: string;
  tech: string;
  specs: string;
  throughput: string;
  latency: string;
  status: 'OPTIMAL' | 'FAILED' | 'FAILOVER_ACTIVE';
  yPos: number;
}

const SERVER_NODES: ServerNodeData[] = [
  { id: 0, name: 'NODE-01', role: 'Spark Distributed Worker', roleId: 'Worker Terdistribusi Spark', tech: 'PySpark / Delta Lake', specs: '128 GB RAM • 32 vCPU', throughput: '4.8M rows/sec', latency: '12ms', status: 'OPTIMAL', yPos: 2.5 },
  { id: 1, name: 'NODE-02', role: 'ClickHouse OLAP Analytics', roleId: 'Analitik OLAP ClickHouse', tech: 'ClickHouse Columnar', specs: '256 GB RAM • 64 vCPU', throughput: '15M events/sec', latency: '4ms', status: 'OPTIMAL', yPos: 1.5 },
  { id: 2, name: 'NODE-03', role: 'PostgreSQL CDC Primary', roleId: 'PostgreSQL CDC Primer', tech: 'PostgreSQL 17 / Wal2json', specs: '64 GB RAM • 16 vCPU', throughput: '850K ops/sec', latency: '2ms', status: 'OPTIMAL', yPos: 0.5 },
  { id: 3, name: 'NODE-04', role: 'DuckDB Vector Processor', roleId: 'Pemroses Vektor DuckDB', tech: 'DuckDB In-Memory C++', specs: '128 GB RAM • 32 vCPU', throughput: '12M rows/sec', latency: '1ms', status: 'OPTIMAL', yPos: -0.5 },
  { id: 4, name: 'NODE-05', role: 'Redis Distributed Cache', roleId: 'Cache Terdistribusi Redis', tech: 'Redis Cluster 7.2', specs: '32 GB RAM • 8 vCPU', throughput: '1.2M req/sec', latency: '<1ms', status: 'OPTIMAL', yPos: -1.5 },
  { id: 5, name: 'NODE-06', role: 'Airflow Orchestrator Node', roleId: 'Node Orkestrasi Airflow', tech: 'Apache Airflow 2.10', specs: '32 GB RAM • 8 vCPU', throughput: '500 DAG runs/hr', latency: '25ms', status: 'OPTIMAL', yPos: -2.5 },
];

export function ServerRackExplorer({ locale = 'en' }: { locale?: 'en' | 'id' }) {
  const isID = locale === 'id';
  const mountRef = useRef<HTMLDivElement>(null);
  const [selectedNode, setSelectedNode] = useState<ServerNodeData | null>(null);
  const [chaosActive, setChaosActive] = useState(false);
  const [failoverResolved, setFailoverResolved] = useState(false);

  const selectedNodeRef = useRef<number | null>(null);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    const width = container.clientWidth || 600;
    const height = container.clientHeight || 450;

    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x09090b, 0.03);

    const camera = new THREE.PerspectiveCamera(50, width / height, 0.1, 50);
    camera.position.set(4.5, 1.5, 6.5);
    camera.lookAt(0, 0, 0);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container.appendChild(renderer.domElement);

    // Lights
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.9);
    scene.add(ambientLight);

    const cyanLight = new THREE.PointLight(0x00e1cf, 3, 15);
    cyanLight.position.set(3, 4, 3);
    scene.add(cyanLight);

    const blueLight = new THREE.PointLight(0x3b82f6, 2, 15);
    blueLight.position.set(-3, -2, 3);
    scene.add(blueLight);

    // Rack Frame / Cabinet
    const frameMat = new THREE.MeshStandardMaterial({ color: 0x18181b, metalness: 0.85, roughness: 0.3 });
    const rackFrameGeo = new THREE.BoxGeometry(3.6, 6.6, 2.2);
    const rackFrame = new THREE.Mesh(rackFrameGeo, frameMat);
    rackFrame.position.set(0, 0, 0);
    scene.add(rackFrame);

    // Rack Interior Cutout
    const interiorMat = new THREE.MeshBasicMaterial({ color: 0x09090b });
    const interiorGeo = new THREE.BoxGeometry(3.2, 6.2, 2.0);
    const interior = new THREE.Mesh(interiorGeo, interiorMat);
    interior.position.set(0, 0, 0.2);
    scene.add(interior);

    // Server Blades
    const bladeMeshes: THREE.Group[] = [];
    const ledMeshes: THREE.Mesh[] = [];

    SERVER_NODES.forEach((node, idx) => {
      const bladeGroup = new THREE.Group();
      bladeGroup.position.set(0, node.yPos, 0.2);

      // Chassis
      const chassisGeo = new THREE.BoxGeometry(3.0, 0.75, 1.8);
      const chassisMat = new THREE.MeshStandardMaterial({ 
        color: 0x27272a, 
        metalness: 0.7, 
        roughness: 0.35 
      });
      const chassis = new THREE.Mesh(chassisGeo, chassisMat);
      bladeGroup.add(chassis);

      // Front Bezel / Grille
      const bezelGeo = new THREE.BoxGeometry(2.9, 0.65, 0.05);
      const bezelMat = new THREE.MeshStandardMaterial({ color: 0x18181b, roughness: 0.5 });
      const bezel = new THREE.Mesh(bezelGeo, bezelMat);
      bezel.position.set(0, 0, 0.92);
      bladeGroup.add(bezel);

      // LED Diodes
      const ledGeo = new THREE.SphereGeometry(0.04, 8, 8);
      const ledMat = new THREE.MeshBasicMaterial({ color: 0x00e1cf });
      const led = new THREE.Mesh(ledGeo, ledMat);
      led.position.set(-1.2, 0.15, 0.95);
      bladeGroup.add(led);
      ledMeshes.push(led);

      // Drive Bays
      for (let d = 0; d < 4; d++) {
        const driveGeo = new THREE.BoxGeometry(0.35, 0.45, 0.03);
        const driveMat = new THREE.MeshStandardMaterial({ color: 0x3f3f46, metalness: 0.6 });
        const drive = new THREE.Mesh(driveGeo, driveMat);
        drive.position.set(-0.6 + d * 0.45, 0, 0.94);
        bladeGroup.add(drive);
      }

      (bladeGroup as any).userData = { nodeIndex: idx };
      scene.add(bladeGroup);
      bladeMeshes.push(bladeGroup);
    });

    // Fiber Optic Laser Cable Lines
    const cableCurve = new THREE.CatmullRomCurve3([
      new THREE.Vector3(1.3, 2.5, 1.0),
      new THREE.Vector3(1.6, 1.5, 1.2),
      new THREE.Vector3(1.3, -1.5, 1.0),
      new THREE.Vector3(1.3, -2.5, 1.0),
    ]);
    const cableGeo = new THREE.TubeGeometry(cableCurve, 30, 0.03, 8, false);
    const cableMat = new THREE.MeshBasicMaterial({ color: 0x00e1cf });
    const cable = new THREE.Mesh(cableGeo, cableMat);
    scene.add(cable);

    // Raycaster for mouse clicks
    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();

    // Mouse Drag Rotation
    let isDragging = false;
    let prevMouseX = 0;
    let prevMouseY = 0;
    let targetRotY = 0.45;
    let targetRotX = 0.15;

    const onMouseDown = (e: MouseEvent) => {
      isDragging = true;
      prevMouseX = e.clientX;
      prevMouseY = e.clientY;
    };

    const onMouseMove = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      mouse.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      mouse.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;

      if (isDragging) {
        const deltaX = e.clientX - prevMouseX;
        const deltaY = e.clientY - prevMouseY;
        targetRotY += deltaX * 0.008;
        targetRotX = Math.max(-0.4, Math.min(0.6, targetRotX + deltaY * 0.008));
        prevMouseX = e.clientX;
        prevMouseY = e.clientY;
      }
    };

    const onMouseUp = (e: MouseEvent) => {
      if (!isDragging) return;
      isDragging = false;

      // Detect Click
      const rect = container.getBoundingClientRect();
      mouse.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      mouse.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;

      raycaster.setFromCamera(mouse, camera);
      const intersects = raycaster.intersectObjects(scene.children, true);

      if (intersects.length > 0) {
        let hitGroup: any = intersects[0].object;
        while (hitGroup.parent && hitGroup.parent !== scene) {
          hitGroup = hitGroup.parent;
        }

        if (hitGroup.userData && typeof hitGroup.userData.nodeIndex === 'number') {
          const idx = hitGroup.userData.nodeIndex;
          soundEngine.playNodeConnect();
          selectedNodeRef.current = selectedNodeRef.current === idx ? null : idx;
          setSelectedNode(selectedNodeRef.current !== null ? SERVER_NODES[selectedNodeRef.current] : null);
          gameEngine.completeQuest('inspect_telemetry');
        }
      }
    };

    container.addEventListener('mousedown', onMouseDown);
    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', onMouseUp);

    // Animation Loop with Visibility & Battery Optimization
    let animationId: number;
    let clock = new THREE.Clock();
    let isRunning = false;
    let isIntersecting = true;

    const animate = () => {
      if (!isRunning) return;
      animationId = requestAnimationFrame(animate);
      const elapsed = clock.getElapsedTime();

      // Smooth camera orbit lerp
      camera.position.x = Math.sin(targetRotY) * 7.5;
      camera.position.z = Math.cos(targetRotY) * 7.5;
      camera.position.y = targetRotX * 6 + 1.5;
      camera.lookAt(0, 0, 0);

      // Animate Server Blade Drawers
      bladeMeshes.forEach((blade, idx) => {
        const isSelected = selectedNodeRef.current === idx;
        const targetZ = isSelected ? 1.4 : 0.2;
        blade.position.z += (targetZ - blade.position.z) * 0.15;

        // Pulse LED Diodes
        const led = ledMeshes[idx];
        if (led) {
          if (chaosActive && idx === 1 && !failoverResolved) {
            // Failed node flashing red
            (led.material as THREE.MeshBasicMaterial).color.setHex(Math.sin(elapsed * 12) > 0 ? 0xef4444 : 0x450a0a);
          } else if (failoverResolved && (idx === 0 || idx === 1)) {
            // Green failover link
            (led.material as THREE.MeshBasicMaterial).color.setHex(0x10b981);
          } else {
            // Normal cyan pulse
            (led.material as THREE.MeshBasicMaterial).color.setHex(Math.sin(elapsed * 4 + idx) > 0.4 ? 0x00e1cf : 0x00665c);
          }
        }
      });

      renderer.render(scene, camera);
    };

    const updateVisibility = () => {
      const isDocVisible = typeof document !== 'undefined' ? !document.hidden : true;
      const isLockdown = typeof document !== 'undefined' ? document.body.classList.contains('sensory-lockdown') : false;
      const shouldRun = isIntersecting && isDocVisible && !isLockdown;

      if (shouldRun && !isRunning) {
        isRunning = true;
        clock.getDelta();
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
      renderer.dispose();
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
    };
  }, [chaosActive, failoverResolved]);

  const triggerChaosOutage = () => {
    soundEngine.playAlertSound();
    setChaosActive(true);
    setFailoverResolved(false);
  };

  const resolveFailover = () => {
    soundEngine.playSuccessChord();
    setFailoverResolved(true);
    gameEngine.completeQuest('server_failover');
    gameEngine.unlockBadge('failover_hero');
  };

  return (
    <div className="relative w-full h-[450px] bg-[#09090b] border border-border-subtle rounded-lg overflow-hidden font-mono select-none">
      {/* 3D Canvas */}
      <div ref={mountRef} className="absolute inset-0 w-full h-full cursor-grab active:cursor-grabbing" />

      {/* Top Controls Bar */}
      <div className="absolute top-3 left-3 right-3 flex flex-wrap items-center justify-between gap-2 z-10 pointer-events-none">
        <div className="flex items-center gap-2 bg-bg/80 border border-border-subtle backdrop-blur-md px-3 py-1.5 rounded-sm">
          <Server size={14} className="text-accent" />
          <span className="text-[11px] font-bold text-text-0 uppercase tracking-widest">
            {isID ? 'CLUSTER RACK 3D' : '3D SERVER RACK CLUSTER'}
          </span>
          <span className="text-[9px] text-text-3 hidden sm:inline">
            ({isID ? 'Klik node untuk membuka blade' : 'Click blade to slide drawer'})
          </span>
        </div>

        <div className="flex items-center gap-2 pointer-events-auto">
          {!chaosActive ? (
            <button
              onClick={triggerChaosOutage}
              className="flex items-center gap-1.5 px-3 py-1 bg-red-500/15 hover:bg-red-500/25 border border-red-500/40 text-red-400 text-[10px] font-bold uppercase rounded-sm transition-all shadow-[0_0_15px_rgba(239,68,68,0.2)] cursor-pointer"
            >
              <AlertTriangle size={12} />
              <span>{isID ? 'SIMULASI GANGGUAN REGION' : 'SIMULATE REGION OUTAGE'}</span>
            </button>
          ) : !failoverResolved ? (
            <button
              onClick={resolveFailover}
              className="flex items-center gap-1.5 px-3 py-1 bg-accent hover:bg-white text-bg text-[10px] font-bold uppercase rounded-sm transition-all shadow-[0_0_20px_rgba(0,225,207,0.4)] animate-pulse cursor-pointer"
            >
              <ShieldCheck size={13} />
              <span>{isID ? 'AKTIFKAN FAILOVER OTOMATIS (+150 XP)' : 'TRIGGER FAILOVER ROUTING (+150 XP)'}</span>
            </button>
          ) : (
            <div className="flex items-center gap-2">
              <span className="text-[10px] text-accent font-bold px-2 py-0.5 bg-accent/10 border border-accent/30 rounded">
                ✓ {isID ? 'FAILOVER NORMAL (99.99% UPTIME)' : 'FAILOVER ACTIVE (99.99% UPTIME)'}
              </span>
              <button
                onClick={() => { setChaosActive(false); setFailoverResolved(false); }}
                className="p-1 text-text-3 hover:text-text-1 border border-border-subtle rounded"
                title="Reset Simulation"
              >
                <RotateCcw size={12} />
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Selected Blade Telemetry Panel */}
      {selectedNode && (
        <div className="absolute bottom-3 left-3 right-3 sm:right-auto sm:w-80 bg-bg/90 border border-accent/40 rounded-sm p-4 backdrop-blur-md shadow-2xl z-10 text-xs font-mono">
          <div className="flex items-center justify-between border-b border-border-subtle pb-2 mb-2.5">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-accent animate-ping" />
              <span className="font-bold text-text-0">{selectedNode.name}: {selectedNode.tech}</span>
            </div>
            <button 
              onClick={() => setSelectedNode(null)} 
              className="text-text-3 hover:text-text-0 text-[10px]"
            >
              [X]
            </button>
          </div>

          <div className="space-y-1.5 text-[11px]">
            <div className="text-text-2 flex justify-between">
              <span className="text-text-3">{isID ? 'Fungsi:' : 'Role:'}</span>
              <span className="font-medium text-text-1">{isID ? selectedNode.roleId : selectedNode.role}</span>
            </div>
            <div className="text-text-2 flex justify-between">
              <span className="text-text-3">Hardware:</span>
              <span className="text-accent">{selectedNode.specs}</span>
            </div>
            <div className="text-text-2 flex justify-between">
              <span className="text-text-3">Throughput:</span>
              <span className="text-text-1 font-bold">{selectedNode.throughput}</span>
            </div>
            <div className="text-text-2 flex justify-between">
              <span className="text-text-3">p99 Latency:</span>
              <span className="text-text-1">{selectedNode.latency}</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
