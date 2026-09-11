import React from 'react';
import { Metadata } from 'next';
import { Navbar } from '@/components/navbar';
import { JsonLd } from '@/components/json-ld';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Consulting & Architecture Pricing | Ichsanul Amal',
  description: 'Transparent consulting rates, architecture audit packages, and open-source availability for Ichsanul Amal (Nichsedge).',
  alternates: {
    canonical: 'https://nichsedge.github.io/pricing',
  },
};

export default function PricingPage() {
  return (
    <div className="min-h-screen bg-bg text-text-0">
      <JsonLd
        breadcrumbs={[
          { name: 'Home', item: 'https://nichsedge.github.io' },
          { name: 'Pricing', item: 'https://nichsedge.github.io/pricing' },
        ]}
      />
      <Navbar />

      <main className="max-w-4xl mx-auto px-4 py-8 sm:py-12 space-y-8 font-sans">
        <header className="border-b border-border-subtle pb-6">
          <div className="text-xs font-mono text-accent uppercase tracking-widest mb-2">Services // Tiers & Rates</div>
          <h1 className="text-3xl sm:text-4xl font-mono font-bold tracking-tight text-text-0">Consulting & Architecture Pricing</h1>
          <p className="mt-2 text-text-muted text-base leading-relaxed">
            Machine-readable consulting tiers, architectural review milestones, and contract rates for data platform engineering. Also available as plain markdown at <Link href="/pricing.md" className="text-accent underline">/pricing.md</Link>.
          </p>
        </header>

        <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="p-6 border border-border-subtle bg-surface/50 rounded-lg space-y-4">
            <div className="text-xs font-mono text-emerald-400 uppercase tracking-wider">Tier 01 // Community</div>
            <h2 className="text-2xl font-mono font-bold text-text-0">Open Source & Free</h2>
            <div className="text-3xl font-mono font-bold text-accent">$0 <span className="text-sm font-normal text-text-muted">USD</span></div>
            <p className="text-text-muted text-sm leading-relaxed">
              Full access to public GitHub repositories, open-source dbt frameworks, BigQuery partitioning scripts, and machine-readable agent APIs.
            </p>
            <ul className="text-xs font-mono space-y-1 text-text-muted list-disc list-inside">
              <li>MIT licensed codebases</li>
              <li>Pre-rendered OpenAPI specifications</li>
              <li>WebMCP in-browser agent tools</li>
            </ul>
          </div>

          <div className="p-6 border border-accent/40 bg-surface/80 rounded-lg space-y-4">
            <div className="text-xs font-mono text-accent uppercase tracking-wider">Tier 02 // Architecture Review</div>
            <h2 className="text-2xl font-mono font-bold text-text-0">Architectural Audit</h2>
            <div className="text-3xl font-mono font-bold text-accent">$1,500 <span className="text-sm font-normal text-text-muted">USD / flat rate</span></div>
            <p className="text-text-muted text-sm leading-relaxed">
              Deep-dive assessment of your existing BigQuery slot consumption, dbt data models, PostgreSQL indexing, and Airflow orchestration DAGs.
            </p>
            <ul className="text-xs font-mono space-y-1 text-text-muted list-disc list-inside">
              <li>Comprehensive technical audit report</li>
              <li>BigQuery query cost reduction strategy</li>
              <li>PostgreSQL index & partitioning review</li>
            </ul>
          </div>

          <div className="p-6 border border-border-subtle bg-surface/50 rounded-lg space-y-4">
            <div className="text-xs font-mono text-accent uppercase tracking-wider">Tier 03 // Retainer</div>
            <h2 className="text-2xl font-mono font-bold text-text-0">Data Engineering Retainer</h2>
            <div className="text-3xl font-mono font-bold text-accent">$85 <span className="text-sm font-normal text-text-muted">USD / hr (or $6,500/mo)</span></div>
            <p className="text-text-muted text-sm leading-relaxed">
              Dedicated contract data engineering: designing production lakehouses, cross-platform replication pipelines, and real-time Kafka streaming architectures.
            </p>
            <ul className="text-xs font-mono space-y-1 text-text-muted list-disc list-inside">
              <li>Production ETL/ELT pipeline implementation</li>
              <li>Continuous DAMA data quality testing</li>
              <li>Slack & standup integration</li>
            </ul>
          </div>

          <div className="p-6 border border-border-subtle bg-surface/50 rounded-lg space-y-4">
            <div className="text-xs font-mono text-accent uppercase tracking-wider">Tier 04 // Agentic Systems</div>
            <h2 className="text-2xl font-mono font-bold text-text-0">Model Context Protocol (MCP)</h2>
            <div className="text-3xl font-mono font-bold text-accent">$2,500 <span className="text-sm font-normal text-text-muted">USD / milestone</span></div>
            <p className="text-text-muted text-sm leading-relaxed">
              Custom MCP server engineering, WebMCP integration, agent discovery catalogs, and tool-calling validation for AI products.
            </p>
            <ul className="text-xs font-mono space-y-1 text-text-muted list-disc list-inside">
              <li>Production Streamable HTTP MCP server</li>
              <li>WebMCP client registration & declarative forms</li>
              <li>Full Ora.ai AX audit optimization</li>
            </ul>
          </div>
        </section>

        <section className="space-y-4">
          <h2 className="text-xl font-mono font-semibold text-text-0 border-l-2 border-accent pl-3">Settlement & Remittance Rails</h2>
          <p className="text-text-muted leading-relaxed">
            Invoices can be settled via international remittance (PayPal, Wise upon request), Indonesian national banking rails (Bank Mandiri, BNI, Bank Aladin Syariah, Krom Bank, Bank Jago, Superbank, CIMB Niaga), digital e-wallets (ShopeePay, GoPay, OVO), or on-chain USDC/USDT on EVM networks (Ethereum, Arbitrum, Polygon). Complete verified account details and wallet addresses are published at <Link href="/pay" className="text-accent underline">/pay</Link>.
          </p>
        </section>

        <section className="pt-6 border-t border-border-subtle flex flex-wrap gap-4 text-sm font-mono">
          <Link href="/contact" className="text-accent hover:underline">→ Book Consultation</Link>
          <Link href="/developers" className="text-accent hover:underline">→ Developer Portal</Link>
          <Link href="/work" className="text-accent hover:underline">→ View Past Deliverables</Link>
        </section>
      </main>
    </div>
  );
}
