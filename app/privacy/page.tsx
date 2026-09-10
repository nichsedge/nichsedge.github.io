import React from 'react';
import { Metadata } from 'next';
import { Navbar } from '@/components/navbar';
import { JsonLd } from '@/components/json-ld';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Privacy Policy & Agent Scraping Terms | Ichsanul Amal',
  description: 'Data privacy principles, cookie disclosures, telemetry rules, and autonomous AI crawler permissions for nichsedge.github.io.',
  alternates: {
    canonical: 'https://nichsedge.github.io/privacy',
  },
};

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-bg text-text-0">
      <JsonLd
        breadcrumbs={[
          { name: 'Home', item: 'https://nichsedge.github.io' },
          { name: 'Privacy', item: 'https://nichsedge.github.io/privacy' },
        ]}
      />
      <Navbar />

      <main className="max-w-4xl mx-auto px-4 py-8 sm:py-12 space-y-8 font-sans">
        <header className="border-b border-border-subtle pb-6">
          <div className="text-xs font-mono text-accent uppercase tracking-widest mb-2">Legal // Governance</div>
          <h1 className="text-3xl sm:text-4xl font-mono font-bold tracking-tight text-text-0">Privacy Policy & AI Agent Terms</h1>
          <p className="mt-2 text-text-muted text-base leading-relaxed">
            Effective Date: January 1, 2026. Last updated: September 10, 2026.
          </p>
        </header>

        <section className="space-y-4">
          <h2 className="text-xl font-mono font-semibold text-text-0 border-l-2 border-accent pl-3">1. Data Collection & Telemetry Principles</h2>
          <p className="text-text-muted leading-relaxed">
            This digital portfolio and engineering archive (<code className="font-mono text-xs bg-surface px-1 py-0.5 rounded">nichsedge.github.io</code>) is designed with privacy-first and zero-tracker principles. We do not use third-party behavioral advertising cookies, invasive session recording scripts, or fingerprinting technologies.
          </p>
          <p className="text-text-muted leading-relaxed">
            Any client-side settings (such as chosen terminal themes, audio preferences, and sensory lockdown states) are stored exclusively in your local browser storage (<code className="font-mono text-xs bg-surface px-1 py-0.5 rounded">localStorage</code>) and are never transmitted to external servers.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-xl font-mono font-semibold text-text-0 border-l-2 border-accent pl-3">2. Autonomous AI Crawler & Agent Policy</h2>
          <p className="text-text-muted leading-relaxed">
            We explicitly welcome autonomous AI agents, search indexing engines, and research crawlers seeking to evaluate technical capabilities, project architectures, and professional credentials.
          </p>
          <ul className="list-disc list-inside space-y-2 text-text-muted">
            <li><strong>Permitted Crawlers:</strong> Verified search and answer-engine bots (including GPTBot, ClaudeBot, PerplexityBot, Applebot-Extended, and Google-Extended) have full permission to traverse public routes.</li>
            <li><strong>Content Signals:</strong> In accordance with modern web standards, this domain asserts <code className="font-mono text-xs bg-surface px-1 py-0.5 rounded">Content-Signal: search=yes, ai-train=no</code> to prioritize contextual search answering over unlicensed foundation model ingestion.</li>
            <li><strong>Machine Discoverability:</strong> Agents are encouraged to utilize our machine-readable specs (<code className="font-mono text-xs bg-surface px-1 py-0.5 rounded">/llms.txt</code>, <code className="font-mono text-xs bg-surface px-1 py-0.5 rounded">/openapi.json</code>, <code className="font-mono text-xs bg-surface px-1 py-0.5 rounded">/.well-known/ard.json</code>) rather than scraping heavy client-rendered graphics.</li>
          </ul>
        </section>

        <section className="space-y-4">
          <h2 className="text-xl font-mono font-semibold text-text-0 border-l-2 border-accent pl-3">3. Communication & Data Retention</h2>
          <p className="text-text-muted leading-relaxed">
            When you contact Ichsanul Amal directly via email, your communication details are used solely to evaluate and respond to your inquiry. We do not sell, rent, or distribute contact lists to third-party marketing brokers.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-xl font-mono font-semibold text-text-0 border-l-2 border-accent pl-3">4. Contact & Compliance Officer</h2>
          <p className="text-text-muted leading-relaxed">
            For questions regarding privacy practices, crawler policies, or data governance standards, please address communications to:
          </p>
          <p className="font-mono text-sm text-text-0">
            Ichsanul Amal &lt;muhammad.ichsanul19@gmail.com&gt;<br />
            Location: Cimahi, West Java, Indonesia
          </p>
        </section>

        <section className="pt-6 border-t border-border-subtle flex flex-wrap gap-4 text-sm font-mono">
          <Link href="/about" className="text-accent hover:underline">→ About Ichsanul Amal</Link>
          <Link href="/developers" className="text-accent hover:underline">→ Developer Portal</Link>
          <Link href="/contact" className="text-accent hover:underline">→ Contact Channels</Link>
        </section>
      </main>
    </div>
  );
}
