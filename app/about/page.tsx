import React from 'react';
import { Metadata } from 'next';
import { Navbar } from '@/components/navbar';
import { JsonLd } from '@/components/json-ld';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'About Ichsanul Amal | Data Engineer & System Architect',
  description: 'Learn about Ichsanul Amal (Nichsedge), Data Quality Engineer at Krom Bank and former Data Engineering Analyst at Accenture, specializing in enterprise data lakes and ETL systems.',
  alternates: {
    canonical: 'https://nichsedge.github.io/about',
    languages: {
      en: 'https://nichsedge.github.io/about',
      id: 'https://nichsedge.github.io/id',
      'x-default': 'https://nichsedge.github.io/about',
    },
  },
};

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-bg text-text-0">
      <JsonLd
        breadcrumbs={[
          { name: 'Home', item: 'https://nichsedge.github.io' },
          { name: 'About', item: 'https://nichsedge.github.io/about' },
        ]}
      />
      <Navbar />

      <main className="max-w-4xl mx-auto px-4 py-8 sm:py-12 space-y-8 font-sans">
        <header className="border-b border-border-subtle pb-6">
          <div className="text-xs font-mono text-accent uppercase tracking-widest mb-2">Technical Dossier // Identity</div>
          <h1 className="text-3xl sm:text-4xl font-mono font-bold tracking-tight text-text-0">About Ichsanul Amal (Nichsedge)</h1>
          <p className="mt-2 text-text-muted text-base leading-relaxed">
            Data Quality Engineer & System Architect specializing in deterministic data engines, distributed pipeline orchestration, and AI-native vibe coding.
          </p>
        </header>

        <section className="space-y-4">
          <h2 className="text-xl font-mono font-semibold text-text-0 border-l-2 border-accent pl-3">Professional Biography</h2>
          <p className="text-text-muted leading-relaxed">
            Ichsanul Amal (known professionally as Nichsedge) is an enterprise data engineer and systems architect currently serving as a Data Quality Engineer at Krom Bank Indonesia. Prior to Krom Bank, he worked as a Data Engineering, Governance, and Management Analyst at Accenture, where he designed data quality validation models and automated metadata migrations across 4,000+ critical data components.
          </p>
          <p className="text-text-muted leading-relaxed">
            With deep expertise in cloud architectures on Google Cloud Platform (GCP) and Amazon Web Services (AWS), Ichsanul specializes in dimensional data warehouse modeling (Kimball methodology), continuous data quality assurance (DAMA dimensions, dbt tests, Elementary), and high-throughput streaming pipelines using Apache Airflow, Kafka, and Google BigQuery.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-xl font-mono font-semibold text-text-0 border-l-2 border-accent pl-3">Academic Foundation & Honors</h2>
          <p className="text-text-muted leading-relaxed">
            Ichsanul graduated with a Bachelor of Science in Computer Science (Information Systems) from the University of Indonesia, achieving a 3.77 / 4.00 GPA. During his academic career, he served as a Teaching Assistant for core computer science coursework including Python Programming, Calculus, and Operating Systems, while conducting aspect-based sentiment analysis research at the IR-NLP Lab CSUI.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-xl font-mono font-semibold text-text-0 border-l-2 border-accent pl-3">Core Engineering Philosophy</h2>
          <ul className="list-disc list-inside space-y-2 text-text-muted">
            <li><strong>Deterministic Systems:</strong> Eliminating data rot through automated schema enforcement and zero-entropy pipelines.</li>
            <li><strong>Agent-First Architecture:</strong> Building web applications and APIs that are first-class citizens for autonomous AI agents via Model Context Protocol (MCP) and WebMCP.</li>
            <li><strong>Observability & Governance:</strong> Continuous telemetry, proactive anomaly alerting in Mode BI, and clear lineage tracking across multi-stage ETL networks.</li>
          </ul>
        </section>

        <section className="pt-6 border-t border-border-subtle flex flex-wrap gap-4 text-sm font-mono">
          <Link href="/work" className="text-accent hover:underline">→ Explore Career History</Link>
          <Link href="/projects" className="text-accent hover:underline">→ View Engineering Projects</Link>
          <Link href="/developers" className="text-accent hover:underline">→ Developer & Agent APIs</Link>
          <Link href="/contact" className="text-accent hover:underline">→ Contact Channels</Link>
        </section>
      </main>
    </div>
  );
}
