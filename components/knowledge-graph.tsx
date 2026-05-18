'use client';

import React, { useEffect, useRef, useState } from 'react';
import * as d3 from 'd3';
import { Maximize2, Minimize2 } from 'lucide-react';
import graphData from '@/data/knowledge-graph.json';

interface Node extends d3.SimulationNodeDatum {
  id: string;
  group: number;
}

interface Link extends d3.SimulationLinkDatum<Node> {
  value: number;
}

const CATEGORIES = [
  { id: 1, name: 'Core Domains', color: '#00e1cf' },
  { id: 2, name: 'Languages', color: '#3b82f6' },
  { id: 3, name: 'Tools & Frameworks', color: '#a855f7' },
  { id: 4, name: 'Databases & Platforms', color: '#f59e0b' },
  { id: 5, name: 'Infrastructure', color: '#10b981' },
  { id: 7, name: 'IDEs & Dev Tools', color: '#f97316' },
  { id: 6, name: 'Projects & Verticals', color: '#ec4899' },
];

export function KnowledgeGraph() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isExpanded, setIsExpanded] = useState(false);
  const [selectedGroups, setSelectedGroups] = useState<number[]>([1, 2, 3, 4, 5, 6, 7]);

  const toggleGroup = (groupId: number) => {
    setSelectedGroups(prev => {
      if (prev.includes(groupId)) {
        if (prev.length === 1) return prev; // Keep at least one group selected
        return prev.filter(g => g !== groupId);
      }
      return [...prev, groupId];
    });
  };

  useEffect(() => {
    const parentSection = containerRef.current?.closest('section');
    if (parentSection) {
      if (isExpanded) {
        parentSection.style.zIndex = '9999';
        document.body.classList.add('graph-open');
      } else {
        parentSection.style.zIndex = '';
        document.body.classList.remove('graph-open');
      }
    }
    return () => {
      if (parentSection) {
        parentSection.style.zIndex = '';
      }
      document.body.classList.remove('graph-open');
    };
  }, [isExpanded]);

  useEffect(() => {
    if (!containerRef.current) return;

    let simulation: d3.Simulation<Node, undefined> | null = null;

    // Small delay to ensure container has resized smoothly before re-measuring bounds
    const timeout = setTimeout(() => {
      if (!containerRef.current) return;
      const width = containerRef.current.clientWidth;
      const height = containerRef.current.clientHeight;

      d3.select(containerRef.current).selectAll('svg').remove();

      const svg = d3.select(containerRef.current)
        .append('svg')
        .attr('width', width)
        .attr('height', height)
        .attr('viewBox', [0, 0, width, height]);

      // Filter and copy nodes/links based on selectedGroups
      const nodes: Node[] = graphData.nodes
        .filter((d: any) => selectedGroups.includes(d.group))
        .map((d: any) => ({ ...d }));

      const nodeIds = new Set(nodes.map(n => n.id));

      const links: Link[] = graphData.links
        .filter((d: any) => nodeIds.has(d.source) && nodeIds.has(d.target))
        .map((d: any) => ({ ...d }));

      simulation = d3.forceSimulation(nodes)
        .force('link', d3.forceLink(links).id((d: any) => d.id).distance(100))
        .force('charge', d3.forceManyBody().strength(-200))
        .force('center', d3.forceCenter(width / 2, height / 2));

      const mainGroup = svg.append('g');

      const zoom = d3.zoom<SVGSVGElement, unknown>()
        .scaleExtent([0.1, 4])
        .on('zoom', (event) => {
          mainGroup.attr('transform', event.transform);
        });

      svg.call(zoom);

      const link = mainGroup.append('g')
        .attr('stroke', '#a1a1aa')
        .attr('stroke-opacity', 0.2)
        .selectAll('line')
        .data(links)
        .join('line');

      const getGroupColor = (group: number) => {
        switch(group) {
          case 1: return '#00e1cf'; // Core: Cyber Cyan
          case 2: return '#3b82f6'; // Languages: Neon Blue
          case 3: return '#a855f7'; // Streaming/Pipelines: Electric Purple
          case 4: return '#f59e0b'; // Databases: Cyber Gold
          case 5: return '#10b981'; // Infra: Emerald Green
          case 6: return '#ec4899'; // Domains: Hot Pink
          case 7: return '#f97316'; // IDEs: Neon Orange
          default: return '#a1a1aa';
        }
      };

      const getNodeRadius = (group: number) => {
        switch(group) {
          case 1: return 8;
          case 2: return 6;
          case 7: return 5.5; // IDEs: Slightly larger node
          default: return 4.5;
        }
      };

      const node = mainGroup.append('g')
        .selectAll('g')
        .data(nodes)
        .join('g')
        .style('cursor', 'pointer')
        .call(d3.drag<any, any>()
          .on('start', dragstarted)
          .on('drag', dragged)
          .on('end', dragended) as any);

      node.append('circle')
        .attr('r', (d: any) => getNodeRadius(d.group))
        .attr('fill', (d: any) => getGroupColor(d.group))
        .attr('fill-opacity', 0.15)
        .attr('stroke', (d: any) => getGroupColor(d.group))
        .attr('stroke-width', 2)
        .style('transition', 'all 0.2s ease');

      node.append('text')
        .attr('x', (d: any) => getNodeRadius(d.group) + 5)
        .attr('y', '0.31em')
        .text((d: any) => d.id)
        .style('font-size', '9px')
        .style('font-family', 'var(--font-mono)')
        .style('fill', '#a1a1aa')
        .style('pointer-events', 'none')
        .style('transition', 'all 0.2s ease');

      node
        .on('mouseenter', (event, d: any) => {
          const connectedNodeIds = new Set<string>();
          connectedNodeIds.add(d.id);
          
          links.forEach((l: any) => {
            if (l.source.id === d.id) connectedNodeIds.add(l.target.id);
            if (l.target.id === d.id) connectedNodeIds.add(l.source.id);
          });

          // Focus nodes
          node.style('opacity', (n: any) => connectedNodeIds.has(n.id) ? 1 : 0.15);
          
          // Hovered node highlight
          node.selectAll('circle')
            .style('fill-opacity', (n: any) => n.id === d.id ? 0.6 : 0.15)
            .style('stroke-width', (n: any) => n.id === d.id ? 3 : 2)
            .style('filter', (n: any) => n.id === d.id ? `drop-shadow(0 0 6px ${getGroupColor(n.group)})` : 'none');

          node.selectAll('text')
            .style('fill', (n: any) => n.id === d.id ? '#ffffff' : (connectedNodeIds.has(n.id) ? '#e4e4e7' : '#52525b'))
            .style('font-weight', (n: any) => n.id === d.id ? 'bold' : 'normal');

          // Highlight connected links
          link
            .style('stroke', (l: any) => (l.source.id === d.id || l.target.id === d.id) ? getGroupColor(d.group) : '#a1a1aa')
            .style('stroke-opacity', (l: any) => (l.source.id === d.id || l.target.id === d.id) ? 0.75 : 0.05)
            .style('stroke-width', (l: any) => (l.source.id === d.id || l.target.id === d.id) ? 2 : 1);
        })
        .on('mouseleave', () => {
          // Reset styles
          node.style('opacity', 1);
          node.selectAll('circle')
            .style('fill-opacity', 0.15)
            .style('stroke-width', 2)
            .style('filter', 'none');
          node.selectAll('text')
            .style('fill', '#a1a1aa')
            .style('font-weight', 'normal');
          link
            .style('stroke', '#a1a1aa')
            .style('stroke-opacity', 0.2)
            .style('stroke-width', 1);
        });

      simulation.on('tick', () => {
        link
          .attr('x1', (d: any) => d.source.x)
          .attr('y1', (d: any) => d.source.y)
          .attr('x2', (d: any) => d.target.x)
          .attr('y2', (d: any) => d.target.y);

        node
          .attr('transform', (d: any) => `translate(${d.x},${d.y})`);
      });

      function dragstarted(event: any) {
        if (!event.active && simulation) simulation.alphaTarget(0.3).restart();
        event.subject.fx = event.subject.x;
        event.subject.fy = event.subject.y;
      }

      function dragged(event: any) {
        event.subject.fx = event.x;
        event.subject.fy = event.y;
      }

      function dragended(event: any) {
        if (!event.active && simulation) simulation.alphaTarget(0);
        event.subject.fx = null;
        event.subject.fy = null;
      }
    }, 200);

    return () => {
      clearTimeout(timeout);
      if (simulation) {
        simulation.stop();
      }
    };
  }, [isExpanded, selectedGroups]);

  return (
    <>
      {isExpanded && (
        <div 
          className="fixed inset-0 bg-black/75 backdrop-blur-sm z-[9999] cursor-zoom-out"
          onClick={() => setIsExpanded(false)}
        />
      )}
      <div className={`transition-all duration-300 ease-in-out ${isExpanded ? 'fixed inset-4 md:inset-12 z-[10000] shadow-2xl' : 'relative w-full h-[400px]'}`}>
        <div className={`w-full h-full border border-border-subtle bg-bg-1 relative overflow-hidden group rounded-sm ${isExpanded ? 'ring-1 ring-accent/20' : ''}`}>
          <div className="absolute top-3 left-4 flex items-center gap-2 z-10">
            <div className="w-2 h-2 rounded-full bg-accent animate-pulse" />
            <span className="font-mono text-[9px] text-text-3 uppercase tracking-widest font-bold">NEURAL_SKILL_GRAPH_v1.0</span>
          </div>

          {/* Category Filter Controls - Only show when expanded */}
          {isExpanded && (
            <div className="absolute top-12 left-4 right-4 md:top-3 md:left-48 md:right-16 z-10 flex flex-wrap gap-1.5 md:gap-2">
              {CATEGORIES.map(cat => {
                const isSelected = selectedGroups.includes(cat.id);
                return (
                  <button
                    key={cat.id}
                    onClick={() => toggleGroup(cat.id)}
                    className={`px-2 py-0.5 md:py-1 text-[8px] md:text-[9px] font-mono rounded-sm border transition-all flex items-center gap-1.5 select-none ${
                      isSelected
                        ? 'bg-bg border-accent/60 text-text-0 shadow-[0_0_8px_rgba(0,225,207,0.05)] font-bold'
                        : 'bg-bg-1/40 border-border-subtle text-text-3 hover:border-text-3 hover:text-text-1'
                    }`}
                  >
                    <span 
                      className="w-1 h-1 md:w-1.5 md:h-1.5 rounded-full transition-transform" 
                      style={{ 
                        backgroundColor: cat.color,
                        boxShadow: isSelected ? `0 0 6px ${cat.color}` : 'none',
                        transform: isSelected ? 'scale(1.2)' : 'none'
                      }} 
                    />
                    <span>{cat.name}</span>
                  </button>
                );
              })}
            </div>
          )}
          
          <button 
            onClick={() => setIsExpanded(!isExpanded)}
            className="absolute top-3 right-4 z-10 text-text-3 hover:text-accent bg-bg/50 backdrop-blur border border-border-subtle p-1.5 rounded-sm transition-colors hidden md:block"
            title={isExpanded ? "Minimize" : "Maximize"}
          >
            {isExpanded ? <Minimize2 size={12} /> : <Maximize2 size={12} />}
          </button>

          <div ref={containerRef} className="w-full h-full cursor-crosshair" />
          <div className="absolute bottom-3 right-4 font-mono text-[8px] text-text-3 opacity-50 italic pointer-events-none">
            (scroll to zoom, drag to pan, drag nodes to rearrange)
          </div>
        </div>
      </div>
    </>
  );
}
