'use client';

import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { Sparkles } from 'lucide-react';
import { soundEngine } from '@/lib/audio';
import { gameEngine } from '@/lib/game-engine';

interface ConstellationNode {
  id: string;
  name: string;
  category: 'languages' | 'databases' | 'engines' | 'cloud';
  level: string;
  experience: string;
  connections: string[];
  color: number;
  position: THREE.Vector3;
}

const SKILL_NODES: ConstellationNode[] = [
  { id: 'python', name: 'Python', category: 'languages', level: 'Expert', experience: '5+ yrs (PySpark, Fastparquet, Polars)', connections: ['pyspark', 'airflow', 'duckdb'], color: 0x00e1cf, position: new THREE.Vector3(-2.5, 1.5, 0.5) },
  { id: 'sql', name: 'Advanced SQL', category: 'languages', level: 'Expert', experience: 'Window functions, CTEs, BigQuery cost tuning', connections: ['dbt', 'postgres', 'bigquery', 'duckdb'], color: 0x00e1cf, position: new THREE.Vector3(2.5, 1.2, -0.5) },
  { id: 'typescript', name: 'TypeScript', category: 'languages', level: 'Advanced', experience: 'Full-stack tooling, Next.js, APIs', connections: ['python'], color: 0x38bdf8, position: new THREE.Vector3(-1.8, -2.2, 1.2) },
  { id: 'postgres', name: 'PostgreSQL', category: 'databases', level: 'Expert', experience: 'WAL replication, CDC Debezium, partitioning', connections: ['sql', 'kafka', 'duckdb'], color: 0x3b82f6, position: new THREE.Vector3(1.2, -1.8, 1.5) },
  { id: 'bigquery', name: 'Google BigQuery', category: 'databases', level: 'Expert', experience: 'Petabyte data warehouse, BI Engine, slot optimization', connections: ['sql', 'dbt', 'gcp'], color: 0x60a5fa, position: new THREE.Vector3(3.5, 0.2, 1.8) },
  { id: 'clickhouse', name: 'ClickHouse OLAP', category: 'databases', level: 'Advanced', experience: 'Real-time telemetry, materialized columns', connections: ['kafka', 'sql'], color: 0xf59e0b, position: new THREE.Vector3(2.0, -2.5, -1.5) },
  { id: 'iceberg', name: 'Apache Iceberg', category: 'databases', level: 'Advanced', experience: 'Data lake table format, ACID on S3', connections: ['pyspark', 'duckdb'], color: 0x00e1cf, position: new THREE.Vector3(-0.5, 3.2, 0.8) },
  { id: 'pyspark', name: 'Apache Spark', category: 'engines', level: 'Expert', experience: 'Distributed dataframe joins, Delta Lake, catalyst optimizer', connections: ['python', 'iceberg', 'airflow'], color: 0xf97316, position: new THREE.Vector3(-3.2, -0.5, -1.5) },
  { id: 'duckdb', name: 'DuckDB Engine', category: 'engines', level: 'Expert', experience: 'In-process columnar analytics, vectorization', connections: ['python', 'sql', 'iceberg'], color: 0xfacc15, position: new THREE.Vector3(0.2, 0.8, -2.2) },
  { id: 'kafka', name: 'Apache Kafka', category: 'engines', level: 'Advanced', experience: 'Event streaming, consumer group partitioning', connections: ['postgres', 'clickhouse'], color: 0xec4899, position: new THREE.Vector3(0.5, -3.2, 0.2) },
  { id: 'airflow', name: 'Apache Airflow', category: 'cloud', level: 'Expert', experience: 'Complex DAG orchestration, custom operators', connections: ['python', 'pyspark', 'dbt'], color: 0x10b981, position: new THREE.Vector3(-1.8, 2.4, -1.8) },
  { id: 'dbt', name: 'dbt Core', category: 'cloud', level: 'Expert', experience: 'Data modeling, staging, marts, lineage tests', connections: ['sql', 'bigquery', 'airflow'], color: 0xf97316, position: new THREE.Vector3(1.8, 2.2, -1.2) },
  { id: 'gcp', name: 'Google Cloud (GCP)', category: 'cloud', level: 'Advanced', experience: 'GCS, Cloud Composer, IAM, Pub/Sub', connections: ['bigquery', 'airflow'], color: 0x38bdf8, position: new THREE.Vector3(3.2, -1.0, 2.2) },
];

export function KnowledgeConstellation({ locale = 'en' }: { locale?: 'en' | 'id' }) {
  const isID = locale === 'id';
  const mountRef = useRef<HTMLDivElement>(null);
  const [activeSkill, setActiveSkill] = useState<ConstellationNode | null>(null);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    const width = container.clientWidth || 600;
    const height = container.clientHeight || 450;

    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x09090b, 0.02);

    const camera = new THREE.PerspectiveCamera(55, width / height, 0.1, 100);
    camera.position.set(0, 0, 7.5);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container.appendChild(renderer.domElement);

    // Lights
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.8);
    scene.add(ambientLight);

    const pointLight = new THREE.PointLight(0x00e1cf, 3, 20);
    pointLight.position.set(0, 0, 5);
    scene.add(pointLight);

    // 3D Celestial Starfield
    const starCount = 400;
    const starGeo = new THREE.BufferGeometry();
    const starPos: number[] = [];
    for (let i = 0; i < starCount; i++) {
      starPos.push(
        (Math.random() - 0.5) * 40,
        (Math.random() - 0.5) * 40,
        (Math.random() - 0.5) * 40
      );
    }
    starGeo.setAttribute('position', new THREE.Float32BufferAttribute(starPos, 3));
    const starMat = new THREE.PointsMaterial({ color: 0x71717a, size: 0.1, transparent: true, opacity: 0.5 });
    const stars = new THREE.Points(starGeo, starMat);
    scene.add(stars);

    // Create Skill Planet Meshes
    const nodeMeshes: THREE.Group[] = [];
    const sphereGeo = new THREE.SphereGeometry(0.35, 16, 16);
    const ringGeo = new THREE.RingGeometry(0.45, 0.52, 24);

    SKILL_NODES.forEach((node, idx) => {
      const group = new THREE.Group();
      group.position.copy(node.position);

      const mat = new THREE.MeshStandardMaterial({
        color: node.color,
        emissive: node.color,
        emissiveIntensity: 0.4,
        roughness: 0.3,
        metalness: 0.7
      });
      const sphere = new THREE.Mesh(sphereGeo, mat);
      group.add(sphere);

      // Orbital Ring
      const ringMat = new THREE.MeshBasicMaterial({ color: node.color, side: THREE.DoubleSide, transparent: true, opacity: 0.4 });
      const ring = new THREE.Mesh(ringGeo, ringMat);
      ring.rotation.x = Math.PI / 3;
      group.add(ring);

      (group as any).userData = { nodeIndex: idx };
      scene.add(group);
      nodeMeshes.push(group);
    });

    // Draw Constellation Connection Lines
    const linesGeo = new THREE.BufferGeometry();
    const linePositions: number[] = [];
    const nodeMap = new Map<string, ConstellationNode>();
    SKILL_NODES.forEach(n => nodeMap.set(n.id, n));

    SKILL_NODES.forEach(node => {
      node.connections.forEach(targetId => {
        const target = nodeMap.get(targetId);
        if (target) {
          linePositions.push(
            node.position.x, node.position.y, node.position.z,
            target.position.x, target.position.y, target.position.z
          );
        }
      });
    });

    linesGeo.setAttribute('position', new THREE.Float32BufferAttribute(linePositions, 3));
    const linesMat = new THREE.LineBasicMaterial({ color: 0x00e1cf, transparent: true, opacity: 0.25 });
    const constellationLines = new THREE.LineSegments(linesGeo, linesMat);
    scene.add(constellationLines);

    // Mouse Controls & Raycasting
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
        rotX += deltaY * 0.005;
        prevX = e.clientX;
        prevY = e.clientY;
      }
    };

    const onMouseUp = () => {
      if (!isDragging) return;
      isDragging = false;

      raycaster.setFromCamera(mouse, camera);
      const intersects = raycaster.intersectObjects(scene.children, true);

      if (intersects.length > 0) {
        let obj: any = intersects[0].object;
        while (obj.parent && obj.parent !== scene) {
          obj = obj.parent;
        }
        if (obj.userData && typeof obj.userData.nodeIndex === 'number') {
          const node = SKILL_NODES[obj.userData.nodeIndex];
          soundEngine.playNodeConnect();
          setActiveSkill(node);
          gameEngine.completeQuest('constellation_galaxy');
          gameEngine.unlockBadge('celestial_stargazer');
        }
      }
    };

    container.addEventListener('mousedown', onMouseDown);
    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', onMouseUp);

    // Animation Loop
    let animationId: number;
    const animate = () => {
      animationId = requestAnimationFrame(animate);

      if (!isDragging) {
        rotY += 0.002;
      }

      // Rotate whole constellation galaxy
      scene.rotation.y = rotY;
      scene.rotation.x = rotX;

      // Animate pulsing planet rings
      nodeMeshes.forEach(mesh => {
        const ring = mesh.children[1];
        if (ring) {
          ring.rotation.z += 0.02;
        }
      });

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

    return () => {
      cancelAnimationFrame(animationId);
      container.removeEventListener('mousedown', onMouseDown);
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onMouseUp);
      window.removeEventListener('resize', handleResize);
      sphereGeo.dispose();
      ringGeo.dispose();
      starGeo.dispose();
      linesGeo.dispose();
      renderer.dispose();
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
    };
  }, []);

  return (
    <div className="relative w-full h-[450px] bg-[#09090b] border border-border-subtle rounded-lg overflow-hidden font-mono select-none">
      {/* 3D Canvas */}
      <div ref={mountRef} className="absolute inset-0 w-full h-full cursor-grab active:cursor-grabbing" />

      {/* Top Header */}
      <div className="absolute top-3 left-3 right-3 flex items-center justify-between z-10 pointer-events-none">
        <div className="flex items-center gap-2 bg-bg/80 border border-border-subtle backdrop-blur-md px-3 py-1.5 rounded-sm">
          <Sparkles size={14} className="text-accent" />
          <span className="text-[11px] font-bold text-text-0 uppercase tracking-widest">
            {isID ? 'GALAKSI KNOWLEDGE 3D' : '3D KNOWLEDGE CONSTELLATION'}
          </span>
          <span className="text-[9px] text-text-3 hidden sm:inline">
            ({isID ? 'Putar & klik planet teknologi' : 'Orbit & click planets to inspect'})
          </span>
        </div>
      </div>

      {/* Holographic Skill Dossier Modal */}
      {activeSkill && (
        <div className="absolute bottom-3 left-3 right-3 sm:right-auto sm:w-80 bg-bg/95 border border-accent/40 rounded-sm p-4 backdrop-blur-md shadow-2xl z-10 text-xs font-mono">
          <div className="flex items-center justify-between border-b border-border-subtle pb-2 mb-2.5">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-accent animate-pulse" />
              <span className="font-bold text-text-0">{activeSkill.name}</span>
            </div>
            <button 
              onClick={() => setActiveSkill(null)} 
              className="text-text-3 hover:text-text-0 text-[10px]"
            >
              [X]
            </button>
          </div>

          <div className="space-y-2 text-[11px]">
            <div className="flex justify-between">
              <span className="text-text-3">{isID ? 'Kategori:' : 'Category:'}</span>
              <span className="text-accent uppercase">{activeSkill.category}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-text-3">{isID ? 'Tingkat:' : 'Proficiency:'}</span>
              <span className="text-text-1 font-bold">{activeSkill.level}</span>
            </div>
            <div className="text-text-3 text-[10px] leading-relaxed pt-1 border-t border-border-subtle">
              {activeSkill.experience}
            </div>
            <div className="pt-1">
              <span className="text-[9px] text-text-3 uppercase tracking-wider">{isID ? 'Terhubung dengan:' : 'Connected To:'}</span>
              <div className="flex flex-wrap gap-1 mt-1">
                {activeSkill.connections.map(c => (
                  <span key={c} className="px-1.5 py-0.5 bg-bg-1 border border-border-subtle text-accent text-[9px] rounded">
                    {c}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
