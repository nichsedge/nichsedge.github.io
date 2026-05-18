'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Database, Play, Table as TableIcon, Code, Terminal, AlertCircle, BarChart2 } from 'lucide-react';
import resumeData from '@/data/cv.json';
import { Navbar } from '@/components/navbar';
import { DataVisualizer } from '@/components/data-visualizer';

const formatPeriod = (period: any, yearOnly = false) => {
  if (!period) return '';
  if (typeof period === 'string') return period;
  const formatDate = (d: string | null) => {
    if (!d || d === 'Present') return 'Present';
    const parts = d.split('-');
    const year = parts[0];
    if (yearOnly) return year;
    if (parts.length < 2) return d;
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    return `${months[parseInt(parts[1], 10) - 1]} ${year}`;
  };
  return `${formatDate(period.start)} — ${formatDate(period.end)}`;
};

// Dynamically generate DB from resumeData
const DB: Record<string, any[]> = {
  experience: (() => {
    const list: any[] = [];
    let id = 1;
    resumeData.work.forEach(w => {
      list.push({
        id: id++,
        role: w.role,
        company: w.company,
        period: formatPeriod(w.period),
        tech_stack: w.tech.join(', '),
      });
      if (w.projects) {
        w.projects.forEach(p => {
          list.push({
            id: id++,
            role: p.role,
            company: `${w.company} // ${p.role}`,
            period: formatPeriod(p.period),
            tech_stack: p.tech.join(', '),
          });
        });
      }
    });
    return list;
  })(),
  skills: [
    ...resumeData.skills.languages.map((l, i) => ({ id: i, category: 'Language', item: l, level: 'Primary' })),
    ...resumeData.skills.platforms.map((p, i) => ({ id: i + 100, category: 'Platform', item: p, level: 'Advanced' })),
    ...resumeData.skills.infrastructure.map((inf, i) => ({ id: i + 200, category: 'Infrastructure', item: inf, level: 'Cloud-Native' })),
    ...(resumeData.skills.ides || []).map((ide, i) => ({ id: i + 300, category: 'IDE/Tool', item: ide, level: 'Development' })),
  ],
  education: resumeData.education.map((e, idx) => ({
    id: idx + 1,
    institution: e.institution,
    degree: e.degree,
    period: formatPeriod(e.period, true)
  }))
};

const SAVED_QUERIES = [
  { name: 'Get all experience', query: 'SELECT * FROM experience;' },
  { name: 'Languages only', query: "SELECT * FROM skills WHERE category = 'Language';" },
  { name: 'Education history', query: 'SELECT * FROM education;' }
];

export default function DataLakeClient() {
  const [query, setQuery] = useState('SELECT * FROM experience;');
  const [results, setResults] = useState<any[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isExecuting, setIsExecuting] = useState(false);
  const [viewMode, setViewMode] = useState<'table' | 'chart'>('table');

  const executeQuery = () => {
    setIsExecuting(true);
    setError(null);
    setResults(null);

    setTimeout(() => {
      try {
        let q = query.trim().replace(/;$/, "");
        
        // Parse SELECT and FROM
        const selectMatch = q.match(/select\s+(.+?)\s+from\s+(\w+)/i);
        if (!selectMatch) {
          throw new Error("Syntax Error: Query must start with 'SELECT <columns> FROM <table>'");
        }
        
        const columnsPart = selectMatch[1].trim();
        const tableName = selectMatch[2].trim().toLowerCase();
        
        if (!DB[tableName]) {
          throw new Error(`Table Error: Table '${tableName}' does not exist. Available tables: ${Object.keys(DB).join(', ')}`);
        }
        
        let data = [...DB[tableName]];
        
        // Parse WHERE
        const whereMatch = q.match(/where\s+(.+?)(?:\s+group\s+by|\s+order\s+by|\s+limit|$)/i);
        if (whereMatch) {
          const whereClause = whereMatch[1].trim();
          // Support simple equality or LIKE
          const eqMatch = whereClause.match(/(\w+)\s*=\s*'([^']+)'/i);
          const likeMatch = whereClause.match(/(\w+)\s+like\s+'([^']+)'/i);
          
          if (eqMatch) {
            const col = eqMatch[1].trim();
            const val = eqMatch[2].trim().toLowerCase();
            data = data.filter(row => String(row[col] || '').toLowerCase() === val);
          } else if (likeMatch) {
            const col = likeMatch[1].trim();
            const val = likeMatch[2].trim().replace(/%/g, '').toLowerCase();
            data = data.filter(row => String(row[col] || '').toLowerCase().includes(val));
          } else {
            throw new Error("Syntax Error in WHERE clause. Supported operators: '=' and 'LIKE'");
          }
        }
        
        // Parse GROUP BY (for aggregation)
        const groupByMatch = q.match(/group\s+by\s+(\w+)/i);
        if (groupByMatch) {
          const groupCol = groupByMatch[1].trim();
          
          // Let's make sure the select columns are counting or matching
          if (!columnsPart.toLowerCase().includes("count")) {
            throw new Error("Aggregation Error: GROUP BY queries should include COUNT(*) or similar aggregation in SELECT.");
          }
          
          // Group data
          const groups: Record<string, number> = {};
          data.forEach(row => {
            const key = String(row[groupCol] || 'Other');
            groups[key] = (groups[key] || 0) + 1;
          });
          
          // Transform to results format
          data = Object.entries(groups).map(([name, count]) => ({
            [groupCol]: name,
            count: count
          }));
        } else {
          // Parse SELECT projections (if not GROUP BY and not "*")
          if (columnsPart !== "*") {
            const cols = columnsPart.split(",").map(c => c.trim());
            data = data.map(row => {
              const projectedRow: Record<string, any> = {};
              cols.forEach(col => {
                const actualKey = Object.keys(row).find(k => k.toLowerCase() === col.toLowerCase());
                if (actualKey) {
                  projectedRow[actualKey] = row[actualKey];
                } else {
                  projectedRow[col] = null;
                }
              });
              return projectedRow;
            });
          }
        }
        
        // Parse ORDER BY
        const orderByMatch = q.match(/order\s+by\s+(\w+)(?:\s+(asc|desc))?/i);
        if (orderByMatch) {
          const sortCol = orderByMatch[1].trim();
          const direction = (orderByMatch[2] || 'asc').trim().toLowerCase();
          
          data.sort((a, b) => {
            const valA = a[sortCol];
            const valB = b[sortCol];
            if (typeof valA === 'number' && typeof valB === 'number') {
              return direction === 'desc' ? valB - valA : valA - valB;
            }
            return direction === 'desc' 
              ? String(valB || '').localeCompare(String(valA || ''))
              : String(valA || '').localeCompare(String(valB || ''));
          });
        }
        
        // Parse LIMIT
        const limitMatch = q.match(/limit\s+(\d+)/i);
        if (limitMatch) {
          const limitNum = parseInt(limitMatch[1], 10);
          data = data.slice(0, limitNum);
        }
        
        setResults(data);
      } catch (err: any) {
        setError(err.message || "Execution Error: Invalid SQL syntax.");
      } finally {
        setIsExecuting(false);
      }
    }, 800);
  };

  return (
    <div className="min-h-screen pb-20">
      <Navbar />

      <header className="pt-20 pb-8 px-6 border-b border-border-subtle">
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
          <div className="font-mono text-[10px] text-accent uppercase tracking-widest mb-4 flex items-center gap-2">
            <span className="w-1.5 h-1.5 bg-accent rounded-full" /> Archives // Data Lake
          </div>
          <h1 className="text-4xl font-bold text-text-0 mb-4">SQL Workspace</h1>
          <p className="text-text-3 text-[13px] max-w-xl leading-relaxed font-light">
            Query my resume data directly from the raw data lake layer. 
            Select an active table or write your own pseudo-SQL.
          </p>
        </motion.div>
      </header>

      <div className="flex flex-col md:flex-row border-b border-border-subtle h-[600px]">
        {/* Sidebar */}
        <div className="w-full md:w-64 border-r border-border-subtle bg-bg-1 p-4 flex flex-col gap-6 overflow-y-auto">
          <div>
            <div className="text-[10px] font-mono uppercase tracking-widest text-text-3 mb-3 flex items-center gap-2">
              <Database size={12} /> Schema
            </div>
            <div className="space-y-1 pl-2">
              {Object.keys(DB).map(table => (
                <div key={table} className="text-[12px] font-mono text-text-2 flex items-center gap-2 py-1">
                  <TableIcon size={12} className="text-accent/60" /> {table}
                </div>
              ))}
            </div>
          </div>
          
          <div>
            <div className="text-[10px] font-mono uppercase tracking-widest text-text-3 mb-3 flex items-center gap-2">
              <Code size={12} /> Saved Queries
            </div>
            <div className="space-y-2 pl-2">
              {SAVED_QUERIES.map(sq => (
                <button 
                  key={sq.name}
                  onClick={() => setQuery(sq.query)}
                  className="block text-left text-[11px] font-mono text-text-2 hover:text-accent transition-colors py-1 truncate w-full"
                >
                  &gt; {sq.name}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Workspace */}
        <div className="flex-1 flex flex-col bg-bg">
          {/* Query Editor */}
          <div className="flex-1 border-b border-border-subtle p-4 flex flex-col relative group">
            <div className="absolute top-4 right-4 flex items-center gap-2 text-[10px] uppercase font-mono text-text-3 opacity-50">
               <Terminal size={12} /> BigQuery_Mock_Dialect
            </div>
            <textarea 
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="flex-1 w-full bg-transparent resize-none outline-none font-mono text-[13px] text-text-1 focus:text-text-0 transition-colors"
              spellCheck={false}
            />
            <div className="mt-4 flex justify-end">
              <button 
                onClick={executeQuery}
                disabled={isExecuting || !query.trim()}
                className="flex items-center gap-2 px-6 py-2 bg-accent/10 border border-accent/40 text-accent font-mono text-[11px] uppercase tracking-widest hover:bg-accent/20 transition-all disabled:opacity-50"
              >
                {isExecuting ? <span className="animate-pulse">RUNNING...</span> : 'RUN_QUERY()'}
                {!isExecuting && <Play size={12} fill="currentColor" />}
              </button>
            </div>
          </div>

          {/* Results Grid */}
          <div className="h-1/2 p-4 bg-bg-1 overflow-auto relative">
            {isExecuting ? (
               <div className="h-full flex flex-col items-center justify-center text-accent/60 font-mono text-[11px] tracking-widest gap-4">
                 <div className="w-8 h-8 rounded-full border-t-2 border-accent animate-spin" />
                 EXECUTING_JOB_ID: {Math.random().toString(36).substring(7).toUpperCase()}
               </div>
            ) : error ? (
               <div className="h-full flex items-center justify-center text-red-400 font-mono text-[12px] flex-col gap-2 text-center">
                 <AlertCircle size={24} />
                 {error}
               </div>
            ) : results ? (
               <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="w-full h-full flex flex-col">
                 <div className="flex items-center justify-between mb-4">
                   <div className="text-[10px] font-mono text-text-3 uppercase tracking-widest">
                     Job Completed ({results.length} rows)
                   </div>
                   <div className="flex border border-border-subtle rounded-sm font-mono text-[10px] uppercase tracking-widest overflow-hidden">
                     <button 
                       onClick={() => setViewMode('table')}
                       className={`px-3 py-1 flex items-center gap-1.5 transition-colors ${viewMode === 'table' ? 'bg-accent/10 text-accent' : 'text-text-3 hover:bg-bg'}`}
                     >
                       <TableIcon size={10} /> Table
                     </button>
                     <button 
                       onClick={() => setViewMode('chart')}
                       className={`px-3 py-1 flex items-center gap-1.5 transition-colors border-l border-border-subtle ${viewMode === 'chart' ? 'bg-accent/10 text-accent' : 'text-text-3 hover:bg-bg'}`}
                     >
                       <BarChart2 size={10} /> Chart
                     </button>
                   </div>
                 </div>
                 
                 <div className="flex-1 overflow-auto min-h-0">
                   {viewMode === 'table' ? (
                     <table className="w-full text-left font-mono text-[12px]">
                       <thead className="text-text-3 bg-bg">
                         <tr>
                           {Object.keys(results[0] || {}).map(k => (
                             <th key={k} className="p-2 border-b border-border-subtle uppercase font-normal">{k}</th>
                           ))}
                         </tr>
                       </thead>
                       <tbody>
                         {results.map((row, i) => (
                           <tr key={i} className="border-b border-border-subtle/30 hover:bg-bg transition-colors text-text-2">
                             {Object.values(row).map((val: any, j) => (
                               <td key={j} className="p-2">{val}</td>
                             ))}
                           </tr>
                         ))}
                       </tbody>
                     </table>
                   ) : (
                     <DataVisualizer data={results} />
                   )}
                 </div>
               </motion.div>
            ) : (
               <div className="h-full flex items-center justify-center text-text-3/50 font-mono text-[11px] uppercase tracking-widest">
                 NO_DATA_TO_DISPLAY
               </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
