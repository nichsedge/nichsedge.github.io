'use client';

import React, { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import * as THREE from 'three';
import { 
  Sparkles, 
  Maximize2, 
  Minimize2, 
  RotateCcw, 
  ZoomIn, 
  ZoomOut, 
  Play, 
  Pause, 
  X, 
  Database, 
  ExternalLink 
} from 'lucide-react';
import { soundEngine } from '@/lib/audio';
import { gameEngine } from '@/lib/game-engine';

export interface ConstellationNode {
  id: string;
  name: string;
  category: 'languages' | 'databases' | 'engines' | 'cloud';
  level: string;
  experience: string;
  connections: string[];
  color: number;
  colorHex: string;
  position: THREE.Vector3;
}

const CATEGORIES = [
  { id: 'languages', name: 'Languages', nameID: 'Bahasa', color: '#00e1cf' },
  { id: 'databases', name: 'Databases', nameID: 'Basis Data', color: '#3b82f6' },
  { id: 'engines', name: 'Engines', nameID: 'Engine', color: '#f97316' },
  { id: 'cloud', name: 'Cloud & Orchestration', nameID: 'Cloud & Orkestrasi', color: '#10b981' },
] as const;

export const SKILL_NODES: ConstellationNode[] = [
  { 
    id: 'python', 
    name: 'Python', 
    category: 'languages', 
    level: 'Expert', 
    experience: '5+ yrs (PySpark, Scripting, Automation, Fastparquet, Polars)', 
    connections: ['pyspark', 'airflow', 'dbt', 'postgres'], 
    color: 0x00e1cf, 
    colorHex: '#00e1cf',
    position: new THREE.Vector3(-2.6, 1.6, 0.6) 
  },
  { 
    id: 'sql', 
    name: 'Advanced SQL', 
    category: 'languages', 
    level: 'Expert', 
    experience: 'Window functions, CTEs, BigQuery cost tuning, stored procedures, FDW', 
    connections: ['dbt', 'postgres', 'bigquery', 'oracle'], 
    color: 0x00e1cf, 
    colorHex: '#00e1cf',
    position: new THREE.Vector3(2.6, 1.4, -0.6) 
  },
  { 
    id: 'typescript', 
    name: 'TypeScript', 
    category: 'languages', 
    level: 'Advanced', 
    experience: 'Full-stack tooling, Next.js, AI Agent prototyping (ADK, LangChain), APIs', 
    connections: ['python', 'gcp'], 
    color: 0x38bdf8, 
    colorHex: '#38bdf8',
    position: new THREE.Vector3(-1.9, -2.2, 1.2) 
  },
  { 
    id: 'go', 
    name: 'Go (Golang)', 
    category: 'languages', 
    level: 'Proficient', 
    experience: 'High-concurrency backend services, data utilities, Docker microservices', 
    connections: ['postgres', 'docker'], 
    color: 0x00add8, 
    colorHex: '#00add8',
    position: new THREE.Vector3(-3.2, 0.2, 1.8) 
  },
  { 
    id: 'postgres', 
    name: 'PostgreSQL', 
    category: 'databases', 
    level: 'Expert', 
    experience: 'WAL replication, CDC, indexing, partitioning, stored procedures, FDW', 
    connections: ['sql', 'kafka', 'airflow'], 
    color: 0x3b82f6, 
    colorHex: '#3b82f6',
    position: new THREE.Vector3(1.3, -1.8, 1.5) 
  },
  { 
    id: 'bigquery', 
    name: 'Google BigQuery', 
    category: 'databases', 
    level: 'Expert', 
    experience: 'Petabyte DWH, dbt tests, Kimball modeling, cost & slot optimization', 
    connections: ['sql', 'dbt', 'gcp', 'airflow'], 
    color: 0x60a5fa, 
    colorHex: '#60a5fa',
    position: new THREE.Vector3(3.6, 0.2, 1.8) 
  },
  { 
    id: 'oracle', 
    name: 'Oracle Database', 
    category: 'databases', 
    level: 'Advanced', 
    experience: 'Telecom enterprise data models, PL/SQL stored procedures, marts', 
    connections: ['sql', 'airflow', 'hive'], 
    color: 0xea580c, 
    colorHex: '#ea580c',
    position: new THREE.Vector3(2.0, -2.6, -1.5) 
  },
  { 
    id: 'hive', 
    name: 'Apache Hive', 
    category: 'databases', 
    level: 'Advanced', 
    experience: 'Hadoop distributed data warehouse, telecom customer & sales models', 
    connections: ['pyspark', 'oracle', 'sql'], 
    color: 0xfacc15, 
    colorHex: '#facc15',
    position: new THREE.Vector3(-0.5, 3.2, 0.8) 
  },
  { 
    id: 'pyspark', 
    name: 'Apache Spark', 
    category: 'engines', 
    level: 'Expert', 
    experience: 'PySpark distributed dataframe joins, Dataproc batch ETL, shuffle tuning', 
    connections: ['python', 'hive', 'airflow'], 
    color: 0xf97316, 
    colorHex: '#f97316',
    position: new THREE.Vector3(-3.3, -0.6, -1.5) 
  },
  { 
    id: 'kafka', 
    name: 'Apache Kafka', 
    category: 'engines', 
    level: 'Advanced', 
    experience: 'Event streaming, replication pipelines, consumer group partitioning', 
    connections: ['postgres', 'pyspark'], 
    color: 0xec4899, 
    colorHex: '#ec4899',
    position: new THREE.Vector3(0.5, -3.2, 0.2) 
  },
  { 
    id: 'airflow', 
    name: 'Apache Airflow', 
    category: 'cloud', 
    level: 'Expert', 
    experience: 'Complex DAG orchestration, Cloud Composer, backfill ops, SLA monitoring', 
    connections: ['python', 'pyspark', 'dbt', 'bigquery'], 
    color: 0x10b981, 
    colorHex: '#10b981',
    position: new THREE.Vector3(-1.9, 2.4, -1.8) 
  },
  { 
    id: 'dbt', 
    name: 'dbt Core', 
    category: 'cloud', 
    level: 'Expert', 
    experience: 'Data modeling, staging, marts, Elementary DQ tests, lineage verification', 
    connections: ['sql', 'bigquery', 'airflow'], 
    color: 0xf97316, 
    colorHex: '#f97316',
    position: new THREE.Vector3(1.8, 2.2, -1.2) 
  },
  { 
    id: 'gcp', 
    name: 'Google Cloud (GCP)', 
    category: 'cloud', 
    level: 'Expert', 
    experience: 'BigQuery, Cloud Composer, Dataproc, GCS, IAM, cross-platform replication', 
    connections: ['bigquery', 'airflow', 'aws'], 
    color: 0x38bdf8, 
    colorHex: '#38bdf8',
    position: new THREE.Vector3(3.2, -1.1, 2.2) 
  },
  { 
    id: 'aws', 
    name: 'Amazon Web Services (AWS)', 
    category: 'cloud', 
    level: 'Advanced', 
    experience: 'S3 cross-platform replication, Data Engineering on AWS, IAM policies', 
    connections: ['gcp', 'airflow'], 
    color: 0xff9900, 
    colorHex: '#ff9900',
    position: new THREE.Vector3(0.2, 0.8, -2.4) 
  },
  { 
    id: 'docker', 
    name: 'Docker & K8s', 
    category: 'cloud', 
    level: 'Advanced', 
    experience: 'Containerized workloads, Kubernetes orchestration, pipeline deployments', 
    connections: ['airflow', 'gcp', 'go'], 
    color: 0x2563eb, 
    colorHex: '#2563eb',
    position: new THREE.Vector3(-0.8, -1.2, 2.5) 
  },
];

/**
 * Generates an ultra-crisp 256x256 offscreen CanvasTexture with the technology's
 * distinctive vector badge, glowing holographic rim, and monospace identifier.
 */
function createNodeIconTexture(node: ConstellationNode): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 256;
  canvas.height = 256;
  const ctx = canvas.getContext('2d');

  if (!ctx) return new THREE.CanvasTexture(canvas);

  const hex = node.colorHex;

  // 1. Futuristic Holographic Glass Badge Outer Halo
  const grad = ctx.createRadialGradient(128, 100, 15, 128, 100, 85);
  grad.addColorStop(0, 'rgba(15, 23, 42, 0.94)');
  grad.addColorStop(0.85, 'rgba(9, 9, 11, 0.90)');
  grad.addColorStop(1, 'rgba(0, 0, 0, 0.82)');

  ctx.fillStyle = grad;
  ctx.beginPath();
  ctx.arc(128, 100, 72, 0, Math.PI * 2);
  ctx.fill();

  // Glowing Outer Ring
  ctx.save();
  ctx.strokeStyle = hex;
  ctx.lineWidth = 3.5;
  ctx.shadowColor = hex;
  ctx.shadowBlur = 16;
  ctx.beginPath();
  ctx.arc(128, 100, 72, 0, Math.PI * 2);
  ctx.stroke();

  // Subtle concentric inner cyber ring
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.2)';
  ctx.lineWidth = 1;
  ctx.shadowBlur = 0;
  ctx.beginPath();
  ctx.arc(128, 100, 64, 0, Math.PI * 2);
  ctx.stroke();
  ctx.restore();

  // 2. Distinctive Vector Tech Icon Graphic
  ctx.save();
  switch (node.id) {
    case 'python': {
      // Official Python interlocking snake emblems
      ctx.translate(128 - 36, 100 - 36);
      ctx.scale(3, 3);
      const p1 = new Path2D('M11.9 2C8.6 2 8.7 3.5 8.7 3.5v2.6h3.4v.5H5.4S3.7 6.4 3.7 10.3c0 3.8 1.9 3.7 1.9 3.7h1.6v-2.3s-.1-2.7 2.7-2.7h4.7s2.6.1 2.6-2.5V3.5S17.3 2 11.9 2zm-1.8 1.3a.8.8 0 1 1 0 1.6.8.8 0 0 1 0-1.6z');
      const p2 = new Path2D('M12.1 22c3.3 0 3.2-1.5 3.2-1.5v-2.6H11.9v-.5h6.7s1.7.2 1.7-3.7c0-3.8-1.9-3.7-1.9-3.7h-1.6v2.3s.1 2.7-2.7 2.7H9.4s-2.6-.1-2.6 2.5v3.1S6.7 22 12.1 22zm1.8-1.3a.8.8 0 1 1 0-1.6.8.8 0 0 1 0 1.6z');
      ctx.fillStyle = '#38bdf8';
      ctx.fill(p1);
      ctx.fillStyle = '#facc15';
      ctx.fill(p2);
      break;
    }

    case 'sql': {
      // Database cylinders with lightning query bolt
      ctx.translate(128, 98);
      ctx.strokeStyle = '#00e1cf';
      ctx.lineWidth = 3;
      ctx.fillStyle = 'rgba(0, 225, 207, 0.25)';

      // Top cylinder
      ctx.beginPath();
      ctx.ellipse(0, -18, 30, 9, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();

      // Middle tier
      ctx.beginPath();
      ctx.moveTo(-30, -18);
      ctx.lineTo(-30, 2);
      ctx.ellipse(0, 2, 30, 9, 0, Math.PI, 0, true);
      ctx.lineTo(30, -18);
      ctx.stroke();

      // Bottom tier
      ctx.beginPath();
      ctx.moveTo(-30, 2);
      ctx.lineTo(-30, 22);
      ctx.ellipse(0, 22, 30, 9, 0, Math.PI, 0, true);
      ctx.lineTo(30, 2);
      ctx.stroke();

      // Lightning query flash
      ctx.fillStyle = '#facc15';
      ctx.beginPath();
      ctx.moveTo(3, -12);
      ctx.lineTo(-8, 3);
      ctx.lineTo(0, 3);
      ctx.lineTo(-4, 16);
      ctx.lineTo(9, 0);
      ctx.lineTo(1, 0);
      ctx.closePath();
      ctx.fill();
      break;
    }

    case 'typescript': {
      // TypeScript classic square shield with TS monogram
      ctx.translate(128, 98);
      ctx.fillStyle = '#3178c6';
      ctx.beginPath();
      ctx.roundRect(-28, -28, 56, 56, 8);
      ctx.fill();
      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = 2;
      ctx.stroke();

      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 28px monospace';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText('TS', 0, 2);
      break;
    }

    case 'postgres': {
      // PostgreSQL stylized elephant head with tusk
      ctx.translate(128, 98);
      ctx.fillStyle = '#3b82f6';
      ctx.strokeStyle = '#93c5fd';
      ctx.lineWidth = 2.5;

      // Elephant cranium
      ctx.beginPath();
      ctx.arc(-2, -6, 24, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();

      // Trunk
      ctx.beginPath();
      ctx.moveTo(-2, 10);
      ctx.bezierCurveTo(-2, 24, 16, 26, 18, 16);
      ctx.lineWidth = 6;
      ctx.strokeStyle = '#3b82f6';
      ctx.stroke();

      // Curved ivory tusk
      ctx.lineWidth = 3;
      ctx.strokeStyle = '#ffffff';
      ctx.beginPath();
      ctx.moveTo(4, 11);
      ctx.quadraticCurveTo(15, 14, 13, 5);
      ctx.stroke();

      // Eye
      ctx.fillStyle = '#ffffff';
      ctx.beginPath();
      ctx.arc(-7, -8, 3.5, 0, Math.PI * 2);
      ctx.fill();
      break;
    }

    case 'bigquery': {
      // BigQuery 3D isometric warehouse cube + search optic lens
      ctx.translate(128, 98);
      ctx.fillStyle = '#4285f4';
      ctx.beginPath();
      ctx.moveTo(0, -28);
      ctx.lineTo(24, -14);
      ctx.lineTo(0, 0);
      ctx.lineTo(-24, -14);
      ctx.closePath();
      ctx.fill();

      ctx.fillStyle = '#1a73e8';
      ctx.beginPath();
      ctx.moveTo(-24, -14);
      ctx.lineTo(0, 0);
      ctx.lineTo(0, 24);
      ctx.lineTo(-24, 10);
      ctx.closePath();
      ctx.fill();

      ctx.fillStyle = '#669df6';
      ctx.beginPath();
      ctx.moveTo(24, -14);
      ctx.lineTo(0, 0);
      ctx.lineTo(0, 24);
      ctx.lineTo(24, 10);
      ctx.closePath();
      ctx.fill();

      // Magnifying search optic
      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = 3.5;
      ctx.beginPath();
      ctx.arc(8, 2, 11, 0, Math.PI * 2);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(16, 10);
      ctx.lineTo(25, 19);
      ctx.stroke();
      break;
    }

    case 'oracle': {
      // Oracle classic red pill emblem
      ctx.translate(128, 98);
      ctx.strokeStyle = '#ea580c';
      ctx.lineWidth = 4;
      ctx.fillStyle = 'rgba(234, 88, 12, 0.25)';
      ctx.beginPath();
      ctx.roundRect(-34, -18, 68, 36, 18);
      ctx.fill();
      ctx.stroke();

      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 14px "Geist Mono", monospace, sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText('ORACLE', 0, 1);
      break;
    }

    case 'hive': {
      // Apache Hive golden honeycomb hex emblem
      ctx.translate(128, 98);
      ctx.strokeStyle = '#facc15';
      ctx.lineWidth = 3.5;
      ctx.fillStyle = 'rgba(250, 204, 21, 0.22)';
      ctx.beginPath();
      const hexR = 26;
      for (let i = 0; i < 6; i++) {
        const a = (i * Math.PI) / 3;
        const x = hexR * Math.cos(a);
        const y = hexR * Math.sin(a);
        if (i === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.closePath();
      ctx.fill();
      ctx.stroke();

      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 15px "Geist Mono", monospace, sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText('HIVE', 0, 1);
      break;
    }

    case 'pyspark': {
      // Apache Spark radiating starburst / flame
      ctx.translate(128, 98);
      const numRays = 8;
      for (let r = 0; r < numRays; r++) {
        const angle = (r * Math.PI * 2) / numRays;
        ctx.save();
        ctx.rotate(angle);
        ctx.fillStyle = r % 2 === 0 ? '#f97316' : '#facc15';
        ctx.beginPath();
        ctx.moveTo(0, -28);
        ctx.lineTo(6, -6);
        ctx.lineTo(0, 0);
        ctx.lineTo(-6, -6);
        ctx.closePath();
        ctx.fill();
        ctx.restore();
      }
      ctx.fillStyle = '#ffffff';
      ctx.beginPath();
      ctx.arc(0, 0, 7.5, 0, Math.PI * 2);
      ctx.fill();
      break;
    }

    case 'go': {
      // Go (Golang) official cyan badge with GO lettering
      ctx.translate(128, 98);
      ctx.fillStyle = '#00add8';
      ctx.beginPath();
      ctx.arc(0, 0, 26, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = 2.5;
      ctx.stroke();

      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 24px "Geist Mono", monospace, sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText('GO', 0, 2);
      break;
    }

    case 'aws': {
      // Amazon Web Services emblem with orange smile curve
      ctx.translate(128, 98);
      ctx.fillStyle = '#ff9900';
      ctx.font = 'bold 22px "Geist Mono", monospace, sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText('AWS', 0, -6);

      ctx.strokeStyle = '#ff9900';
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.arc(0, 6, 18, 0.2 * Math.PI, 0.8 * Math.PI);
      ctx.stroke();
      break;
    }

    case 'docker': {
      // Docker & Kubernetes container cluster badge
      ctx.translate(128, 98);
      ctx.strokeStyle = '#38bdf8';
      ctx.lineWidth = 3;
      ctx.fillStyle = 'rgba(56, 189, 248, 0.22)';
      ctx.beginPath();
      ctx.arc(0, 0, 26, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();

      // Container blocks
      ctx.fillStyle = '#38bdf8';
      const bW = 6;
      [-9, 0, 9].forEach(bx => {
        ctx.fillRect(bx - bW/2, -4, bW, bW);
        ctx.fillRect(bx - bW/2, 4, bW, bW);
      });
      ctx.fillRect(-bW/2, -12, bW, bW);
      break;
    }

    case 'kafka': {
      // Apache Kafka 3-circle distributed cluster network
      ctx.translate(128, 98);
      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = 3.5;
      const kNodes = [
        { x: -18, y: -16 },
        { x: 18, y: -8 },
        { x: -14, y: 16 }
      ];
      kNodes.forEach(kn => {
        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.lineTo(kn.x, kn.y);
        ctx.stroke();
      });

      ctx.fillStyle = '#ec4899';
      ctx.beginPath();
      ctx.arc(0, 0, 11, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = 2.5;
      ctx.stroke();

      kNodes.forEach(kn => {
        ctx.fillStyle = '#ffffff';
        ctx.beginPath();
        ctx.arc(kn.x, kn.y, 7.5, 0, Math.PI * 2);
        ctx.fill();
      });
      break;
    }

    case 'airflow': {
      // Apache Airflow 4-blade swirl turbine
      ctx.translate(128, 98);
      for (let b = 0; b < 4; b++) {
        ctx.save();
        ctx.rotate((b * Math.PI) / 2);
        ctx.fillStyle = '#10b981';
        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.quadraticCurveTo(18, -10, 24, -22);
        ctx.quadraticCurveTo(8, -18, 0, 0);
        ctx.closePath();
        ctx.fill();
        ctx.restore();
      }
      ctx.fillStyle = '#ffffff';
      ctx.beginPath();
      ctx.arc(0, 0, 6, 0, Math.PI * 2);
      ctx.fill();
      break;
    }

    case 'dbt': {
      // dbt iconic isometric transformation cube
      ctx.translate(128, 98);
      ctx.fillStyle = '#ff694b';
      ctx.beginPath();
      ctx.moveTo(0, -26);
      ctx.lineTo(22, -13);
      ctx.lineTo(0, 0);
      ctx.lineTo(-22, -13);
      ctx.closePath();
      ctx.fill();

      ctx.fillStyle = '#e04e33';
      ctx.beginPath();
      ctx.moveTo(-22, -13);
      ctx.lineTo(0, 0);
      ctx.lineTo(0, 24);
      ctx.lineTo(-22, 11);
      ctx.closePath();
      ctx.fill();

      ctx.fillStyle = '#ff8870';
      ctx.beginPath();
      ctx.moveTo(22, -13);
      ctx.lineTo(0, 0);
      ctx.lineTo(0, 24);
      ctx.lineTo(22, 11);
      ctx.closePath();
      ctx.fill();
      break;
    }

    case 'gcp': {
      // Google Cloud connected 4-node cloud cluster
      ctx.translate(128, 98);
      ctx.fillStyle = 'rgba(56, 189, 248, 0.2)';
      ctx.strokeStyle = '#38bdf8';
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.arc(-10, 2, 14, Math.PI * 0.6, Math.PI * 1.8);
      ctx.arc(4, -10, 16, Math.PI * 1.1, Math.PI * 2);
      ctx.arc(16, 4, 12, Math.PI * 1.6, Math.PI * 0.4);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();

      const dots = [
        { x: -10, y: 2, c: '#4285f4' },
        { x: -2, y: -6, c: '#ea4335' },
        { x: 8, y: -6, c: '#fbbc05' },
        { x: 14, y: 4, c: '#34a853' }
      ];
      dots.forEach(d => {
        ctx.fillStyle = d.c;
        ctx.beginPath();
        ctx.arc(d.x, d.y, 4, 0, Math.PI * 2);
        ctx.fill();
      });
      break;
    }
  }
  ctx.restore();

  // 3. Cyberpunk Monospace Label
  ctx.save();
  ctx.font = 'bold 21px "Geist Mono", monospace, sans-serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillStyle = '#ffffff';
  ctx.shadowColor = hex;
  ctx.shadowBlur = 10;
  ctx.fillText(node.name.toUpperCase(), 128, 198);

  ctx.font = '12px "Geist Mono", monospace, sans-serif';
  ctx.fillStyle = hex;
  ctx.shadowBlur = 0;
  ctx.fillText(`// ${node.category.toUpperCase()}`, 128, 222);
  ctx.restore();

  const texture = new THREE.CanvasTexture(canvas);
  texture.generateMipmaps = true;
  texture.minFilter = THREE.LinearMipmapLinearFilter;
  return texture;
}

export function KnowledgeConstellation({ locale = 'en' }: { locale?: 'en' | 'id' }) {
  const isID = locale === 'id';
  const mountRef = useRef<HTMLDivElement>(null);
  
  const [mounted, setMounted] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [activeSkill, setActiveSkill] = useState<ConstellationNode | null>(null);
  const [hoveredSkill, setHoveredSkill] = useState<ConstellationNode | null>(null);
  const [isAutoRotating, setIsAutoRotating] = useState(true);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([
    'languages', 
    'databases', 
    'engines', 
    'cloud'
  ]);

  const rotationRef = useRef({ rotX: 0, rotY: 0, cameraZ: 7.8 });

  const sceneRefs = useRef<{
    camera?: THREE.PerspectiveCamera;
    renderer?: THREE.WebGLRenderer;
    resetCamera?: () => void;
    zoomBy?: (delta: number) => void;
    updateCategoryVisibility?: (categories: string[]) => void;
  }>({});

  useEffect(() => {
    setMounted(true);
  }, []);

  // Sync body and layout with expand state & prevent background scroll
  useEffect(() => {
    if (isExpanded) {
      document.body.classList.add('graph-open');
      document.body.style.overflow = 'hidden';
    } else {
      document.body.classList.remove('graph-open');
      document.body.style.overflow = '';
    }
    return () => {
      document.body.classList.remove('graph-open');
      document.body.style.overflow = '';
    };
  }, [isExpanded]);

  // Handle ESC key to minimize
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isExpanded) {
        soundEngine.playClick(600);
        setIsExpanded(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isExpanded]);

  // Update 3D nodes visibility when category filter changes
  useEffect(() => {
    sceneRefs.current.updateCategoryVisibility?.(selectedCategories);
  }, [selectedCategories]);

  const toggleCategory = (catId: string) => {
    soundEngine.playClick(750);
    setSelectedCategories(prev => {
      if (prev.includes(catId)) {
        if (prev.length === 1) return prev; // Keep at least one
        return prev.filter(c => c !== catId);
      }
      return [...prev, catId];
    });
  };

  const toggleExpand = () => {
    soundEngine.playClick(isExpanded ? 650 : 850);
    setIsExpanded(prev => !prev);
  };

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    const width = container.clientWidth || 600;
    const height = container.clientHeight || 450;

    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x09090b, 0.02);

    const camera = new THREE.PerspectiveCamera(55, width / height, 0.1, 100);
    camera.position.set(0, 0, rotationRef.current.cameraZ);
    sceneRefs.current.camera = camera;

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container.appendChild(renderer.domElement);
    sceneRefs.current.renderer = renderer;

    // Lights
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.85);
    scene.add(ambientLight);

    const pointLight = new THREE.PointLight(0x00e1cf, 3, 20);
    pointLight.position.set(0, 0, 5);
    scene.add(pointLight);

    const blueLight = new THREE.PointLight(0x38bdf8, 2, 18);
    blueLight.position.set(3, -3, 3);
    scene.add(blueLight);

    // Celestial Starfield
    const starCount = 500;
    const starGeo = new THREE.BufferGeometry();
    const starPos: number[] = [];
    for (let i = 0; i < starCount; i++) {
      starPos.push(
        (Math.random() - 0.5) * 45,
        (Math.random() - 0.5) * 45,
        (Math.random() - 0.5) * 45
      );
    }
    starGeo.setAttribute('position', new THREE.Float32BufferAttribute(starPos, 3));
    const starMat = new THREE.PointsMaterial({ color: 0x71717a, size: 0.1, transparent: true, opacity: 0.6 });
    const stars = new THREE.Points(starGeo, starMat);
    scene.add(stars);

    // Build Skill Planet Meshes and Floating Holographic Icon Sprites
    const nodePlanetGroups: THREE.Group[] = [];
    const nodeSpriteMeshes: THREE.Sprite[] = [];
    const stemLines: THREE.Line[] = [];
    const sphereGeo = new THREE.SphereGeometry(0.35, 18, 18);
    const ringGeo = new THREE.RingGeometry(0.46, 0.54, 24);

    SKILL_NODES.forEach((node, idx) => {
      // 1. Planet Sphere & Ring Group
      const pGroup = new THREE.Group();
      pGroup.position.copy(node.position);

      const sphereMat = new THREE.MeshStandardMaterial({
        color: node.color,
        emissive: node.color,
        emissiveIntensity: 0.45,
        roughness: 0.25,
        metalness: 0.75,
        transparent: true,
        opacity: 1
      });
      const sphere = new THREE.Mesh(sphereGeo, sphereMat);
      pGroup.add(sphere);

      // Orbital Ring
      const ringMat = new THREE.MeshBasicMaterial({ 
        color: node.color, 
        side: THREE.DoubleSide, 
        transparent: true, 
        opacity: 0.45 
      });
      const ring = new THREE.Mesh(ringGeo, ringMat);
      ring.rotation.x = Math.PI / 3;
      pGroup.add(ring);

      (pGroup as any).userData = { nodeIndex: idx, category: node.category };
      scene.add(pGroup);
      nodePlanetGroups.push(pGroup);

      // 2. Glowing Vertical Holographic Stem Line
      const stemGeo = new THREE.BufferGeometry().setFromPoints([
        new THREE.Vector3(node.position.x, node.position.y + 0.35, node.position.z),
        new THREE.Vector3(node.position.x, node.position.y + 0.62, node.position.z)
      ]);
      const stemMat = new THREE.LineDashedMaterial({
        color: node.color,
        transparent: true,
        opacity: 0.5,
        dashSize: 0.05,
        gapSize: 0.05
      });
      const stem = new THREE.Line(stemGeo, stemMat);
      stem.computeLineDistances();
      scene.add(stem);
      stemLines.push(stem);

      // 3. Floating Technology Insignia Billboard Sprite
      const texture = createNodeIconTexture(node);
      const spriteMat = new THREE.SpriteMaterial({
        map: texture,
        transparent: true,
        opacity: 1,
        depthWrite: false
      });
      const sprite = new THREE.Sprite(spriteMat);
      // Billboard sits slightly above the planet
      sprite.position.set(node.position.x, node.position.y + 0.85, node.position.z);
      sprite.scale.set(1.15, 1.15, 1);
      (sprite as any).userData = { nodeIndex: idx, category: node.category };
      scene.add(sprite);
      nodeSpriteMeshes.push(sprite);
    });

    // Constellation Inter-Node Lines
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
    const linesMat = new THREE.LineBasicMaterial({ color: 0x00e1cf, transparent: true, opacity: 0.28 });
    const constellationLines = new THREE.LineSegments(linesGeo, linesMat);
    scene.add(constellationLines);

    // Dynamic Category Visibility Filter
    const updateCategoryVisibility = (activeCats: string[]) => {
      SKILL_NODES.forEach((node, idx) => {
        const isVisible = activeCats.includes(node.category);
        const pGroup = nodePlanetGroups[idx];
        const sprite = nodeSpriteMeshes[idx];
        const stem = stemLines[idx];

        if (pGroup) {
          const sphere = pGroup.children[0] as THREE.Mesh;
          const ring = pGroup.children[1] as THREE.Mesh;
          if (sphere && sphere.material) {
            (sphere.material as THREE.MeshStandardMaterial).opacity = isVisible ? 1 : 0.12;
          }
          if (ring && ring.material) {
            (ring.material as THREE.MeshBasicMaterial).opacity = isVisible ? 0.45 : 0.05;
          }
        }

        if (sprite && sprite.material) {
          sprite.material.opacity = isVisible ? 1 : 0.15;
          sprite.scale.set(isVisible ? 1.15 : 0.7, isVisible ? 1.15 : 0.7, 1);
        }

        if (stem && stem.material) {
          (stem.material as THREE.LineDashedMaterial).opacity = isVisible ? 0.5 : 0.05;
        }
      });
    };

    sceneRefs.current.updateCategoryVisibility = updateCategoryVisibility;
    // Apply current categories filter immediately upon mount/remount
    updateCategoryVisibility(selectedCategories);

    // Interaction, Rotation & Raycasting
    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();
    let isDragging = false;
    let dragStartX = 0;
    let dragStartY = 0;
    let prevX = 0;
    let prevY = 0;
    let rotY = rotationRef.current.rotY;
    let rotX = rotationRef.current.rotX;
    let hoveredNodeIndex: number | null = null;

    const onMouseDown = (e: MouseEvent) => {
      isDragging = true;
      dragStartX = e.clientX;
      dragStartY = e.clientY;
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
        rotationRef.current.rotX = rotX;
        rotationRef.current.rotY = rotY;
        prevX = e.clientX;
        prevY = e.clientY;
      }

      // Raycast detection for hover indicator
      raycaster.setFromCamera(mouse, camera);
      const intersects = raycaster.intersectObjects(scene.children, true);
      let detectedIndex: number | null = null;

      if (intersects.length > 0) {
        for (const hit of intersects) {
          let obj: any = hit.object;
          while (obj && obj !== scene) {
            if (obj.userData && typeof obj.userData.nodeIndex === 'number') {
              detectedIndex = obj.userData.nodeIndex;
              break;
            }
            obj = obj.parent;
          }
          if (detectedIndex !== null) break;
        }
      }

      if (detectedIndex !== hoveredNodeIndex) {
        // Reset old hover scale
        if (hoveredNodeIndex !== null && nodeSpriteMeshes[hoveredNodeIndex]) {
          nodeSpriteMeshes[hoveredNodeIndex].scale.set(1.15, 1.15, 1);
        }
        hoveredNodeIndex = detectedIndex;
        if (detectedIndex !== null) {
          const node = SKILL_NODES[detectedIndex];
          setHoveredSkill(node);
          container.style.cursor = 'pointer';
          if (nodeSpriteMeshes[detectedIndex]) {
            nodeSpriteMeshes[detectedIndex].scale.set(1.35, 1.35, 1);
          }
        } else {
          setHoveredSkill(null);
          container.style.cursor = isDragging ? 'grabbing' : 'grab';
        }
      }
    };

    const onMouseUp = (e: MouseEvent) => {
      if (!isDragging) return;
      isDragging = false;
      container.style.cursor = 'grab';

      // Distinguish click from drag (threshold < 6px)
      const dist = Math.hypot(e.clientX - dragStartX, e.clientY - dragStartY);
      if (dist < 6) {
        raycaster.setFromCamera(mouse, camera);
        const intersects = raycaster.intersectObjects(scene.children, true);

        if (intersects.length > 0) {
          let detectedIndex: number | null = null;
          for (const hit of intersects) {
            let obj: any = hit.object;
            while (obj && obj !== scene) {
              if (obj.userData && typeof obj.userData.nodeIndex === 'number') {
                detectedIndex = obj.userData.nodeIndex;
                break;
              }
              obj = obj.parent;
            }
            if (detectedIndex !== null) break;
          }

          if (detectedIndex !== null) {
            const node = SKILL_NODES[detectedIndex];
            soundEngine.playNodeConnect();
            setActiveSkill(node);
            gameEngine.completeQuest('constellation_galaxy');
            gameEngine.unlockBadge('celestial_stargazer');
          }
        }
      }
    };

    // Wheel Zoom
    const onWheel = (e: WheelEvent) => {
      e.preventDefault();
      camera.position.z = THREE.MathUtils.clamp(camera.position.z + e.deltaY * 0.006, 3.8, 14);
      rotationRef.current.cameraZ = camera.position.z;
    };

    container.addEventListener('mousedown', onMouseDown);
    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', onMouseUp);
    container.addEventListener('wheel', onWheel, { passive: false });

    // Controls exposed to buttons
    sceneRefs.current.resetCamera = () => {
      rotX = 0;
      rotY = 0;
      rotationRef.current.rotX = 0;
      rotationRef.current.rotY = 0;
      rotationRef.current.cameraZ = 7.8;
      camera.position.set(0, 0, 7.8);
      soundEngine.playClick(600);
    };

    sceneRefs.current.zoomBy = (delta: number) => {
      camera.position.z = THREE.MathUtils.clamp(camera.position.z + delta, 3.8, 14);
      rotationRef.current.cameraZ = camera.position.z;
      soundEngine.playClick(800);
    };

    // Animation Loop
    let animationId: number;
    const animate = () => {
      animationId = requestAnimationFrame(animate);

      if (!isDragging && isAutoRotating) {
        rotY += 0.002;
        rotationRef.current.rotY = rotY;
      }

      // Rotate whole constellation system
      scene.rotation.y = rotY;
      scene.rotation.x = rotX;

      // Animate planetary orbital rings
      nodePlanetGroups.forEach(mesh => {
        const ring = mesh.children[1];
        if (ring) {
          ring.rotation.z += 0.02;
        }
      });

      renderer.render(scene, camera);
    };

    animate();

    // High-fidelity dynamic resize observer
    const resizeObserver = new ResizeObserver(entries => {
      for (const entry of entries) {
        const { width: w, height: h } = entry.contentRect;
        if (w > 0 && h > 0) {
          camera.aspect = w / h;
          camera.updateProjectionMatrix();
          renderer.setSize(w, h);
          renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        }
      }
    });
    resizeObserver.observe(container);

    return () => {
      cancelAnimationFrame(animationId);
      resizeObserver.disconnect();
      container.removeEventListener('mousedown', onMouseDown);
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onMouseUp);
      container.removeEventListener('wheel', onWheel);

      sphereGeo.dispose();
      ringGeo.dispose();
      starGeo.dispose();
      linesGeo.dispose();
      renderer.dispose();
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
    };
  }, [isExpanded, isAutoRotating]);

  const renderConstellationUI = () => (
    <>
      {/* 3D Canvas Mount Point */}
      <div ref={mountRef} className="absolute inset-0 w-full h-full cursor-grab active:cursor-grabbing" />

      {/* Top Header & Controls Bar */}
      <div className="absolute top-3 left-3 right-3 z-20 flex items-start justify-between gap-2.5 pointer-events-none">
        {/* Left Side: Title & Filter Pills */}
        <div className="flex flex-wrap items-center gap-2 pointer-events-auto min-w-0">
          <div className="flex items-center gap-2 bg-bg/80 border border-border-subtle backdrop-blur-md px-3 py-1.5 rounded-sm shrink-0">
            <Sparkles size={14} className="text-accent animate-pulse shrink-0" />
            <span className="text-[10px] md:text-[11px] font-bold text-text-0 uppercase tracking-widest whitespace-nowrap">
              {isID ? 'GALAKSI KNOWLEDGE 3D' : '3D KNOWLEDGE CONSTELLATION'}
            </span>
            {hoveredSkill && (
              <span className="text-[10px] text-accent border border-accent/40 bg-accent/10 px-1.5 py-0.5 rounded-sm uppercase font-bold animate-pulse whitespace-nowrap">
                [{hoveredSkill.name}]
              </span>
            )}
          </div>

          {/* Category Filter Pills */}
          <div className="flex flex-wrap items-center gap-1.5">
            {CATEGORIES.map(cat => {
              const isSelected = selectedCategories.includes(cat.id);
              const label = isID ? cat.nameID : cat.name;
              return (
                <button
                  key={cat.id}
                  onClick={() => toggleCategory(cat.id)}
                  className={`px-2 py-0.5 md:py-1 text-[8px] md:text-[9px] font-mono rounded-sm border transition-all flex items-center gap-1.5 select-none cursor-pointer whitespace-nowrap ${
                    isSelected
                      ? 'bg-bg/90 border-accent/60 text-text-0 shadow-[0_0_8px_rgba(0,225,207,0.08)] font-bold'
                      : 'bg-bg-1/40 border-border-subtle text-text-3 hover:border-text-3 hover:text-text-1'
                  }`}
                >
                  <span 
                    className="w-1.5 h-1.5 rounded-full transition-transform shrink-0" 
                    style={{ 
                      backgroundColor: cat.color,
                      boxShadow: isSelected ? `0 0 6px ${cat.color}` : 'none',
                      transform: isSelected ? 'scale(1.2)' : 'none'
                    }} 
                  />
                  <span>{label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Top Right Action Controls: Zoom, Reset, Play/Pause, Maximize/Minimize */}
        <div className="flex items-center gap-1.5 pointer-events-auto shrink-0 ml-auto">
          {/* Camera Reset */}
          <button
            onClick={() => sceneRefs.current.resetCamera?.()}
            className="text-text-3 hover:text-accent bg-bg/70 backdrop-blur border border-border-subtle p-1.5 rounded-sm transition-colors cursor-pointer"
            title={isID ? 'Atur Ulang Tampilan' : 'Reset Camera'}
          >
            <RotateCcw size={12} />
          </button>

          {/* Auto-Rotation Toggle */}
          <button
            onClick={() => {
              soundEngine.playClick(700);
              setIsAutoRotating(prev => !prev);
            }}
            className={`backdrop-blur border border-border-subtle p-1.5 rounded-sm transition-colors cursor-pointer ${
              isAutoRotating ? 'text-accent bg-bg/80 border-accent/40' : 'text-text-3 bg-bg/70 hover:text-text-1'
            }`}
            title={isAutoRotating ? (isID ? 'Jeda Rotasi' : 'Pause Orbit') : (isID ? 'Mulai Rotasi' : 'Resume Orbit')}
          >
            {isAutoRotating ? <Pause size={12} /> : <Play size={12} />}
          </button>

          {/* Zoom In / Out */}
          <button
            onClick={() => sceneRefs.current.zoomBy?.(-1)}
            className="text-text-3 hover:text-accent bg-bg/70 backdrop-blur border border-border-subtle p-1.5 rounded-sm transition-colors cursor-pointer"
            title={isID ? 'Perbesar' : 'Zoom In'}
          >
            <ZoomIn size={12} />
          </button>
          <button
            onClick={() => sceneRefs.current.zoomBy?.(1)}
            className="text-text-3 hover:text-accent bg-bg/70 backdrop-blur border border-border-subtle p-1.5 rounded-sm transition-colors cursor-pointer"
            title={isID ? 'Perkecil' : 'Zoom Out'}
          >
            <ZoomOut size={12} />
          </button>

          {/* Maximize / Minimize Button */}
          <button
            onClick={toggleExpand}
            className="text-text-3 hover:text-accent bg-bg/70 backdrop-blur border border-border-subtle p-1.5 rounded-sm transition-colors cursor-pointer"
            title={isExpanded ? (isID ? 'Perkecil' : 'Minimize') : (isID ? 'Perbesar' : 'Maximize')}
          >
            {isExpanded ? <Minimize2 size={12} /> : <Maximize2 size={12} />}
          </button>
        </div>
      </div>

      {/* Holographic Skill Dossier Drawer */}
      {activeSkill && (
        <div className="absolute bottom-4 left-4 right-4 sm:right-auto sm:max-w-md bg-[#09090b]/95 border border-accent/40 rounded-sm p-4 backdrop-blur-md shadow-2xl z-30 font-mono animate-in fade-in slide-in-from-bottom-3 duration-200">
          <div className="flex items-center justify-between border-b border-border-subtle pb-2.5 mb-3">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-accent animate-ping" />
              <span className="font-bold text-text-0 text-[12px] uppercase tracking-wider">{activeSkill.name}</span>
            </div>
            <button 
              onClick={() => setActiveSkill(null)} 
              className="text-text-3 hover:text-accent p-1 transition-colors cursor-pointer"
            >
              <X size={14} />
            </button>
          </div>

          <div className="space-y-2 text-[10px] text-text-3">
            <div className="flex justify-between items-center">
              <span>{isID ? 'Domain Kategori:' : 'Domain Category:'}</span>
              <span className="font-bold text-accent uppercase tracking-wider">{activeSkill.category}</span>
            </div>
            <div className="flex justify-between items-center">
              <span>{isID ? 'Tingkat Kemahiran:' : 'Proficiency Level:'}</span>
              <span className="text-text-1 font-bold">{activeSkill.level}</span>
            </div>
            <div className="text-text-2 text-[10px] leading-relaxed pt-1.5 border-t border-border-subtle font-light">
              {activeSkill.experience}
            </div>

            <div className="pt-2">
              <span className="text-[9px] text-text-3 uppercase tracking-wider">
                {isID ? `Node Terhubung (${activeSkill.connections.length}):` : `Connected Nodes (${activeSkill.connections.length}):`}
              </span>
              <div className="flex flex-wrap gap-1 mt-1.5">
                {activeSkill.connections.map(c => (
                  <span key={c} className="px-1.5 py-0.5 bg-accent/10 border border-accent/30 text-accent text-[9px] rounded">
                    {c}
                  </span>
                ))}
              </div>
            </div>

            <div className="pt-3 flex gap-2">
              <a
                href={isID ? "/id/data-lake/" : "/data-lake/"}
                className="flex-1 px-3 py-1.5 bg-accent/20 hover:bg-accent/30 border border-accent/40 text-accent text-[9px] font-bold uppercase tracking-wider text-center rounded flex items-center justify-center gap-1 transition-colors cursor-pointer"
              >
                <Database size={10} /> {isID ? 'Kueri Data Lake' : 'Query In Data Lake'}
              </a>
              <a
                href={isID ? "/id/projects/" : "/projects/"}
                className="flex-1 px-3 py-1.5 bg-bg border border-border-subtle hover:border-accent text-text-1 text-[9px] font-bold uppercase tracking-wider text-center rounded flex items-center justify-center gap-1 transition-colors cursor-pointer"
              >
                <ExternalLink size={10} /> {isID ? 'Lihat Proyek' : 'View Repos'}
              </a>
            </div>
          </div>
        </div>
      )}

      {/* Bottom Right Interaction Hint */}
      <div className="absolute bottom-3 right-4 font-mono text-[8px] text-text-3 opacity-60 italic pointer-events-none hidden sm:block">
        {isExpanded 
          ? (isID ? '(drag untuk rotasi, scroll untuk zoom, klik lencana untuk inspeksi)' : '(drag to rotate, scroll to zoom, click badges for dossier)') 
          : (isID ? '(drag untuk rotasi, klik lencana inspeksi • perbesar untuk layar penuh)' : '(drag to rotate, click badges for dossier • expand for fullscreen)')
        }
      </div>
    </>
  );

  if (isExpanded) {
    return (
      <>
        {/* Inline Placeholder to preserve page layout flow */}
        <div className="relative w-full h-[540px] md:h-[600px] border border-dashed border-accent/40 bg-bg-1/40 rounded-sm flex flex-col items-center justify-center gap-3 p-6 text-center font-mono select-none">
          <div className="w-3 h-3 rounded-full bg-accent animate-ping" />
          <div className="text-[12px] text-text-0 font-bold uppercase tracking-widest">
            {isID ? 'GALAKSI 3D SEDANG AKTIF DALAM MODE LAYAR PENUH' : '3D GALAXY ACTIVE IN FULLSCREEN MODE'}
          </div>
          <p className="text-[10px] text-text-3 max-w-sm">
            {isID 
              ? 'Tampilan visualisasi telah dimaksimalkan ke layar penuh tanpa batasan container layout.' 
              : 'Visualization canvas expanded to true fullscreen viewport free from layout constraints.'}
          </p>
          <button
            onClick={toggleExpand}
            className="mt-2 px-3 py-1.5 bg-accent/20 hover:bg-accent/30 border border-accent/50 text-accent text-[10px] font-bold uppercase tracking-wider rounded flex items-center gap-2 cursor-pointer transition-colors"
          >
            <Minimize2 size={12} />
            <span>{isID ? 'Kembalikan Tampilan Normal' : 'Restore Inline View'}</span>
          </button>
        </div>

        {/* True Fullscreen Modal rendered directly into document.body */}
        {mounted && createPortal(
          <div 
            className="fixed inset-0 z-[99999] bg-black/90 backdrop-blur-md flex items-center justify-center p-2 sm:p-4 md:p-6 select-none animate-in fade-in duration-200"
            onClick={(e) => {
              if (e.target === e.currentTarget) toggleExpand();
            }}
          >
            <div className="relative w-full h-full max-w-[100vw] max-h-[100vh] bg-[#09090b] border border-accent/50 shadow-[0_0_60px_rgba(0,225,207,0.15)] overflow-hidden font-mono select-none rounded-sm">
              {renderConstellationUI()}
            </div>
          </div>,
          document.body
        )}
      </>
    );
  }

  return (
    <div className="relative w-full h-[540px] md:h-[600px]">
      <div className="w-full h-full bg-[#09090b] border border-border-subtle overflow-hidden font-mono select-none rounded-sm relative group">
        {renderConstellationUI()}
      </div>
    </div>
  );
}
