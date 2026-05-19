'use client';

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Database, Play, Table as TableIcon, Code, Terminal, 
  AlertCircle, BarChart2, History, Cpu, Download, FileDown, 
  Trash2, Sparkles, ChevronDown, ChevronRight, Check, Plus
} from 'lucide-react';
import resumeData from '@/data/cv.json';
import referralsData from '@/data/referrals.json';
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
  })),
  referrals: referralsData.map((node: any, idx: number) => ({
    id: idx + 1,
    name: node.name,
    category: node.category,
    code: node.code,
    benefit: node.benefit,
    status: node.status
  }))
};

// Explicit structural details for Schema Explorer
const SCHEMA_DETAILS = {
  experience: [
    { name: 'id', type: 'INTEGER', primary: true, desc: 'Primary key record identifier' },
    { name: 'role', type: 'VARCHAR(100)', primary: false, desc: 'Corporate role or project assignment' },
    { name: 'company', type: 'VARCHAR(100)', primary: false, desc: 'Company name or project route' },
    { name: 'period', type: 'VARCHAR(50)', primary: false, desc: 'Duration interval formatted text' },
    { name: 'tech_stack', type: 'TEXT', primary: false, desc: 'Comma-separated keywords stack used' },
  ],
  skills: [
    { name: 'id', type: 'INTEGER', primary: true, desc: 'Unique capability identifier' },
    { name: 'category', type: 'VARCHAR(50)', primary: false, desc: 'Capability segment (Language, Infrastructure, Platform)' },
    { name: 'item', type: 'VARCHAR(100)', primary: false, desc: 'Specific technology tool/language signature' },
    { name: 'level', type: 'VARCHAR(50)', primary: false, desc: 'Proficiency level index representation' },
  ],
  education: [
    { name: 'id', type: 'INTEGER', primary: true, desc: 'Academic sequence key identifier' },
    { name: 'institution', type: 'VARCHAR(100)', primary: false, desc: 'Academic institution university name' },
    { name: 'degree', type: 'VARCHAR(100)', primary: false, desc: 'Major concentration level attained' },
    { name: 'period', type: 'VARCHAR(50)', primary: false, desc: 'Enrolled academic span years' },
  ],
  referrals: [
    { name: 'id', type: 'INTEGER', primary: true, desc: 'Portal routing gateway identifier' },
    { name: 'name', type: 'VARCHAR(100)', primary: false, desc: 'Affiliated pipeline software application' },
    { name: 'category', type: 'VARCHAR(50)', primary: false, desc: 'Ingestion classification tag' },
    { name: 'code', type: 'VARCHAR(50)', primary: false, desc: 'Affiliate pipeline link payload key' },
    { name: 'benefit', type: 'VARCHAR(255)', primary: false, desc: 'Download payload payload specifications' },
    { name: 'status', type: 'VARCHAR(20)', primary: false, desc: 'Tunnel pathway connection state' },
  ],
};

const SAVED_QUERIES = [
  { name: 'Get all experience', query: 'SELECT * FROM experience;' },
  { name: 'Languages only', query: "SELECT * FROM skills WHERE category = 'Language';" },
  { name: 'Education history', query: 'SELECT * FROM education;' },
  { name: 'Active referrals/gateways', query: 'SELECT * FROM referrals;' },
  { name: 'Filter high level skills', query: "SELECT item, level FROM skills WHERE category = 'Platform' OR level = 'Cloud-Native';" },
  { name: 'Describe skills schema', query: 'DESCRIBE skills;' }
];

export default function DataLakeClient() {
  const [query, setQuery] = useState('SELECT * FROM experience;');
  const [results, setResults] = useState<any[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isExecuting, setIsExecuting] = useState(false);
  const [viewMode, setViewMode] = useState<'table' | 'chart'>('table');
  
  // Immersive Sidebar & Telemetry states
  const [sidebarTab, setSidebarTab] = useState<'schema' | 'saved' | 'history'>('schema');
  const [expandedTable, setExpandedTable] = useState<string | null>('experience');
  const [history, setHistory] = useState<string[]>([]);
  const [telemetry, setTelemetry] = useState<string[]>([]);
  const [showTelemetryConsole, setShowTelemetryConsole] = useState(true);
  const [copySuccess, setCopySuccess] = useState<string | null>(null);

  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Initialize query history from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('sql_query_history');
    if (saved) {
      try {
        setHistory(JSON.parse(saved));
      } catch (e) {
        console.error('Failed to parse query history', e);
      }
    }
  }, []);

  const saveQueryToHistory = (newQuery: string) => {
    if (!newQuery.trim()) return;
    setHistory(prev => {
      const filtered = prev.filter(q => q.trim() !== newQuery.trim());
      const updated = [newQuery.trim(), ...filtered].slice(0, 15);
      localStorage.setItem('sql_query_history', JSON.stringify(updated));
      return updated;
    });
  };

  const insertTextAtCursor = (text: string) => {
    const textarea = textareaRef.current;
    if (!textarea) {
      setQuery(prev => prev + text);
      return;
    }
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const currentVal = textarea.value;
    const newVal = currentVal.substring(0, start) + text + currentVal.substring(end);
    setQuery(newVal);

    // Maintain focus and reset cursor position right after text
    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(start + text.length, start + text.length);
    }, 20);
  };

  const formatSQL = () => {
    let formatted = query.trim();
    const keywords = [
      'select', 'from', 'where', 'and', 'or', 'order by', 'group by', 
      'limit', 'like', 'desc', 'asc', 'describe', 'desc'
    ];
    keywords.forEach(kw => {
      const regex = new RegExp(`\\b${kw}\\b`, 'gi');
      formatted = formatted.replace(regex, kw.toUpperCase());
    });
    setQuery(formatted);
  };

  const clearEditor = () => {
    setQuery('');
    if (textareaRef.current) {
      textareaRef.current.focus();
    }
  };

  // Natively compile mock SQL inside the frontend client
  const executeQuery = () => {
    if (!query.trim()) return;
    
    setIsExecuting(true);
    setError(null);
    setResults(null);
    setTelemetry([]);

    const tStart = performance.now();
    const logs: string[] = [];
    
    logs.push(`[${new Date().toLocaleTimeString()}] COMPILER_INIT: Activating BigQuery Virtual Engine Core...`);

    setTimeout(() => {
      try {
        let q = query.trim().replace(/;$/, "");
        logs.push(`[PARSER] Lexical scan started: "${q.substring(0, 45)}${q.length > 45 ? '...' : ''}"`);

        // Handle DESCRIBE/DESC queries
        const descMatch = q.match(/^(describe|desc)\s+(\w+)/i);
        if (descMatch) {
          const tableName = descMatch[2].trim().toLowerCase();
          logs.push(`[PLANNER] Executing schema inspector for: '${tableName}'`);
          
          if (!SCHEMA_DETAILS[tableName as keyof typeof SCHEMA_DETAILS]) {
            throw new Error(`Catalog Error: Relation '${tableName}' does not exist in schema schema metadata. Available targets: ${Object.keys(DB).join(', ')}`);
          }
          
          const schema = SCHEMA_DETAILS[tableName as keyof typeof SCHEMA_DETAILS];
          const resultData = schema.map(col => ({
            Column: col.name,
            Data_Type: col.type,
            Is_Key: col.primary ? 'PRI (YES)' : 'NO',
            Description: col.desc
          }));
          
          const tEnd = performance.now();
          logs.push(`[OPTIMIZER] Full schema catalog lookup completed.`);
          logs.push(`[EXECUTOR] Query execution finished successfully in ${(tEnd - tStart).toFixed(2)}ms returning ${resultData.length} entries.`);
          
          setResults(resultData);
          setTelemetry(logs);
          saveQueryToHistory(query);
          setIsExecuting(false);
          return;
        }

        // Parse SELECT and FROM
        const selectMatch = q.match(/select\s+(.+?)\s+from\s+(\w+)/i);
        if (!selectMatch) {
          throw new Error("Syntax Error: Query syntax mismatch. Compile failed. Supported dialects: 'SELECT <columns> FROM <table>' or 'DESCRIBE <table>'");
        }
        
        const columnsPart = selectMatch[1].trim();
        const tableName = selectMatch[2].trim().toLowerCase();
        
        logs.push(`[PARSER] Projection columns resolved: [${columnsPart}]`);
        logs.push(`[PARSER] Relation target determined: '${tableName}'`);
        
        if (!DB[tableName]) {
          throw new Error(`Table Error: Table '${tableName}' not found. Verify schema explorer. Tables available: ${Object.keys(DB).join(', ')}`);
        }
        
        let data = [...DB[tableName]];
        logs.push(`[SCANNER] Sequential table scan on '${tableName}'... [Read: ${data.length} documents]`);
        
        // Parse WHERE supporting multiple conditions (AND) and multiple operators
        const whereMatch = q.match(/where\s+(.+?)(?:\s+group\s+by|\s+order\s+by|\s+limit|$)/i);
        if (whereMatch) {
          const whereClause = whereMatch[1].trim();
          logs.push(`[PLANNER] Filtering rows using predicates: "${whereClause}"`);
          
          // Split on AND/OR (for simplicity and reliability, we parse AND filters)
          const conditions = whereClause.split(/\s+and\s+/i);
          for (const cond of conditions) {
            const condMatch = cond.match(/(\w+)\s*(=|!=|<>|like|>|<|>=|<=)\s*(['"]?)(.*?)\3/i);
            if (condMatch) {
              const col = condMatch[1].trim();
              const op = condMatch[2].toUpperCase();
              let val = condMatch[4].trim();
              
              logs.push(`[SCANNER] Predicate filter: [${col} ${op} '${val}']`);
              
              data = data.filter(row => {
                const cellVal = row[col];
                if (cellVal === undefined) return false;
                
                const strCell = String(cellVal).toLowerCase();
                const strVal = val.toLowerCase();
                
                if (op === '=') {
                  return strCell === strVal;
                } else if (op === '!=' || op === '<>') {
                  return strCell !== strVal;
                } else if (op === 'LIKE') {
                  const cleanedVal = val.replace(/%/g, '').toLowerCase();
                  return strCell.includes(cleanedVal);
                } else {
                  // Numeric inequality computations
                  const numCell = Number(cellVal);
                  const numVal = Number(val);
                  if (isNaN(numCell) || isNaN(numVal)) {
                    // String fallback comparator
                    if (op === '>') return strCell > strVal;
                    if (op === '<') return strCell < strVal;
                    if (op === '>=') return strCell >= strVal;
                    if (op === '<=') return strCell <= strVal;
                    return false;
                  }
                  if (op === '>') return numCell > numVal;
                  if (op === '<') return numCell < numVal;
                  if (op === '>=') return numCell >= numVal;
                  if (op === '<=') return numCell <= numVal;
                  return false;
                }
              });
            } else {
              throw new Error(`Syntax Error in WHERE: predicate chunk "${cond}" contains unmapped operator. Supported: '=', '!=', 'LIKE', '>', '<', '>=', '<='`);
            }
          }
          logs.push(`[PLANNER] Row evaluation complete. [Rows remaining: ${data.length}]`);
        }
        
        // Parse GROUP BY (for aggregation)
        const groupByMatch = q.match(/group\s+by\s+(\w+)/i);
        if (groupByMatch) {
          const groupCol = groupByMatch[1].trim();
          logs.push(`[PLANNER] Transforming dataset via aggregation: GROUP BY [${groupCol}]`);
          
          if (!columnsPart.toLowerCase().includes("count")) {
            throw new Error("Aggregation Error: Queries executing GROUP BY must explicitly specify a COUNT(*) projection.");
          }
          
          const groups: Record<string, number> = {};
          data.forEach(row => {
            const key = String(row[groupCol] || 'Other');
            groups[key] = (groups[key] || 0) + 1;
          });
          
          data = Object.entries(groups).map(([name, count]) => ({
            [groupCol]: name,
            count: count
          }));
          logs.push(`[PLANNER] Consolidated aggregates into ${data.length} distinct grouped rows.`);
        } else {
          // Parse SELECT projections (if not GROUP BY and not "*")
          if (columnsPart !== "*") {
            const cols = columnsPart.split(",").map(c => c.trim());
            logs.push(`[OPTIMIZER] Mapping column projections: [${cols.join(', ')}]`);
            
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
          logs.push(`[PLANNER] Sorting dataset ORDER BY '${sortCol}' [${direction}]`);
          
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
          logs.push(`[PLANNER] Truncating dataset matching LIMIT: ${limitNum}`);
          data = data.slice(0, limitNum);
        }
        
        const tEnd = performance.now();
        logs.push(`[EXECUTOR] Job completed successfully in ${(tEnd - tStart).toFixed(2)}ms returning ${data.length} records.`);
        
        setResults(data);
        setTelemetry(logs);
        saveQueryToHistory(query);
      } catch (err: any) {
        logs.push(`[CRITICAL] SQL Compiler Error: ${err.message || 'General syntactic trace failure'}`);
        setTelemetry(logs);
        setError(err.message || "Execution Error: Invalid SQL syntax.");
      } finally {
        setIsExecuting(false);
      }
    }, 600);
  };

  // Exporters
  const exportToJSON = () => {
    if (!results || results.length === 0) return;
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(results, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `query_lake_results_${Date.now()}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
    triggerCopySuccess('json');
  };

  const exportToCSV = () => {
    if (!results || results.length === 0) return;
    const headers = Object.keys(results[0]);
    const rows = results.map(row => 
      headers.map(header => {
        const val = row[header];
        const str = val === null || val === undefined ? '' : String(val);
        return `"${str.replace(/"/g, '""')}"`;
      }).join(',')
    );
    const csvContent = [headers.join(','), ...rows].join('\n');
    const dataStr = "data:text/csv;charset=utf-8," + encodeURIComponent(csvContent);
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `query_lake_results_${Date.now()}.csv`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
    triggerCopySuccess('csv');
  };

  const triggerCopySuccess = (format: string) => {
    setCopySuccess(format);
    setTimeout(() => setCopySuccess(null), 2000);
  };

  const lineCount = query.split('\n').length;

  return (
    <div className="min-h-screen pb-20 bg-bg text-text-2 relative overflow-hidden">
      <style dangerouslySetInnerHTML={{ __html: `
        #main-layout-container {
          max-width: 1400px !important;
        }
        .hud-widget {
          display: none !important;
        }
      `}} />
      <Navbar />

      {/* Decorative Glow Grid */}
      <div className="absolute top-0 inset-x-0 h-80 bg-gradient-to-b from-accent/5 to-transparent pointer-events-none z-0" />

      <header className="pt-20 pb-8 px-6 border-b border-border-subtle relative z-10">
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
          <div className="font-mono text-[10px] text-accent uppercase tracking-[0.25em] mb-3 flex items-center gap-2">
            <span className="w-1.5 h-1.5 bg-accent rounded-full animate-pulse" /> 
            DATA ARCHIVES // DATA_LAKE_WORKSPACE
          </div>
          <h1 className="text-4xl font-bold text-text-0 mb-4 tracking-tight font-sans">
            Virtual SQL <span className="text-accent underline decoration-accent/20 underline-offset-4">Lake</span>
          </h1>
          <p className="text-text-3 text-[13px] max-w-xl leading-relaxed font-light">
            Query and analyze raw resume datasets in real-time. 
            Write custom SQL queries, investigate relational schemas, or compile dynamic chart structures.
          </p>
        </motion.div>
      </header>

      <div className="flex flex-col lg:flex-row border-b border-border-subtle h-[750px] relative z-10">
        
        {/* Expanded Navigation Sidebar */}
        <div className="w-full lg:w-72 border-r border-border-subtle bg-bg-1/90 flex flex-col h-[300px] lg:h-full overflow-hidden shrink-0">
          
          {/* Tab Selection Header */}
          <div className="flex border-b border-border-subtle font-mono text-[9px] uppercase tracking-wider shrink-0 bg-bg">
            <button 
              onClick={() => setSidebarTab('schema')}
              className={`flex-1 py-3 text-center border-r border-border-subtle transition-all flex items-center justify-center gap-1.5 ${sidebarTab === 'schema' ? 'bg-bg-1 text-accent border-b-2 border-b-accent' : 'text-text-3 hover:text-text-1 bg-bg'}`}
            >
              <Database size={10} /> SCHEMA
            </button>
            <button 
              onClick={() => setSidebarTab('saved')}
              className={`flex-1 py-3 text-center border-r border-border-subtle transition-all flex items-center justify-center gap-1.5 ${sidebarTab === 'saved' ? 'bg-bg-1 text-accent border-b-2 border-b-accent' : 'text-text-3 hover:text-text-1 bg-bg'}`}
            >
              <Code size={10} /> SAVED
            </button>
            <button 
              onClick={() => setSidebarTab('history')}
              className={`flex-1 py-3 text-center transition-all flex items-center justify-center gap-1.5 ${sidebarTab === 'history' ? 'bg-bg-1 text-accent border-b-2 border-b-accent' : 'text-text-3 hover:text-text-1 bg-bg'}`}
            >
              <History size={10} /> HISTORY
            </button>
          </div>

          {/* Tab Content Panel */}
          <div className="flex-1 overflow-y-auto p-4 custom-scrollbar">
            
            {/* Tab 1: Interactive Schema Explorer */}
            {sidebarTab === 'schema' && (
              <div className="space-y-4">
                <div className="text-[9px] font-mono uppercase tracking-widest text-text-3 mb-2 flex items-center gap-1.5">
                  <Database size={11} className="text-accent" /> relational databases
                </div>
                
                <div className="space-y-2">
                  {Object.keys(SCHEMA_DETAILS).map(table => {
                    const isOpen = expandedTable === table;
                    const count = DB[table]?.length || 0;
                    return (
                      <div key={table} className="border border-border-subtle rounded-sm bg-bg/40 hover:border-border-focus transition-all overflow-hidden">
                        
                        {/* Table Accordion Trigger */}
                        <button 
                          onClick={() => setExpandedTable(isOpen ? null : table)}
                          className="w-full text-left px-3 py-2 flex items-center justify-between font-mono text-[11px] hover:bg-bg transition-colors"
                        >
                          <div className="flex items-center gap-2 text-text-1 font-bold">
                            <TableIcon size={12} className="text-accent" />
                            {table}
                          </div>
                          <div className="flex items-center gap-2 text-[9px] text-text-3 font-normal">
                            <span>({count} rows)</span>
                            {isOpen ? <ChevronDown size={11} /> : <ChevronRight size={11} />}
                          </div>
                        </button>

                        {/* Collapsible Details */}
                        <AnimatePresence initial={false}>
                          {isOpen && (
                            <motion.div 
                              initial={{ height: 0 }} 
                              animate={{ height: 'auto' }} 
                              exit={{ height: 0 }}
                              className="overflow-hidden border-t border-border-subtle bg-bg-1/40"
                            >
                              <div className="p-2 space-y-2 font-mono text-[10px]">
                                
                                {/* Quick insert whole table */}
                                <button 
                                  onClick={() => insertTextAtCursor(table)}
                                  className="w-full text-left p-1 border border-dashed border-border-subtle hover:border-accent hover:text-accent rounded-sm text-[9px] flex items-center justify-between transition-colors bg-bg/25"
                                >
                                  <span>[insert table]</span>
                                  <Plus size={8} />
                                </button>
                                
                                <div className="space-y-1.5 pl-1 mt-2">
                                  <div className="text-[8px] uppercase tracking-wider text-text-3 select-none mb-1 font-bold">// FIELDS:</div>
                                  {SCHEMA_DETAILS[table as keyof typeof SCHEMA_DETAILS].map(col => (
                                    <div 
                                      key={col.name} 
                                      className="flex items-center justify-between hover:bg-bg/60 p-1 rounded-sm group relative"
                                    >
                                      {/* Clickable Column insertion */}
                                      <button 
                                        onClick={() => insertTextAtCursor(col.name)}
                                        className="text-left font-bold text-text-2 hover:text-accent transition-colors flex items-center gap-1 shrink-0"
                                        title={`Insert ${col.name}`}
                                      >
                                        <Code size={9} className="text-text-3/60 group-hover:text-accent" />
                                        {col.name}
                                        {col.primary && (
                                          <span className="text-[7px] bg-accent/15 border border-accent/30 text-accent font-bold px-1 rounded-sm">PK</span>
                                        )}
                                      </button>
                                      
                                      {/* Type label */}
                                      <span className="text-[8px] text-text-3 font-normal text-right max-w-[120px] truncate" title={col.desc}>
                                        {col.type}
                                      </span>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Tab 2: Saved Query Catalog */}
            {sidebarTab === 'saved' && (
              <div className="space-y-3">
                <div className="text-[9px] font-mono uppercase tracking-widest text-text-3 mb-2 flex items-center gap-1.5">
                  <Code size={11} className="text-accent" /> predefined routines
                </div>
                
                <div className="space-y-2">
                  {SAVED_QUERIES.map(sq => (
                    <button 
                      key={sq.name}
                      onClick={() => setQuery(sq.query)}
                      className="w-full text-left p-2.5 bg-bg/50 hover:bg-bg border border-border-subtle hover:border-accent/40 rounded-sm font-mono transition-all duration-200 group relative"
                    >
                      <div className="text-[11px] text-text-1 group-hover:text-accent font-bold mb-1 flex items-center gap-1.5 truncate">
                        <Sparkles size={10} className="text-accent/60" /> {sq.name}
                      </div>
                      <div className="text-[9px] text-text-3 font-normal font-mono truncate opacity-60">
                        {sq.query}
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Tab 3: Local Session History */}
            {sidebarTab === 'history' && (
              <div className="space-y-3">
                <div className="text-[9px] font-mono uppercase tracking-widest text-text-3 mb-2 flex items-center gap-1.5">
                  <History size={11} className="text-accent" /> cache trace execution
                </div>
                
                {history.length === 0 ? (
                  <div className="text-center py-8 font-mono text-[10px] text-text-3 opacity-50 select-none">
                    [HISTORY_EMPTY]
                  </div>
                ) : (
                  <div className="space-y-2">
                    {history.map((h, i) => (
                      <button 
                        key={i}
                        onClick={() => setQuery(h)}
                        className="w-full text-left p-2 bg-bg/50 hover:bg-bg border border-border-subtle hover:border-accent/40 rounded-sm font-mono transition-all duration-200 group text-[9px]"
                      >
                        <div className="text-text-2 group-hover:text-accent truncate font-mono">
                          &gt; {h}
                        </div>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            )}

          </div>
        </div>

        {/* Main SQL Console Workspace */}
        <div className="flex-1 flex flex-col bg-bg overflow-hidden h-full">
          
          {/* Query Editor Section */}
          <div className="flex-1 border-b border-border-subtle p-4 flex flex-col relative bg-bg/85 min-h-0 overflow-y-auto">
            
            {/* Editor Utilities Bar */}
            <div className="flex items-center justify-between mb-2 pb-2 border-b border-border-subtle/50 font-mono text-[9px] uppercase tracking-wider select-none">
              <div className="flex items-center gap-2 text-text-3">
                <Terminal size={12} className="text-accent" /> BigQuery_Mock_Console
              </div>
              <div className="flex items-center gap-3">
                <button 
                  onClick={formatSQL}
                  title="Format SQL Keyword Capitalization"
                  className="hover:text-accent transition-colors flex items-center gap-1 px-1.5 py-0.5 rounded-sm hover:bg-bg-1 border border-transparent hover:border-border-subtle"
                >
                  <Sparkles size={9} /> FORMAT
                </button>
                <button 
                  onClick={clearEditor}
                  title="Clear Query Canvas"
                  className="hover:text-red-400 transition-colors flex items-center gap-1 px-1.5 py-0.5 rounded-sm hover:bg-bg-1 border border-transparent hover:border-border-subtle"
                >
                  <Trash2 size={9} /> CLEAR
                </button>
              </div>
            </div>

            {/* Quick Templates Toolbar */}
            <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none font-mono text-[9px] text-text-3 shrink-0">
              <span className="select-none shrink-0">// CONSTRUCT:</span>
              {[
                { label: 'SELECT * FROM', text: 'SELECT * FROM ' },
                { label: 'WHERE', text: ' WHERE ' },
                { label: 'LIKE', text: " LIKE '%" },
                { label: 'ORDER BY', text: ' ORDER BY ' },
                { label: 'LIMIT', text: ' LIMIT ' },
                { label: 'DESCRIBE', text: 'DESCRIBE ' }
              ].map((tmpl, idx) => (
                <button
                  key={idx}
                  onClick={() => insertTextAtCursor(tmpl.text)}
                  className="px-2 py-0.5 border border-border-subtle rounded-sm bg-bg-1 hover:border-accent hover:text-accent transition-all shrink-0 cursor-pointer"
                >
                  {tmpl.label}
                </button>
              ))}
            </div>

            {/* IDE Gutter + Editor Input Area */}
            <div className="flex-1 flex font-mono text-[13px] bg-bg/50 border border-border-subtle focus-within:border-accent/65 transition-colors rounded-sm min-h-[120px] relative overflow-hidden mt-1">
              
              {/* Line numbers gutter */}
              <div className="py-3 px-3 text-right bg-bg-1/60 border-r border-border-subtle select-none text-text-3/30 w-10 font-mono text-[11px] shrink-0">
                {Array.from({ length: Math.max(lineCount, 1) }).map((_, i) => (
                  <div key={i}>{i + 1}</div>
                ))}
              </div>

              {/* Textarea */}
              <textarea 
                ref={textareaRef}
                id="query-editor-textarea"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="flex-1 p-3 bg-transparent resize-none outline-none font-mono text-[13px] text-text-1 focus:text-text-0 transition-colors w-full h-full min-h-0 custom-scrollbar"
                spellCheck={false}
                placeholder="-- Write SQL query or DESCRIBE table..."
              />
            </div>

            {/* Run Button Layout */}
            <div className="mt-3.5 flex justify-between items-center shrink-0">
              <button 
                onClick={() => setShowTelemetryConsole(prev => !prev)}
                className={`font-mono text-[9px] uppercase tracking-wider flex items-center gap-1 hover:text-accent transition-colors ${showTelemetryConsole ? 'text-accent font-bold' : 'text-text-3'}`}
              >
                <Cpu size={11} /> 
                {showTelemetryConsole ? 'Hide Engine Telemetry' : 'Show Engine Telemetry'}
              </button>
              
              <button 
                onClick={executeQuery}
                disabled={isExecuting || !query.trim()}
                className="flex items-center gap-2 px-6 py-2 bg-accent/10 border border-accent/40 text-accent font-mono text-[11px] uppercase tracking-widest hover:bg-accent/20 transition-all disabled:opacity-50 disabled:pointer-events-none rounded-sm"
              >
                {isExecuting ? <span className="animate-pulse">RUNNING...</span> : 'RUN_QUERY()'}
                {!isExecuting && <Play size={11} fill="currentColor" />}
              </button>
            </div>
          </div>



          {/* Query Output / Results Grid */}
          <div className="h-[350px] p-4 bg-bg-1/80 overflow-auto relative custom-scrollbar flex-1 flex flex-col">
            
            {isExecuting ? (
               <div className="flex-1 flex flex-col items-center justify-center text-accent/60 font-mono text-[11px] tracking-[0.2em] gap-4">
                 <div className="w-8 h-8 rounded-full border-t-2 border-accent animate-spin" />
                 EXECUTING_JOB_ID: {Math.random().toString(36).substring(7).toUpperCase()}
               </div>
            ) : error ? (
               <div className="flex-1 flex items-center justify-center text-red-400 font-mono text-[12px] flex-col gap-2.5 text-center p-6 bg-red-950/5 border border-red-500/10 rounded-sm">
                 <AlertCircle size={24} className="text-red-500 animate-bounce" />
                 <div className="font-bold uppercase tracking-wider">[EXECUTION_PLAN_FAILED]</div>
                 <p className="max-w-md text-[11px] text-text-3 leading-relaxed">{error}</p>
               </div>
            ) : results ? (
               <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex-1 flex flex-col min-h-0">
                 
                 {/* Output Header Panel */}
                 <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-4 font-mono select-none shrink-0 border-b border-border-subtle/30 pb-3">
                   
                   <div className="text-[10px] text-text-3 uppercase tracking-widest flex items-center gap-1.5">
                     <Check size={11} className="text-accent" /> Completed ({results.length} rows returned)
                   </div>
                   
                   <div className="flex flex-wrap items-center gap-3">
                     
                     {/* Export suite */}
                     <div className="flex border border-border-subtle rounded-sm font-mono text-[9px] uppercase tracking-wider overflow-hidden">
                       <button 
                         onClick={exportToJSON}
                         className="px-2.5 py-1 flex items-center gap-1 bg-bg hover:bg-bg-1 text-text-2 hover:text-accent transition-colors border-r border-border-subtle"
                       >
                         {copySuccess === 'json' ? <Check size={10} className="text-green-400" /> : <Download size={10} />}
                         JSON
                       </button>
                       <button 
                         onClick={exportToCSV}
                         className="px-2.5 py-1 flex items-center gap-1 bg-bg hover:bg-bg-1 text-text-2 hover:text-accent transition-colors"
                       >
                         {copySuccess === 'csv' ? <Check size={10} className="text-green-400" /> : <FileDown size={10} />}
                         CSV
                       </button>
                     </div>

                     {/* Visualization Mode tabs */}
                     <div className="flex border border-border-subtle rounded-sm font-mono text-[9px] uppercase tracking-widest overflow-hidden">
                       <button 
                         onClick={() => setViewMode('table')}
                         className={`px-3 py-1 flex items-center gap-1.5 transition-colors ${viewMode === 'table' ? 'bg-accent/15 text-accent' : 'text-text-3 hover:bg-bg'}`}
                       >
                         <TableIcon size={10} /> Table
                       </button>
                       <button 
                         onClick={() => setViewMode('chart')}
                         className={`px-3 py-1 flex items-center gap-1.5 transition-colors border-l border-border-subtle ${viewMode === 'chart' ? 'bg-accent/15 text-accent' : 'text-text-3 hover:bg-bg'}`}
                       >
                         <BarChart2 size={10} /> Chart
                       </button>
                     </div>

                   </div>
                 </div>
                 
                 {/* Dynamic Table/Chart view container */}
                 <div className="flex-1 overflow-auto min-h-0 bg-bg/35 border border-border-subtle/50 rounded-sm custom-scrollbar p-1">
                   {viewMode === 'table' ? (
                     <table className="w-full text-left font-mono text-[12px] border-collapse">
                       <thead className="text-text-3 bg-bg-1/80 sticky top-0 z-20">
                         <tr>
                           {Object.keys(results[0] || {}).map(k => (
                             <th key={k} className="p-2 border-b border-border-subtle uppercase font-bold text-[10px] tracking-wider select-none">{k}</th>
                           ))}
                         </tr>
                       </thead>
                       <tbody>
                         {results.map((row, i) => (
                           <tr key={i} className="border-b border-border-subtle/20 hover:bg-bg/40 transition-colors text-text-2 font-mono">
                             {Object.values(row).map((val: any, j) => (
                               <td key={j} className="p-2 align-top break-words max-w-[280px]">
                                 {val === null || val === undefined ? (
                                   <span className="opacity-30 italic">NULL</span>
                                 ) : typeof val === 'string' && val.includes(',') ? (
                                   <div className="flex flex-wrap gap-1 mt-0.5">
                                     {val.split(',').map((tag: string, tid: number) => (
                                       <span key={tid} className="text-[9px] bg-bg border border-border-subtle px-1.5 py-0.5 rounded-sm font-mono font-normal">
                                         {tag.trim()}
                                       </span>
                                     ))}
                                   </div>
                                 ) : (
                                   val
                                 )}
                               </td>
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
               <div className="flex-1 flex flex-col items-center justify-center text-text-3/40 font-mono text-[10px] uppercase tracking-[0.25em] select-none gap-2">
                 <Terminal size={24} className="opacity-30 animate-pulse" />
                 Awaiting_Query_Parameters...
               </div>
            )}
          </div>

          {/* Engine Telemetry Console terminal */}
          <AnimatePresence>
            {showTelemetryConsole && telemetry.length > 0 && (
              <motion.div 
                initial={{ height: 0 }}
                animate={{ height: 160 }}
                exit={{ height: 0 }}
                className="border-t border-border-subtle bg-black/90 p-3.5 font-mono text-[10px] leading-relaxed text-accent/80 overflow-y-auto custom-scrollbar shrink-0 relative"
              >
                <div className="sticky top-0 right-0 flex justify-end pb-1 bg-black/90 text-[8px] text-text-3 uppercase tracking-wider select-none font-bold">
                  // compiler trace output
                </div>
                {telemetry.map((log, idx) => (
                  <div key={idx} className="whitespace-pre-wrap font-mono">
                    {log}
                  </div>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
