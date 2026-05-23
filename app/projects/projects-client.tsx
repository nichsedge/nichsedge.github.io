'use client';

import React, { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ExternalLink, Star, Code, Cpu, Search, Filter, PieChart as PieChartIcon, ArrowRight } from 'lucide-react';
import { Navbar } from '@/components/navbar';
import githubData from '@/data/github_repos_all.json';
import resumeDataEN from '@/data/cv.json';
import resumeDataID from '@/data/cv_id.json';
import { MediaViewer } from '@/components/media-viewer';
import { useWideLayout } from '@/hooks/use-wide-layout';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer
} from 'recharts';

const FADE_UP = {
  initial: { opacity: 0, y: 10 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5 }
};

export default function ProjectsClient({ locale = 'en' }: { locale?: 'en' | 'id' }) {
  const resumeData = locale === 'id' ? resumeDataID : resumeDataEN;
  useWideLayout('lg');
  const [search, setSearch] = useState('');
  const [selectedTopics, setSelectedTopics] = useState<string[]>([]);
  const [showAllLangs, setShowAllLangs] = useState(false);
  const [showAllTopics, setShowAllTopics] = useState(false);
  const [windowWidth, setWindowWidth] = useState(1200);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    setWindowWidth(window.innerWidth);
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const yAxisWidth = windowWidth < 640 ? 70 : 110;
  const formatYAxisTick = (tickItem: string) => {
    return windowWidth < 640 && tickItem.length > 10
      ? `${tickItem.substring(0, 8)}..`
      : tickItem;
  };

  const repos = useMemo(() => {
    return githubData.repos
      .filter(repo => !repo.private && repo.owner_login === 'nichsedge')
      .map(githubRepo => {
        const enrichment = (resumeData as any).projects?.find((p: any) => p.name === githubRepo.name);
        return {
          ...githubRepo,
          media: enrichment?.media
        };
      })
      .sort((a, b) => {
        if (b.stargazers_count !== a.stargazers_count) {
          return b.stargazers_count - a.stargazers_count;
        }
        return new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime();
      });
  }, []);

  const filteredRepos = useMemo(() => {
    return repos.filter(repo => {
      const matchesSearch = repo.name.toLowerCase().includes(search.toLowerCase()) ||
        repo.description?.toLowerCase().includes(search.toLowerCase());
      const matchesTopics = selectedTopics.length === 0 ||
        selectedTopics.every(t => (repo.topics as string[]).includes(t));
      return matchesSearch && matchesTopics;
    });
  }, [search, selectedTopics, repos]);

  const stats = useMemo(() => {
    const totalStars = repos.reduce((acc, r) => acc + r.stargazers_count, 0);
    const languages = [...new Set(repos.map(r => r.language).filter(Boolean))];
    const topTopic = 'life';
    return { totalStars, langCount: languages.length, topTopic, totalCount: repos.length };
  }, [repos]);

  const allLangData = useMemo(() => {
    const counts = repos.reduce((acc, repo) => {
      const lang = repo.language || 'Other';
      acc[lang] = (acc[lang] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return Object.entries(counts)
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value);
  }, [repos]);

  const langData = useMemo(() => {
    const data = showAllLangs ? allLangData : allLangData.slice(0, 5);
    if (showAllLangs) {
      return data.filter(d => d.name !== 'Other');
    }
    return data;
  }, [allLangData, showAllLangs]);

  const allTopicsSorted = useMemo(() => {
    const counts = new Map<string, number>();
    repos.flatMap(r => r.topics).forEach(topic => {
      counts.set(topic, (counts.get(topic) || 0) + 1);
    });
    return Array.from(counts.entries())
      .sort((a, b) => b[1] - a[1]);
  }, [repos]);

  const displayedTopics = useMemo(() => {
    if (showAllTopics) return allTopicsSorted;

    // Always include selected topics, even if they aren't in the top 15
    const top15 = allTopicsSorted.slice(0, 15);
    const selectedNotRestricted = allTopicsSorted.filter(([topic]) =>
      selectedTopics.includes(topic) && !top15.some(([t]) => t === topic)
    );
    return [...top15, ...selectedNotRestricted];
  }, [allTopicsSorted, showAllTopics, selectedTopics]);

  const toggleTopic = (topic: string) => {
    setSelectedTopics(prev =>
      prev.includes(topic) ? prev.filter(t => t !== topic) : [...prev, topic]
    );
  };

  return (
    <div className="min-h-screen pb-20">
      <Navbar />

      <header className="pt-20 pb-12 px-6 border-b border-border-subtle">
        <motion.div {...FADE_UP}>
          <div className="font-mono text-[10px] text-accent uppercase tracking-widest mb-4 flex items-center gap-2">
            <span className="w-1.5 h-1.5 bg-accent rounded-full" /> {locale === 'id' ? 'Arsip // Proyek' : 'Archives // Projects'}
          </div>
          <h1 className="text-4xl font-bold text-text-0 mb-6">{locale === 'id' ? 'Arsip Engineering' : 'Engineering Archive'}</h1>
          <p className="text-text-3 text-[14px] max-w-xl leading-relaxed font-light">
            {locale === 'id' ? 
              'Daftar proyek open-source terkurasi, eksperimen, dan alat tingkat produksi yang dibangun untuk modern data stack.' : 
              'A filtered list of open-source projects, experiments, and production-grade tools built for the modern data stack.'
            }
          </p>
        </motion.div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-12 bg-bg-1 border border-border-subtle p-6 rounded-sm">
          <div className="space-y-1">
            <div className="font-mono text-[9px] uppercase text-text-3 tracking-widest">Total_Repos</div>
            <div className="text-[14px] font-medium text-text-0">{stats.totalCount}</div>
          </div>
          <div className="space-y-1">
            <div className="font-mono text-[9px] uppercase text-text-3 tracking-widest">Cumulative_Stars</div>
            <div className="text-[14px] font-medium text-text-0 flex items-center gap-1">
              <Star size={12} className="text-accent" /> {stats.totalStars}
            </div>
          </div>
          <div className="space-y-1">
            <div className="font-mono text-[9px] uppercase text-text-3 tracking-widest">{locale === 'id' ? 'Stack_Unik' : 'Unique_Stacks'}</div>
            <div className="text-[14px] font-medium text-text-0">{stats.langCount}</div>
          </div>
          <div className="space-y-1">
            <div className="font-mono text-[9px] uppercase text-text-3 tracking-widest">{locale === 'id' ? 'Fokus_Utama' : 'Primary_Focus'}</div>
            <div className="text-[14px] font-medium text-text-0 truncate">#{stats.topTopic}</div>
          </div>
        </div>

        {/* Language Distribution */}
        <motion.div
          {...FADE_UP}
          transition={{ delay: 0.2 }}
          className="mt-6 flex flex-col md:flex-row gap-6 bg-bg-1 border border-border-subtle p-6 rounded-sm"
        >
          <div className="flex-1 space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="font-mono text-[10px] text-text-3 tracking-[0.2em] uppercase flex items-center gap-2">
                <PieChartIcon size={14} className="text-accent" /> {locale === 'id' ? 'Komposisi Teknologi' : 'Tech Composition'}
              </h3>
              {allLangData.length > 5 && (
                <button
                  onClick={() => setShowAllLangs(!showAllLangs)}
                  className="font-mono text-[9px] uppercase tracking-widest text-accent hover:text-text-0 transition-all flex items-center gap-1.5 border border-accent/20 px-2 py-0.5 rounded-sm bg-accent/5 hover:bg-accent/15"
                >
                  {showAllLangs ? (locale === 'id' ? 'Top 5 saja' : 'Show Top 5') : `${locale === 'id' ? 'Semua' : 'Show All'} (${allLangData.length})`}
                  <ArrowRight size={10} className={`transform transition-transform duration-200 ${showAllLangs ? '-rotate-90' : 'rotate-90'}`} />
                </button>
              )}
            </div>
            <div
              className="w-full transition-all duration-300 ease-in-out"
              style={{ height: showAllLangs ? `${Math.max(180, langData.length * 36)}px` : '180px' }}
            >
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={langData} layout="vertical" margin={{ left: 0, right: 20, top: 0, bottom: 0 }}>
                  <XAxis type="number" hide />
                  <YAxis
                    dataKey="name"
                    type="category"
                    stroke="#71717a"
                    fontSize={10}
                    axisLine={false}
                    tickLine={false}
                    width={yAxisWidth}
                    tickFormatter={formatYAxisTick}
                  />
                  <Tooltip
                    cursor={{ fill: 'rgba(0, 225, 207, 0.05)' }}
                    contentStyle={{ backgroundColor: '#18181b', border: '1px solid #27272a', fontSize: '10px' }}
                  />
                  <Bar dataKey="value" fill="#00e1cf" radius={[0, 2, 2, 0]} barSize={12} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
          <div className="w-full md:w-1/3 space-y-4">
            <div className="border-l border-border-subtle pl-4 h-full flex flex-col justify-start gap-4">
              <p className="text-[11px] text-text-2 font-light italic leading-relaxed">
                {locale === 'id' ? 
                  '\"Bahasa pemrograman adalah alat untuk menjalankan misi. Gambaran umum ini mencerminkan perjalanan melintasi berbagai lapisan stack.\"' :
                  '\"Languages are tools for the mission. This overview reflects a journey across layers of the stack.\"'
                }
              </p>
              <div
                className="space-y-2 overflow-y-auto pr-2 scrollbar-thin transition-all duration-300"
                style={{ maxHeight: showAllLangs ? `${Math.max(180, langData.length * 36 - 60)}px` : '180px' }}
              >
                {langData.map((d) => (
                  <div key={d.name} className="flex justify-between items-center text-[10px] font-mono py-0.5">
                    <span className="text-text-3">{d.name}</span>
                    <div className="flex items-center gap-2">
                      <div className="w-20 h-1 bg-border rounded-full overflow-hidden">
                        <div className="h-full bg-accent" style={{ width: `${(d.value / repos.length) * 100}%` }} />
                      </div>
                      <span className="text-accent">{Math.round((d.value / repos.length) * 100)}%</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </motion.div>
      </header>

      {/* Filters */}
      <div className="sticky top-[61px] z-30 bg-bg/85 backdrop-blur-md border-b border-border-subtle px-6 py-4 space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="relative w-full md:max-w-md">
            <Search size={14} className={`absolute left-3 top-1/2 -translate-y-1/2 transition-colors ${search ? 'text-accent' : 'text-text-3'}`} />
            <input
              type="text"
              placeholder={locale === 'id' ? 'Cari proyek...' : 'Search projects...'}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-bg-1 border border-border-subtle rounded-sm py-2 pl-9 pr-4 text-[12px] font-mono outline-none focus:border-accent/40 focus:bg-bg-1/80 transition-all focus:shadow-[0_0_12px_rgba(0,225,207,0.05)] text-text-0"
            />
          </div>

          {selectedTopics.length > 0 && (
            <button
              onClick={() => setSelectedTopics([])}
              className="self-start md:self-auto font-mono text-[9px] uppercase tracking-widest text-red-400 hover:text-red-300 transition-colors border border-red-500/20 px-2 py-1 rounded-sm bg-red-500/5 hover:bg-red-500/10 flex items-center gap-1"
            >
              {locale === 'id' ? 'Reset Filter' : 'Reset Filters'} ({selectedTopics.length})
            </button>
          )}
        </div>

        <div className="flex flex-col gap-2.5">
          <div className="flex items-center justify-between">
            <span className="font-mono text-[9px] text-text-3 uppercase tracking-wider flex items-center gap-1.5">
              <Filter size={10} className="text-accent" /> Topics:
            </span>

            {allTopicsSorted.length > 15 && (
              <button
                onClick={() => setShowAllTopics(!showAllTopics)}
                className="font-mono text-[9px] uppercase tracking-widest text-accent hover:text-text-0 transition-all flex items-center gap-1.5 border border-accent/20 px-2 py-0.5 rounded-sm bg-accent/5 hover:bg-accent/15"
              >
                <span>{showAllTopics ? 'Show Less' : `See all (${allTopicsSorted.length})`}</span>
                <ArrowRight size={10} className={`transform transition-transform duration-200 ${showAllTopics ? '-rotate-90' : 'rotate-90'}`} />
              </button>
            )}
          </div>

          <div className={`flex flex-wrap gap-2 transition-all duration-300 ${showAllTopics
              ? 'max-h-40 overflow-y-auto pr-2 py-2 border border-border-subtle bg-bg-1/25 p-2 rounded-sm shadow-[inset_0_0_12px_rgba(0,225,207,0.02)]'
              : ''
            }`}>
            {displayedTopics.map(([topic, count]) => {
              const isSelected = selectedTopics.includes(topic);
              return (
                <button
                  key={topic}
                  onClick={() => toggleTopic(topic)}
                  className={`px-2 py-1 text-[9px] font-mono rounded-sm border transition-all flex items-center gap-2 select-none ${isSelected
                      ? 'bg-accent/10 border-accent/80 text-accent shadow-[0_0_8px_rgba(0,225,207,0.12)]'
                      : 'bg-bg-1 border-border-subtle text-text-3 hover:border-text-3 hover:text-text-1 hover:bg-bg-1/80'
                    }`}
                >
                  <span>#{topic}</span>
                  <span className={`px-1 rounded-sm text-[8px] font-semibold ${isSelected
                      ? 'bg-accent/25 text-accent'
                      : 'bg-bg-2 text-text-3 border border-border-subtle'
                    }`}>
                    {count}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Project Grid */}
      <div className="px-6 py-12 grid grid-cols-1 md:grid-cols-2 gap-6">
        <AnimatePresence mode="popLayout">
          {filteredRepos.map((repo, idx) => (
            <motion.div
              layout
              key={repo.name}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ delay: idx * 0.05 }}
              className="group bg-bg-1 border border-border-subtle p-6 hover:border-accent/40 transition-all relative overflow-hidden"
            >
              {/* Decorative line */}
              <div className="absolute top-0 right-0 w-12 h-[1px] bg-accent/20" />
              <div className="absolute top-0 right-0 w-[1px] h-12 bg-accent/20" />

              <div className="flex justify-between items-start mb-4">
                <div className="w-8 h-8 bg-accent/10 border border-accent/20 flex items-center justify-center text-accent">
                  {repo.language === 'Python' ? <Cpu size={16} /> : <Code size={16} />}
                </div>
                <div className="flex items-center gap-1.5 text-text-3 font-mono text-[10px]">
                  <Star size={12} className="text-yellow-500/50" /> {repo.stargazers_count}
                </div>
              </div>

              <h3 className="text-md font-bold text-text-0 mb-2 font-mono group-hover:text-accent transition-colors">{repo.name}</h3>
              <p className="text-[12px] text-text-3 font-light mb-6 line-clamp-2 h-9">
                {repo.description || "No description provided."}
              </p>

              {repo.media && (
                <div className="mb-6">
                  <MediaViewer
                    type={repo.media.type as 'image' | 'video'}
                    url={repo.media.url}
                    alt={repo.name}
                  />
                </div>
              )}

              <div className="flex flex-wrap gap-2 mb-8">
                {repo.topics.map(topic => (
                  <span key={topic} className="text-[9px] font-mono text-text-3 opacity-60">#{topic}</span>
                ))}
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-border-subtle mt-auto">
                <span className="text-[10px] font-mono text-accent/60 flex items-center gap-1.5">
                  <div className="w-1.5 h-1.5 rounded-full bg-accent" /> {repo.language || 'Markdown'}
                </span>
                <a
                  href={repo.html_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-text-0 hover:text-accent transition-colors flex items-center gap-1.5 text-[10px] font-mono font-bold uppercase"
                >
                  {locale === 'id' ? 'Sumber' : 'Source'} <ExternalLink size={12} />
                </a>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {filteredRepos.length === 0 && (
        <div className="py-24 text-center">
          <div className="font-mono text-[11px] text-text-3 uppercase tracking-[0.2em] mb-4">
            {locale === 'id' ? 'TIDAK_ADA_PROYEK_YANG_COCOK' : 'NO_MATCHES_FOUND'}
          </div>
          <button onClick={() => { setSearch(''); setSelectedTopics([]); }} className="text-accent underline underline-offset-4 text-[12px] font-mono hover:text-text-0">
            {locale === 'id' ? 'Atur ulang buffer kueri' : 'Reset query buffer'}
          </button>
        </div>
      )}
    </div>
  );
}
