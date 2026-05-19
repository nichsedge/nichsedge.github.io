'use client';
import React, { useMemo, useState, useEffect } from 'react';
import { 
  BarChart, Bar, 
  LineChart, Line, 
  AreaChart, Area, 
  XAxis, YAxis, 
  CartesianGrid, Tooltip, 
  ResponsiveContainer 
} from 'recharts';

export function DataVisualizer({ data }: { data: any[] }) {
  const [chartType, setChartType] = useState<'bar' | 'line' | 'area'>('bar');
  const [xKey, setXKey] = useState<string>('');
  const [yKey, setYKey] = useState<string>('');

  const columns = useMemo(() => {
    if (!data || data.length === 0) return [];
    return Object.keys(data[0]);
  }, [data]);

  // Auto-detect default keys on data load
  useEffect(() => {
    if (!data || data.length === 0) return;
    const sample = data[0];
    let detectedX = '';
    let detectedY = '';

    // Prioritize standard column keys
    for (const key of Object.keys(sample)) {
      if (typeof sample[key] === 'number' && key !== 'id' && !detectedY) {
        detectedY = key;
      } else if (typeof sample[key] === 'string' && key !== 'id' && !detectedX) {
        detectedX = key;
      }
    }

    // Fallbacks
    if (!detectedX) detectedX = Object.keys(sample)[0] || '';
    if (!detectedY) {
      detectedY = Object.keys(sample).find(k => k !== detectedX && typeof sample[k] === 'number') || 
                  Object.keys(sample).find(k => k !== detectedX) || 
                  '';
    }

    setXKey(detectedX);
    setYKey(detectedY);
  }, [data]);

  const tooltipStyle = {
    backgroundColor: '#09090b', 
    border: '1px solid #27272a',
    borderRadius: '2px',
    fontFamily: 'var(--font-mono)',
    fontSize: '11px',
    color: '#d4d4d8'
  };

  const tooltipItemStyle = { 
    color: 'var(--theme-accent, #00e1cf)' 
  };

  if (!data || data.length === 0 || !xKey || !yKey) {
    return (
      <div className="w-full h-full flex items-center justify-center font-mono text-[10px] text-text-3 uppercase tracking-widest opacity-50">
        Incompatible data for visualization
      </div>
    );
  }

  const renderChart = () => {
    switch (chartType) {
      case 'line':
        return (
          <LineChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(161, 161, 170, 0.1)" vertical={false} />
            <XAxis 
              dataKey={xKey} 
              stroke="#a1a1aa" 
              fontSize={10} 
              tickLine={false} 
              axisLine={false}
              tickMargin={10}
            />
            <YAxis 
              stroke="#a1a1aa" 
              fontSize={10} 
              tickLine={false} 
              axisLine={false}
              tickMargin={10}
            />
            <Tooltip 
              cursor={{ stroke: 'rgba(161, 161, 170, 0.15)', strokeWidth: 1 }}
              contentStyle={tooltipStyle}
              itemStyle={tooltipItemStyle}
            />
            <Line 
              type="monotone" 
              dataKey={yKey} 
              stroke="var(--theme-accent, #00e1cf)" 
              strokeWidth={2} 
              dot={{ fill: 'var(--theme-accent, #00e1cf)', r: 3 }} 
              activeDot={{ r: 5 }} 
            />
          </LineChart>
        );
      case 'area':
        return (
          <AreaChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="areaColorAccent" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="var(--theme-accent, #00e1cf)" stopOpacity={0.2}/>
                <stop offset="95%" stopColor="var(--theme-accent, #00e1cf)" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(161, 161, 170, 0.1)" vertical={false} />
            <XAxis 
              dataKey={xKey} 
              stroke="#a1a1aa" 
              fontSize={10} 
              tickLine={false} 
              axisLine={false}
              tickMargin={10}
            />
            <YAxis 
              stroke="#a1a1aa" 
              fontSize={10} 
              tickLine={false} 
              axisLine={false}
              tickMargin={10}
            />
            <Tooltip 
              cursor={{ stroke: 'rgba(161, 161, 170, 0.15)', strokeWidth: 1 }}
              contentStyle={tooltipStyle}
              itemStyle={tooltipItemStyle}
            />
            <Area 
              type="monotone" 
              dataKey={yKey} 
              stroke="var(--theme-accent, #00e1cf)" 
              fillOpacity={1} 
              fill="url(#areaColorAccent)" 
              strokeWidth={2} 
            />
          </AreaChart>
        );
      case 'bar':
      default:
        return (
          <BarChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(161, 161, 170, 0.1)" vertical={false} />
            <XAxis 
              dataKey={xKey} 
              stroke="#a1a1aa" 
              fontSize={10} 
              tickLine={false} 
              axisLine={false}
              tickMargin={10}
            />
            <YAxis 
              stroke="#a1a1aa" 
              fontSize={10} 
              tickLine={false} 
              axisLine={false}
              tickMargin={10}
            />
            <Tooltip 
              cursor={{ fill: 'rgba(161, 161, 170, 0.05)' }}
              contentStyle={tooltipStyle}
              itemStyle={tooltipItemStyle}
            />
            <Bar 
              dataKey={yKey} 
              fill="var(--theme-accent, #00e1cf)" 
              radius={[2, 2, 0, 0]}
              maxBarSize={40}
            />
          </BarChart>
        );
    }
  };

  return (
    <div className="w-full h-full flex flex-col min-h-[260px]">
      {/* Visualizer Customization Controls */}
      <div className="flex flex-wrap items-center gap-4 mb-4 p-2.5 bg-bg border border-border-subtle rounded-sm font-mono text-[9px] uppercase tracking-wider">
        <div className="flex items-center gap-1.5">
          <span className="text-text-3">Chart:</span>
          <select 
            value={chartType} 
            onChange={(e) => setChartType(e.target.value as any)}
            className="bg-bg-1 border border-border-subtle text-text-0 px-2 py-0.5 outline-none rounded-sm cursor-pointer hover:border-accent transition-colors"
          >
            <option value="bar">Bar Chart</option>
            <option value="line">Line Chart</option>
            <option value="area">Area Chart</option>
          </select>
        </div>

        <div className="flex items-center gap-1.5">
          <span className="text-text-3">X-Axis:</span>
          <select 
            value={xKey} 
            onChange={(e) => setXKey(e.target.value)}
            className="bg-bg-1 border border-border-subtle text-text-0 px-2 py-0.5 outline-none rounded-sm cursor-pointer hover:border-accent transition-colors"
          >
            {columns.map(col => (
              <option key={col} value={col}>{col}</option>
            ))}
          </select>
        </div>

        <div className="flex items-center gap-1.5">
          <span className="text-text-3">Y-Axis:</span>
          <select 
            value={yKey} 
            onChange={(e) => setYKey(e.target.value)}
            className="bg-bg-1 border border-border-subtle text-text-0 px-2 py-0.5 outline-none rounded-sm cursor-pointer hover:border-accent transition-colors"
          >
            {columns.map(col => (
              <option key={col} value={col}>{col}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="flex-1 w-full min-h-[200px]">
        <ResponsiveContainer width="100%" height="100%">
          {renderChart()}
        </ResponsiveContainer>
      </div>
    </div>
  );
}

