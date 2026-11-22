'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight, ArrowUpRight, Briefcase, Layers, Star } from 'lucide-react';
import resumeDataEN from '@/data/cv.json';
import resumeDataID from '@/data/cv_id.json';
import githubReposAll from '@/data/github_repos_all.json';
import projectScreenshots from '@/data/project-screenshots.json';
import type { ProjectScreenshot } from '@/components/project-gallery';

interface RepoItem {
  name: string;
  owner_login: string;
  html_url: string;
  description: string | null;
  language: string | null;
  stargazers_count: number;
  fork: boolean;
  archived: boolean;
  pushed_at: string;
}

const SELECTED_COMPANIES = [
  'Krom Bank Indonesia',
  'Accenture',
  "NTI (Telkomsel's Project)",
  'Traveloka',
];

const FLAGSHIP_REPOS = ['ierp', 'idx-bei', 'pcomp', 'sansfinance'];

function formatPeriod(start: string, end: string | null, locale: 'en' | 'id') {
  const startYear = start.slice(0, 4);
  if (!end) {
    return `${startYear} — ${locale === 'id' ? 'Sekarang' : 'Present'}`;
  }
  const endYear = end.slice(0, 4);
  return startYear === endYear ? startYear : `${startYear} — ${endYear}`;
}

export function FeaturedWorkBand({ locale = 'en' }: { locale?: 'en' | 'id' }) {
  const isID = locale === 'id';
  const resumeData = isID ? resumeDataID : resumeDataEN;
  const basePath = process.env.NEXT_PUBLIC_BASE_PATH || '';
  const screenshotMap = projectScreenshots as Record<string, ProjectScreenshot[]>;

  const selectedExperience = SELECTED_COMPANIES.map((company) =>
    resumeData.work.find((entry) => entry.company === company)
  ).filter((entry): entry is (typeof resumeData.work)[number] => Boolean(entry));

  const originalRepos = (githubReposAll.repos as RepoItem[]).filter(
    (repo) =>
      !repo.fork &&
      !repo.archived &&
      repo.owner_login.toLowerCase() === 'nichsedge'
  );

  const flagshipProjects = FLAGSHIP_REPOS.flatMap((repoName) => {
    const repo = originalRepos.find((r) => r.name === repoName);
    if (!repo) return [];
    const captures = screenshotMap[repo.name] ?? [];
    const leadCapture: ProjectScreenshot | null = captures[0] ?? null;
    return [{ repo, leadCapture }];
  });

  const workHref = isID ? '/id/work/' : '/work/';
  const projectsHref = isID ? '/id/projects/' : '/projects/';

  return (
    <div className="space-y-12">
      {/* Selected Experience */}
      <div>
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 mb-6">
          <div>
            <div className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.2em] text-accent font-bold mb-1">
              <Briefcase size={12} />
              <span>{isID ? 'Rekam Jejak Produksi' : 'Production Track Record'}</span>
            </div>
            <h3 className="text-lg sm:text-xl font-bold text-text-0 tracking-tight">
              {isID ? 'Pengalaman Pilihan' : 'Selected Experience'}
            </h3>
          </div>
          <Link
            href={workHref}
            className="inline-flex items-center gap-1.5 font-mono text-[11px] uppercase tracking-wider text-text-2 hover:text-accent transition-colors whitespace-nowrap shrink-0"
          >
            <span>{isID ? 'Arsip Karir Lengkap' : 'Full Career Archive'}</span>
            <ArrowRight size={13} />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {selectedExperience.map((item) => (
            <Link
              key={item.company}
              href={workHref}
              className="group block p-5 bg-bg-1/75 border border-border-subtle hover:border-accent/50 rounded-sm transition-colors"
            >
              <div className="flex items-baseline justify-between gap-3 mb-1.5">
                <h4 className="font-mono text-sm font-bold text-text-0 group-hover:text-accent transition-colors">
                  {item.company}
                </h4>
                <span className="font-mono text-[10px] text-text-3 whitespace-nowrap shrink-0">
                  {formatPeriod(item.period.start, item.period.end, locale)}
                </span>
              </div>

              <div className="font-mono text-[11px] text-accent/90 mb-2.5">
                {item.role}
              </div>

              <p className="text-xs leading-relaxed text-text-2 mb-4 line-clamp-2">
                {item.shortDescription}
              </p>

              <div className="font-mono text-[10px] text-text-3 tracking-wide truncate">
                {item.tech.slice(0, 4).join(' · ')}
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* Flagship Systems */}
      <div>
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 mb-6">
          <div>
            <div className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.2em] text-accent font-bold mb-1">
              <Layers size={12} />
              <span>{isID ? 'Sistem & Produk Unggulan' : 'Shipped Architecture'}</span>
            </div>
            <h3 className="text-lg sm:text-xl font-bold text-text-0 tracking-tight">
              {isID ? 'Proyek Unggulan' : 'Flagship Systems'}
            </h3>
          </div>
          <Link
            href={projectsHref}
            className="inline-flex items-center gap-1.5 font-mono text-[11px] uppercase tracking-wider text-text-2 hover:text-accent transition-colors whitespace-nowrap shrink-0"
          >
            <span>
              {isID
                ? `Jelajahi ${originalRepos.length} Repositori`
                : `Explore ${originalRepos.length} Repositories`}
            </span>
            <ArrowRight size={13} />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {flagshipProjects.map(({ repo, leadCapture }) => {
            const imgSrc =
              leadCapture &&
              leadCapture.url.startsWith('/') &&
              !leadCapture.url.startsWith('//')
                ? `${basePath}${leadCapture.url}`
                : leadCapture?.url;

            const updatedYear = repo.pushed_at ? repo.pushed_at.slice(0, 4) : '';
            const metaParts = [
              repo.language || 'Multi-stack',
              updatedYear,
              repo.stargazers_count > 0 ? `${repo.stargazers_count} ★` : null,
            ].filter(Boolean);

            return (
              <article
                key={repo.name}
                className="group flex flex-col bg-bg-1/75 border border-border-subtle hover:border-accent/50 rounded-sm overflow-hidden transition-colors"
              >
                {leadCapture && imgSrc && (
                  <a
                    href={repo.html_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="relative block aspect-video w-full overflow-hidden border-b border-border-subtle bg-bg"
                  >
                    <Image
                      src={imgSrc}
                      alt={`${repo.name} — ${leadCapture.caption}`}
                      fill
                      sizes="(min-width: 768px) 48vw, 96vw"
                      referrerPolicy="no-referrer"
                      className="object-cover object-top transition-transform duration-500 group-hover:scale-[1.03]"
                    />
                  </a>
                )}

                <div className="p-5 flex-1 flex flex-col">
                  <div className="flex items-start justify-between gap-3 mb-2">
                    <a
                      href={repo.html_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="font-mono text-sm font-bold text-text-0 group-hover:text-accent transition-colors inline-flex items-center gap-1.5"
                    >
                      <span>{repo.name}</span>
                      <ArrowUpRight size={13} className="opacity-60 group-hover:opacity-100" />
                    </a>
                    <div className="flex items-center gap-1.5 font-mono text-[10px] text-text-3 whitespace-nowrap shrink-0">
                      {repo.stargazers_count > 0 && <Star size={10} className="text-accent" />}
                      <span>{metaParts.join(' · ')}</span>
                    </div>
                  </div>

                  <p className="text-xs leading-relaxed text-text-2 line-clamp-2 flex-1">
                    {repo.description ||
                      (isID
                        ? 'Sistem produksi dan eksplorasi arsitektur sumber terbuka.'
                        : 'Open-source production system and architectural exploration.')}
                  </p>
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </div>
  );
}
